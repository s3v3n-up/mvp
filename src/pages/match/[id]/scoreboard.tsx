//nextjs import
import Image from "next/image";
import { GetStaticPropsContext } from "next";

//backend import
import { getMatches, getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";

//types import
import type { Match } from "@/lib/types/Match";

//components import
import Player from "@/components/scoreboard/player";

//styles import
import styles from "@/styles/Scoreboard.module.sass";

//fake players data
const teams = [
    [
        {
            name: "Player 1",
            image: "https://i.pravatar.cc/300?img=1",
        },
        {
            name: "Player 2",
            image: "https://i.pravatar.cc/300?img=2",
        },
        {
            name: "Player 3",
            image: "https://i.pravatar.cc/300?img=3",
        },
    ],[
        {
            name: "Player 4",
            image: "https://i.pravatar.cc/300?img=4",
        },
        {
            name: "Player 5",
            image: "https://i.pravatar.cc/300?img=5",
        },
        {
            name: "Player 6",
            image: "https://i.pravatar.cc/300?img=6",
        }
    ]
];

/**
 * scoreboard page
 * @param props - match of the scoreboard
 * @returns {JSX.Element} scoreboard page element
 */
export default function Scoreboard(props: Match) {
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
                        <div className="z-10 bg-white p-5 py-9 w-11/12 m-auto rounded-md border-2 border-orange-600">
                            <h1 className="text-black font-extrabold text-3xl text-center">0</h1>
                        </div>
                    </div>
                    <div className={styles.homeplayers}>
                        { teams[0].map((player, index) => (
                            <Player
                                key={index}
                                image={player.image}
                                name={player.name}
                                onLeave={() => console.log("leave")}
                                variant="home"
                            />
                        ))}
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
                        <div className="z-10 bg-white p-5 py-9 w-11/12 m-auto rounded-md">
                            <h1 className="text-black font-extrabold text-3xl text-center">0</h1>
                        </div>
                    </div>
                    <div className={styles.awayplayers}>
                        { teams[1].map((player, index) => (
                            <Player
                                key={index}
                                image={player.image}
                                name={player.name}
                                onLeave={() => console.log("leave")}
                                variant="away"
                            />
                        ))}
                    </div>
                    <button className={styles.finish}> Finish </button>
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
    const paths = matches.map((match: Match)=> ({ params: { id: match._id } }));

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
    const match = await getMatchById(id as string);

    return {
        props: {
            match: JSON.parse(JSON.stringify(match))
        },
        revalidate: 10
    };
}