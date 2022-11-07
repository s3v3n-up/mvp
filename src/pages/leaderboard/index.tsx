import { getAllSports } from "@/lib/actions/sport";
import type { Sport } from "@/lib/types/Sport";
import SportButton from "@/components/Leaderboard/sport";
import Image from "next/image";

/**
 * page that displays all sports name for leaderboard
 */
export default function Leaderboard({ sports }: {sports: Sport[]}) {
    return (
        <section>
            <header className="flex flex-col items-center mb-10">
                <Image src="/crown.svg" alt="leaderboard" width={40} height={60} />
                <h1 className="text-center text-3xl font-bold text-white">Leaderboard</h1>
            </header>
            {sports.length === 0 &&
                <h2 className="text-white font-bold text-center text-2xl">
                    ⚠️ NO SPORT FOUND - ADMINS NEED TO ADD MORE SPORT
                </h2>
            }
            <ul className="flex flex-rows items-center justify-center flex-wrap sm:w-3/5 w-4/5 m-auto sm:p-5 p-3">
                {sports.length > 0 && sports.map((sport) => (
                    <li key={sport.name}>
                        <SportButton sportName={sport.name} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

/**
 * statically generate page
 */
export async function getStaticProps() {
    try {

        //get all sports from database
        const sports = await getAllSports();

        return {
            props: {
                sports: JSON.parse(JSON.stringify(sports))
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}