//third party imports
import Image from "next/image";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import debounce from "lodash.debounce";

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
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMatchHost, setIsMatchHost] = useState<boolean>(false);

    //guard page against unauthenticated users and check if user is host of the match or in the match
    useEffect(()=> {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (session && session.user) {
            setIsMatchHost(session.user.id === match.matchHost);
            if (!match.teams[0].members.includes(session.user.userName)
                && !match.teams[1].members.includes(session.user.userName)) {
                router.push("/");
            }
        }
    }, [session, status, router, match]);

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

    //set the queue timer
    const [queueTimer, setQueueTimer] = useState<number | null>(null);

    //set the match timer
    const [matchTimer, setMatchTimer] = useState<number | null>(null);

    //team score states
    const [homeScore, setHomeScore] = useState<number>(
        currMatch.teams[0].score
    );
    const [awayScore, setAwayScore] = useState<number>(
        currMatch.teams[1].score
    );

    //refetch match data every 1 seconds
    const { data, error } = useSWR<{match: Match}>(`/api/match/${match._id?.toString()}`,fetcher, {
        refreshInterval: 100,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        fallback: match
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
            } else {
                console.log(error);
            }
        })();
    },[data, error, isMatchHost, currMatch]);

    //guard against if match is finished or cancelled
    useEffect(()=> {
        if (currMatch.status === "FINISHED") {
            router.push(`/match/${currMatch._id?.toString()}/result`);
        }
        if (currMatch.status === "CANCELLED") {
            router.push("/match/cancel");
        }
    }, [currMatch, router]);

    //set the match queue timer
    useEffect(()=> {
        let queuingTimer: NodeJS.Timeout | null;
        let gameTimer: NodeJS.Timeout | null;

        async function updateTimer() {
            const { gameMode: { requiredPlayers: maxPlayer } } = currMatch;
            const currMemberNumbers = currMatch.teams[0].members.length + currMatch.teams[1].members.length;
            const isMemberFull = currMemberNumbers === maxPlayer;

            //if match is full, set match start queue time
            if (isMemberFull && !currMatch.matchQueueStart && !currMatch.matchStart
                && currMatch.matchType !== "REGULAR") {
                await axios.put(`/api/match/${currMatch._id?.toString()}/time/queue`, {
                    queueStartTime: new Date().toString()
                });
            };

            //queuing timer
            if (currMatch.matchQueueStart) {

                //queue start time
                const queueStart = new Date(new Date(currMatch.matchQueueStart).toUTCString()).getTime();

                //queue timer
                queuingTimer = setInterval(async()=> {
                    const now = new Date(new Date().toUTCString()).getTime();
                    const timeDiff = 35 - Math.floor((now - queueStart) / 1000);
                    setQueueTimer(timeDiff);

                    //check if 30 seconds has passed or if match is not full
                    if (timeDiff <= 0 || !isMemberFull) {

                        //set queue start time to null
                        await axios.put(`/api/match/${currMatch._id?.toString()}/time/queue`, {
                            queueStartTime: null
                        });

                        //set start time to now if time has passed 30 seconds
                        if(timeDiff <= 0) {
                            await axios.put(`/api/match/${currMatch._id?.toString()}/operation/start`, {
                                startTime: new Date().toString()
                            });
                        }
                        setQueueTimer(null);
                        clearInterval(queuingTimer as NodeJS.Timeout);
                    }
                }, 1000);
            }

            //match progress timer(timer after queue timer is finished)
            if (currMatch.status === "INPROGRESS" && currMatch.matchStart) {
                setIsLeavable(false);
                const startTimer = new Date(new Date(currMatch.matchStart).toUTCString()).getTime();
                clearInterval(queuingTimer as NodeJS.Timeout);
                setQueueTimer(null);

                //set match timer to null, if match does not have enough members
                if (!isMemberFull) {
                    await axios.put(`/api/match/${currMatch._id?.toString()}/time/start`, {
                        startTime: null
                    });
                    await axios.put(`/api/match/${currMatch._id?.toString()}/status`, {
                        status: "UPCOMING"
                    });
                    setMatchTimer(null);
                    clearInterval(gameTimer as NodeJS.Timeout);
                }

                //checks if the match is paused
                if(currMatch.matchPause){

                    //get pause time
                    const pauseTimer = new Date(new Date(currMatch.matchPause).toUTCString()).getTime();

                    //get time difference start and pause time
                    const timePassed = Math.floor((pauseTimer - startTimer) / 1000);

                    //if match is in progress, start the timer from the time difference else stop timer, clear the interval
                    gameTimer = setInterval(async()=> {
                        const now = new Date(new Date().toUTCString()).getTime();
                        const timeDiff = Math.floor((now - pauseTimer)/1000) + timePassed;
                        setMatchTimer(timeDiff);
                    }, 1000);
                } else {

                    //timer start from start time
                    gameTimer = setInterval(async()=> {
                        const now = new Date(new Date().toUTCString()).getTime();
                        const timeDiff = Math.floor((now - startTimer) / 1000);
                        setMatchTimer(timeDiff);
                    }, 1000);
                }
            } else if (currMatch.status === "PAUSED" && currMatch.matchPause) {

                //match start time
                const startTimer = new Date(new Date(currMatch.matchStart!).toUTCString()).getTime();

                //get pause time
                const pauseTimer = new Date(new Date(currMatch.matchPause).toUTCString()).getTime();

                //get time difference start and pause time in seconds
                const timePassed = Math.floor((pauseTimer - startTimer) / 1000);

                //set timer to the point user hit click pause
                setMatchTimer(timePassed);
                clearInterval(gameTimer as NodeJS.Timeout);
            }
        }
        updateTimer();

        //clear interval on unmount
        return ()=>{
            clearInterval(gameTimer??0);
            clearInterval(queuingTimer??0);
        };
    }, [currMatch]);

    //function for the host to pause the match
    const pauseMatch = debounce(async()=> {
        try{
            if(currMatch.status === "PAUSED") return;
            await axios.put(`/api/match/${currMatch._id?.toString()}/operation/pause`, {
                pauseTime: new Date().toString()
            });
        } catch(err: any){
            alert(err.response.data.message);
        }
    }, 500);

    //function for the host to resume the match after pausing
    const resumeMatch = debounce(async()=> {
        try{
            if(currMatch.status === "INPROGRESS") return;
            await axios.put(`/api/match/${currMatch._id?.toString()}/status`, {
                status: "INPROGRESS"
            });
        } catch(err: any){
            alert(err.response.data.message);
        }
    }, 500);

    //function for host to end the match
    const endMatch = debounce(async()=> {
        try{
            await axios.put(`/api/match/${currMatch._id?.toString()}/operation/finish`);
        } catch(err: any){
            alert(err.response.data.message);
        }
    }, 500);

    //function for host to cancel the match
    const cancelMatch = debounce(async()=> {
        try{
            await axios.put(`/api/match/${currMatch._id?.toString()}/operation/cancel`);
        } catch(err: any) {
            alert(err.response.data.message);
        }
    }, 500);

    //handle increase and decrease score, debounce to prevent spamming
    const handleScoreChange = debounce(async(team: "home" | "away", type: "increase" | "decrease") => {
        if (currMatch.status !== "INPROGRESS") return;
        if (type === "increase") {
            if (team === "home") {
                setHomeScore(prev => prev + 1);
                await axios.put(`/api/match/${currMatch._id?.toString()}/score`, { teamIndex: 0, operation: "increase" });
            } else {
                setAwayScore(prev => prev + 1);
                await axios.put(`/api/match/${currMatch._id?.toString()}/score`, { teamIndex: 1, operation: "increase" });
            }
        } else {
            if (team === "home") {
                if (homeScore <= 0) return;
                setHomeScore(prev => prev - 1);
                await axios.put(`/api/match/${currMatch._id?.toString()}/score`, { teamIndex: 0, operation: "decrease" });
            } else {
                if (awayScore <= 0) return;
                setAwayScore(prev => prev - 1);
                await axios.put(`/api/match/${currMatch._id?.toString()}/score`, { teamIndex: 1, operation: "decrease" });
            }
        }
    }, 700);

    return(
        <div className={styles.page}>
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
                { currMatch.matchQueueStart && queueTimer && "Match is starting in " + queueTimer }
                { matchTimer && "Match is in progress " + new Date(matchTimer * 1000).toISOString().slice(11, 19) }
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
                            { isMatchHost && <button
                                className="bg-gray-300 w-5 h-5 rounded text-base p-5 flex items-center justify-center mr-auto"
                                onClick={()=>handleScoreChange("home", "increase") }>+</button> }
                            <p className="font-extrabold">{homeScore}</p>
                            { isMatchHost && <button
                                className="bg-gray-300 w-5 h-5 rounded text-base p-5 flex items-center justify-center ml-auto"
                                onClick={()=>handleScoreChange("home", "decrease")}>-</button> }
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
                            { isMatchHost && <button
                                className="bg-gray-300 w-5 h-5 rounded p-5 text-base flex items-center justify-center mr-auto"
                                onClick={()=>handleScoreChange("away", "increase")}>+</button> }
                            <p className="font-extrabold">{awayScore}</p>
                            { isMatchHost && <button
                                className="bg-gray-300 w-5 h-5 rounded p-5 text-base flex items-center justify-center ml-auto"
                                onClick={()=>handleScoreChange("away", "decrease")}>-</button> }
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
                            <button onClick={pauseMatch} className={`${styles.pause} text-base p-5`}>
                                Pause
                            </button>
                        }
                        { currMatch.status === "PAUSED" &&
                            <button onClick={resumeMatch} className={`${styles.pause} text-base p-5`}>
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
    const { id } = context.params!;

    try {
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