//third party imports
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import Snackbar from "@mui/material/Snackbar";

//local import
import { getMatchById } from "@/lib/actions/match";
import { getUsersByUserName } from "@/lib/actions/user";
import Database from "@/lib/resources/database";
import type { Match } from "@/lib/types/Match";
import Player from "@/components/scoreboard/player";
import styles from "@/styles/Scoreboard.module.sass";
import fetcher from "@/lib/helpers/fetcher";
import { UserProfile } from "@/lib/types/User";
import { mapPlayerToTeam } from "@/lib/helpers/scoreboard";
import { getLocaleTime } from "@/lib/helpers/time";
import { alterSetInterval } from "@/lib/helpers/time";
import useAuth from "@/hooks/useAuth";
import useMatchNavigate from "@/hooks/useMatchStatus";

/**
 * scoreboard props type
 * @property {Match} match
 * @property {UserProfile[]} players list of profiles of players in the match
 */
interface Props {
    match: Match;
    players: UserProfile[];
}

/**
 * scoreboard page
 * @param props - match of the scoreboard
 * @returns {JSX.Element} scoreboard page element
 */
export default function Scoreboard({ match, players }: Props) {

    //guard page against unauthenticated users and check if user is host of the match or in the match
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [isMatchHost, setIsMatchHost] = useState<boolean>(false);
    const { session } = useAuth();

    //guard page against unauthenticated users and check if user is host of the match or in the match
    useEffect(()=> {
        if (session && session.user) {
            setIsMatchHost(session.user.id === match.matchHost);
            if (!match.teams[0].members.includes(session.user.userName) &&
                !match.teams[1].members.includes(session.user.userName)) {
                router.push("/");
            }
        }
    }, [session, router, match]);

    //match state
    const [currMatch, setMatch] = useState<Match>(match);

    //state for keeping track of if user could leave the match
    const [isLeavable, setIsLeavable] = useState<boolean>(true);

    //current home and away team members state
    const [homeTeam, setHomeTeam] = useState<UserProfile[]>(

        //map players profiles to home team
        mapPlayerToTeam(players, currMatch.teams)[0]
    );
    const [awayTeam, setAwayTeam] = useState<UserProfile[]>(

        //map players profiles to away team
        mapPlayerToTeam(players, currMatch.teams)[1]
    );

    //queue timer state - to display the time left for the queue
    const [queueTimer, setQueueTimer] = useState<number | null>(null);

    //match timer state - to display the time progress of the match
    const [matchTimer, setMatchTimer] = useState<number | null>(null);

    //team score states
    const [homeScore, setHomeScore] = useState<number>(
        currMatch.teams[0].score
    );
    const [awayScore, setAwayScore] = useState<number>(
        currMatch.teams[1].score
    );

    //network error state
    const [networkError, setNetworkError] = useState<string>("");

    //refetch match data every 1 seconds
    const { data, error } = useSWR<{match: Match}>(`/api/match/${id}`,fetcher, {
        refreshInterval: 100,
        fallback: { match: currMatch }
    });

    //every time match data is updated, update the states
    useEffect(()=> {
        (async()=> {
            if (data && !error) {
                setMatch(data.match);
                const allPlayers = data.match.teams[0].members.concat(data.match.teams[1].members);
                const players = await axios.get<UserProfile[]>(`/api/user?usernames=${allPlayers.join(",")}`);
                const mappedTeams = mapPlayerToTeam(players.data, data.match.teams);
                setHomeTeam(mappedTeams[0]);
                setAwayTeam(mappedTeams[1]);
                if (!isMatchHost) {
                    setHomeScore(data.match.teams[0].score);
                    setAwayScore(data.match.teams[1].score);
                }
            } else if (error) {
                setNetworkError("error getting match updates");
            }
        })();
    },[data, error, isMatchHost, currMatch]);

    //guard against if match is finished or cancelled
    useMatchNavigate(currMatch);

    //set the match queue timer
    useEffect(()=> {

        //game progress and queue timer placeholder
        let queuingTimer: ()=>void = ()=> {};
        let gameTimer: ()=>void = ()=>{};

        //get required amount of members of the match
        const { gameMode: { requiredPlayers: maxPlayer } } = currMatch;

        //get total number of members in the match
        const currMemberNumbers = (currMatch.teams[0].members.concat(currMatch.teams[1].members)).length;

        //boolean to check if match is full
        const isMemberFull = currMemberNumbers === maxPlayer;

        //if match is full, update match queue start time
        if (isMemberFull &&
            !currMatch.matchQueueStart &&
            !currMatch.matchStart &&
            currMatch.matchType !== "REGULAR") {
            (async()=>
                await axios.put(`/api/match/${id}/operation/queue`, {
                    queueStartTime: new Date().toString()
                }).catch(()=>{
                    setNetworkError("error setting match queue time");
                }))();
        };

        //if it's queuing time
        if (currMatch.matchQueueStart) {

            //queue start time
            const queueStart = getLocaleTime(currMatch.matchQueueStart);

            //queue timer interval
            queuingTimer = alterSetInterval(async()=> {
                const timeLeft = 31 - Math.floor((Date.now() - queueStart) / 1000);
                setQueueTimer(timeLeft);

                //check if 30 seconds has passed or if match is not full
                if (timeLeft <= 0 || !isMemberFull) {

                    //set queue start time to null
                    await axios.put(`/api/match/${id}/operation/queue`, {
                        queueStartTime: null
                    }).catch(()=>{
                        setNetworkError("error unset match queue time");
                    });

                    //set start time to now if time has passed 30 seconds
                    if(timeLeft <= 0) {
                        await axios.put(`/api/match/${id}/operation/start`, {
                            startTime: new Date().toString()
                        });
                    }
                    setQueueTimer(null);
                    queuingTimer();
                }
            }, 1000);
        }

        //if match has started(after queue timer has finished)
        if (currMatch.status === "INPROGRESS" && currMatch.matchStart) {

            //no one can leave the match
            setIsLeavable(false);

            //match start time
            const startTimer = getLocaleTime(currMatch.matchStart!);

            //accumulated pause delta time
            const accumulatedPauseDelta = currMatch.matchPauseDelta??0;

            //clear queue timer interval and set queue time to null
            queuingTimer();
            setQueueTimer(null);

            //match timer interval
            gameTimer = alterSetInterval(async()=> {

                //check if match members are full
                if (!isMemberFull) {

                    //if not full and match is not regular
                    if (currMatch.matchType !== "REGULAR") {
                        Promise.all([

                            //set match start time to null
                            await axios.put(`/api/match/${id}/operation/start`, {
                                startTime: null
                            }),

                            //set match status to upcoming
                            await axios.put(`/api/match/${id}/status`, {
                                status: "UPCOMING"
                            })
                        ]).catch(()=>{
                            setNetworkError("error unset match start time");
                        });
                    }

                    //if match is regular, cancel it
                    else {
                        await axios.put(`/api/match/${id}/status`, {
                            status: "CANCELLED"
                        }).catch(()=>{
                            setNetworkError("error cancelling match");
                        });
                    }
                    setMatchTimer(null);
                    gameTimer();
                } else {
                    const timeElapsed = Math.floor((Date.now() - startTimer) / 1000) - accumulatedPauseDelta;
                    setMatchTimer(timeElapsed);
                }
            }, 1000);
        } else if (currMatch.status === "PAUSED" && currMatch.matchPause) {

            //match start time
            const startTimer = getLocaleTime(currMatch.matchStart!);

            //get pause time
            const pauseTimer = getLocaleTime(currMatch.matchPause);

            //pause delta
            const AccumulatedPauseDelta = currMatch.matchPauseDelta??0;

            //get time progress of the match till pause
            const timeAccumlated = Math.floor((pauseTimer - startTimer) / 1000) - AccumulatedPauseDelta;

            //set timer to the point user hit click pause
            setMatchTimer(timeAccumlated);
            gameTimer();
        }

        //clear interval on unmount
        return ()=>{
            gameTimer();
            queuingTimer();
        };
    }, [currMatch, id]);

    //function for the host to pause the match
    const pauseMatch = debounce(async()=> {
        if(currMatch.status === "PAUSED") return;
        await axios.put(`/api/match/${id?.toString()}/operation/pause`, {
            pauseTime: new Date().toString()
        }).catch(()=>{
            setNetworkError("error pausing match");
        });
    }, 500);

    //function for host to end the match
    const endMatch = debounce(async()=> {
        await axios.put(`/api/match/${id?.toString()}/operation/finish`)
            .catch(()=> {
                setNetworkError("error ending match");
            });
    }, 500);

    //function for host to cancel the match
    const cancelMatch = debounce(async()=> {
        await axios.put(`/api/match/${id}/operation/cancel`, {
            cancelTime: new Date().toString()
        }).catch(()=> {
            setNetworkError("error cancelling match");
        });
    }, 500);

    //function for host to resume the match after pausing
    const resumeMatch = debounce(async()=> {
        if(currMatch.status === "INPROGRESS") return;
        await axios.put(`/api/match/${id}/operation/resume`, {
            resumeTime: new Date().toString()
        }).catch(()=>{
            setNetworkError("error resuming match");
        });
    }, 500);

    //handle increase and decrease score, debounce to prevent spamming
    const handleScoreChange = debounce(async(team: "home" | "away", type: "increase" | "decrease") => {
        if (currMatch.status !== "INPROGRESS") return;
        if (type === "increase") {
            if (team === "home") {
                setHomeScore(prev => prev + 1);
                await axios.put(`/api/match/${id}/score`,
                    {
                        teamIndex: 0,
                        operation: "increase"
                    }
                );
            } else {
                setAwayScore(prev => prev + 1);
                await axios.put(`/api/match/${id}/score`,
                    {
                        teamIndex: 1,
                        operation: "increase"
                    }
                );
            }
        } else {
            if (team === "home") {
                if (homeScore <= 0) return;
                setHomeScore(prev => prev - 1);
                await axios.put(`/api/match/${id}/score`,
                    {
                        teamIndex: 0,
                        operation: "decrease"
                    }
                );
            } else {
                if (awayScore <= 0) return;
                setAwayScore(prev => prev - 1);
                await axios.put(`/api/match/${id}/score`,
                    {
                        teamIndex: 1,
                        operation: "decrease"
                    }
                );
            }
        }
    }, 700);

    return(
        <div className={styles.page}>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={networkError? true:false}
                autoHideDuration={10000}
                onClose={()=> setNetworkError("")}
            >
                <p className="w-full bg-black p-5 drop-shadow-lg z-50 text-base">
                    <span className="text-yellow-500"> ⚠️ </span>
                    <span className="text-red-400">
                        {networkError}
                    </span>
                </p>
            </Snackbar>
            <div className="relative h-7 w-full">
                <Image
                    src="/crown.svg"
                    alt="crown icon"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                />
            </div>
            <h2 className="text-white text-center mt-5 text-3xl font-bold mb-3">
                {
                    currMatch.matchQueueStart &&
                    queueTimer &&
                    `Match is starting in ${queueTimer}`
                }
                {
                    matchTimer &&
                    `Match is in progress 
                    ${new Date(matchTimer * 1000).toISOString().slice(11, 19)}`
                }
            </h2>
            <div className={styles.scoreboard}>
                <div className={styles.hometeam}>
                    <h1 className={styles.home}>Home</h1>
                    <div className="relative w-full h-48 flex flex-col justify-center">
                        <div className="absolute bg-white w-full h-full rounded">
                            <Image
                                src="/scorebg.svg"
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                                alt="scorebg"
                                priority={true}
                            />
                        </div>
                        <div
                            className={
                                `z-10 bg-white p-5 py-9 
                                 w-11/12 m-auto rounded-md
                                text-black text-3xl text-center 
                                 border-2 border-orange-500
                                 flex flex-row justify-evenly
                                 items-center
                                 `
                            }
                        >
                            { isMatchHost &&
                                <button
                                    className={
                                        `bg-gray-300 w-5 
                                        h-5 rounded 
                                        text-base p-5 
                                        flex items-center 
                                        justify-center mr-auto`
                                    }
                                    onClick={
                                        ()=>handleScoreChange("home", "increase")
                                    }>
                                        +
                                </button>
                            }
                            <p className="font-extrabold">{homeScore}</p>
                            { isMatchHost &&
                                <button
                                    className={
                                        `bg-gray-300 w-5 
                                        h-5 rounded 
                                        text-base p-5 
                                        flex items-center 
                                        justify-center ml-auto`
                                    }
                                    onClick={
                                        ()=>handleScoreChange("home", "decrease")
                                    }>
                                    -
                                </button>
                            }
                        </div>
                    </div>
                    <div className={styles.homeplayers}>
                        {
                            homeTeam.map((player, index) =>
                                <Player
                                    key={index}
                                    userName={player.userName}
                                    image={player.image}
                                    isLeavable={isLeavable}
                                    variant="home"
                                    matchId={match._id!.toString()}
                                    hostId={match.matchHost}
                                />
                            )
                        }
                    </div>
                </div>
                <div className={styles.awayteam}>
                    <h1 className={styles.away}>Away</h1>
                    <div className="relative w-full h-48 flex flex-col justify-center">
                        <div className="absolute bg-orange-600 w-full h-full rounded">
                            <Image
                                src="/scorebg.svg"
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                                alt="bg"
                                priority={true}
                            />
                        </div>
                        <div
                            className={
                                `z-10 bg-white p-5 py-9 
                                w-11/12 m-auto rounded-md 
                                text-black text-3xl text-center
                                flex flex-row justify-evenly
                                items-center`
                            }
                        >
                            { isMatchHost &&
                                <button
                                    className={
                                        `bg-gray-300 w-5 
                                        h-5 rounded 
                                        p-5 text-base 
                                        flex items-center 
                                        justify-center mr-auto`
                                    }
                                    onClick={
                                        ()=>handleScoreChange("away", "increase")
                                    }
                                >
                                    +
                                </button>
                            }
                            <p className="font-extrabold">{awayScore}</p>
                            { isMatchHost &&
                                <button
                                    className={
                                        `bg-gray-300 w-5 
                                        h-5 rounded 
                                        p-5 text-base 
                                        flex items-center 
                                        justify-center ml-auto`
                                    }
                                    onClick={
                                        ()=>handleScoreChange("away", "decrease")
                                    }>
                                        -
                                </button>
                            }
                        </div>
                    </div>
                    <div className={styles.awayplayers}>
                        {
                            awayTeam.map(player =>
                                <Player
                                    key={player._id!.toString()}
                                    userName={player.userName}
                                    image={player.image}
                                    isLeavable={isLeavable}
                                    matchId={match._id!.toString()}
                                    variant="away"
                                    hostId={match.matchHost}
                                />
                            )
                        }
                    </div>
                </div>
                { isMatchHost &&
                    <>
                        { currMatch.status === "INPROGRESS" &&
                            <button
                                onClick={pauseMatch}
                                className={`${styles.pause} text-base p-5`}
                            >
                                Pause
                            </button>
                        }
                        { currMatch.status === "PAUSED" &&
                            <button
                                onClick={resumeMatch}
                                className={`${styles.pause} text-base p-5`}
                            >
                                Resume
                            </button>
                        }
                        { (currMatch.status === "INPROGRESS" || currMatch.status === "PAUSED") &&
                            <button
                                className={`${styles.finish} text-base p-5`}
                                onClick={endMatch}
                            >
                                Finish
                            </button>
                        }
                        <button
                            className={
                                `font-bold px-7 py-2 
                                text-center text-orange-500 
                                rounded border-2 
                                border-orange-500 md:w-1/4
                                w-full m-auto col-span-2 text-base p-5`
                            }
                            onClick={cancelMatch}
                        >
                            Cancel
                        </button>
                    </>
                }
            </div>
        </div>
    );
}

/**
 * incrementally generate scoreboard page every 1 seconds
 * @param context - context of the page
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {

    //get match id from url
    const { id } = context.params as { id: string };

    try {

        //setup database connection
        await Database.setup();

        //get match data
        const match = await getMatchById(id as string);

        //guards against finished or cancelled matches
        if (match.status === "FINISHED") {
            return {
                redirect: {
                    destination: `/match/${id}/result`,
                    permanent: false
                }
            };
        }

        if (match.status === "CANCELLED") {
            return {
                redirect: {
                    destination: "/match/cancel",
                    permanent: false
                }
            };
        }

        if (match.status === "UPCOMING" && match.matchType === "REGULAR") {
            const { gameMode: { requiredPlayers: maxPlayer } } = match;
            const currMemberNumbers = match.teams[0].members.length + match.teams[1].members.length;
            const isMemberFull = currMemberNumbers === maxPlayer;

            //if match is full, set match start queue time
            if (!isMemberFull){
                return {
                    redirect: {
                        destination: `/match/${id}`,
                        permanent: false
                    }
                };
            }
        }

        //get all profiles of players in the match
        const players = await getUsersByUserName(match.teams[0].members.concat(match.teams[1].members));

        return {
            props: {
                match: JSON.parse(JSON.stringify(match)),
                players: JSON.parse(JSON.stringify(players))
            }
        };
    } catch(error) {
        return {
            notFound: true
        };
    }
}