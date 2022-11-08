//third-party import
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/router";

//local import
import Standings from "@/components/Leaderboard";
import { useState , useEffect } from "react";
import styles from "@/styles/leaderboard.module.sass";
import Database from "@/lib/resources/database";
import { getLeaderboardOfSport } from "@/lib/actions/match";
import { getAllSports } from "@/lib/actions/sport";
import { GetStaticPropsContext } from "next";
import fetcher from "@/lib/helpers/fetcher";

/**
 * Props type for Leaderboard page
 */
interface Props {
    leaderboard: {
        _id: string;
        numberOfWins: number;
    }[]
}

//Leaderboard page for a specific sport
export default function Leaderboard({ leaderboard }: Props) {
    const router = useRouter();

    //current leaderboard sportname
    const { sportname } = router.query;

    //leaderboard state
    const [standings, setStandings] = useState([]);

    //page, curr max records state for leaderboard pagination, each page will have 10 players
    const [page, setPage] = useState(1);

    //state for keeping track of if all records have been loaded
    const [currMaxRecords, setCurrMaxRecors] = useState(10);
    const [maxRecordsReached, setMaxRecordsReached] = useState(false);

    //refetch leaderboard every 10 seconds
    const { data, error } = useSWR(`/api/sport/${ sportname }/leaderboard/${ 10 * page }`, fetcher, {
        fallback: leaderboard,
        refreshInterval: 10000
    });

    //update state when data is updated
    useEffect(() => {
        if (data && !error) {
            setStandings(data);
            if (currMaxRecords < data.length) {
                setCurrMaxRecors(data.length);
                setMaxRecordsReached(false);
            } else {
                setMaxRecordsReached(true);
            }
        }
    },[data, error, currMaxRecords]);

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Image src="/crown.svg" alt="l" width={40} height={60} />
                <p className={styles.leader}>{`${sportname}'s leaderboard`}</p>
            </div>
            <Standings standings={standings}/>
            {!maxRecordsReached &&
                <button className="text-orange-500 w-full text-center mt-5" onClick={() => setPage(page + 1)}>
                    Load more
                </button>
            }
        </div>
    );
}

/**
 * get all paths for dynamically static generate leaderboard page
 */
export async function getStaticPaths() {

    //setup database connection
    await Database.setup();
    const sports = await getAllSports();
    const paths = sports.map((sport) => ({
        params: { sportname: sport.name }
    }));

    return { paths, fallback: "blocking" };
}

/**
 * incrementally static generate leaderboard page every 10 seconds
 */
export async function getStaticProps(context: GetStaticPropsContext) {

    //setup database connection
    await Database.setup();

    //get sportname from context
    const { sportname } = context.params as { sportname: string };

    //get leaderboard of sport
    const leaderboard = await getLeaderboardOfSport(sportname, 10);

    return {
        props: {
            leaderboard: JSON.parse(JSON.stringify(leaderboard))
        },
        revalidate: 10
    };
}