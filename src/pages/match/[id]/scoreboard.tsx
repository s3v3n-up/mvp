//third party imports
import Image from "next/image";
import { GetStaticPropsContext } from "next";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

//local import
import { getMatches, getMatchById } from "@/lib/actions/match";
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

    useEffect(()=> {
        if (status === "unauthenticated") {
            router.push("/login");

            return;
        }
        if (session && session.user) {
            setIsMatchHost(session.user.userName === match.matchHost);
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

    //team score states
    const [homeScore, setHomeScore] = useState<number>(0);
    const [awayScore, setAwayScore] = useState<number>(0);

    //is match over state
    const [isFinished, setFinished] = useState<boolean>(false);

    //handle match score change
    function handleScoreChange(team: "home" | "away", score: number) {
        if (team === "home") {
            setHomeScore(score);
        }
        else {
            setAwayScore(score);
        }
    }

    //refetch match data every 1 seconds
    const { data, error } = useSWR<{match: Match}>(`/api/match/${match._id}`,fetcher, {
        refreshInterval: 1000,
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
            }
        })();
    },[data, error]);

    //guard against if match is finished or cancelled
    useEffect(()=> {
        if (currMatch.status === "FINISHED") {
            router.push(`/match/${currMatch._id}/result`);
        }
        if (currMatch.status === "CANCELLED") {
            router.push(`/match/${currMatch._id}/cancel`);
        }
    }, [currMatch, router]);

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
            <h2 className="text-white text-center mt-5 text-3xl font-bold">
                    00:00
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
                        <input
                            className="z-10 bg-white p-5 py-9 w-11/12 m-auto rounded-md text-black font-extrabold text-3xl text-center border-2 border-orange-500"
                            type="number"
                            value={homeScore}
                            onChange={(e)=> handleScoreChange("home", parseInt(e.target.value))}
                            readOnly={!isMatchHost}
                        />
                    </div>
                    <div className={styles.homeplayers}>
                        {
                            homeTeam.map((player, index) =>
                                <Player
                                    key={index}
                                    userName={player.userName}
                                    image={player.image}
                                    isLeavable={isLeavable}
                                    onLeave={()=> {}}
                                    variant="home"
                                />
                            )
                        }
                    </div>
                    <button className={styles.pause}> Pause </button>
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
                        <input
                            className="z-10 bg-white p-5 py-9 w-11/12 m-auto rounded-md text-black font-extrabold text-3xl text-center"
                            type="number"
                            value={awayScore}
                            onChange={(e)=> handleScoreChange("away", parseInt(e.target.value))}
                            readOnly={!isMatchHost}
                        />
                    </div>
                    <div className={styles.awayplayers}>
                        {
                            awayTeam.map((player, index) =>
                                <Player
                                    key={index}
                                    userName={player.userName}
                                    image={player.image}
                                    isLeavable={isLeavable}
                                    onLeave={()=> {}}
                                    variant="away"
                                />
                            )
                        }
                    </div>
                    <button
                        className={styles.finish}
                        onClick={()=> setFinished(true)}
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * generate all path for static generate scoreboard
 */
export async function getStaticPaths() {
    await Database.setup();
    const matches = await getMatches();
    const paths = matches.map((match: Match)=> ({ params: { id: match._id?.toString() } }));

    return {
        paths,
        fallback: "blocking"
    };
}

/**
 * incrementally generate scoreboard page every 10 seconds
 * @param context - context of the page
 */
export async function getStaticProps(context: GetStaticPropsContext) {
    const { id } = context.params!;
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
                destination: `/match/${id}/cancel`,
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
        },
        revalidate: 10
    };
}