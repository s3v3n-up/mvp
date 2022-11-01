//import styling from styles folder
import styles from "../styles/leaderboard.module.sass";

//import next/image
import Image from "next/image";

//import the standings component from the components folder
import Standings from "@/components/Leaderboard";
import axios from "axios";
import { useState , useEffect } from "react";

//Leaderboard page
export default function Leaderboard() {

    const [standings, setStandings] = useState([]);

    //get the top 10 standings from the api
    useEffect(() => {
        axios.get("/api/sport/soccer/leaderboard/10").then((res) => {
            const { data } = res;
            setStandings(data);
        });
    },[]);

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Image src="/crown.svg" alt="l" width={40} height={60} />
                <p className={styles.leader}>Leaderboard</p>
            </div>
            <Standings standings={standings}/>
        </div>
    );
}