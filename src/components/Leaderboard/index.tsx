//import styling for standings component
import styles from "./leaderboard.module.sass";

//interface for the standings
interface Props {
    standings: {
        _id: string;
        numberOfWins: number;
    }[];
}

//leaderboard component
export default function Standings(props: Props) {
    return (
        <div className={styles.leaderboard}>
            <div className={styles.topics}>
                <div className={styles.infoleft}>Rank</div>
                <div className={styles.info}>Player</div>
                <div className={styles.inforight}>Wins</div>
            </div>
            {props.standings.map((standing, index) => {

                //change the color of the bar based on the rank
                const style = index <= 2 ? styles.ranks: index <= 5 ? styles.ranks2: styles.ranks3;

                return (
                    <div key={index} className={style}>
                        <div className={styles.infoleft}>{index+1}</div>
                        <div className={styles.info}>{standing._id}</div>
                        <div className={styles.inforight}>{standing.numberOfWins}</div>
                    </div>
                );
            })}
        </div>
    );
}