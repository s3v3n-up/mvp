//import styling for standings component
import styles from "./leaderboard.module.sass";

//leaderboard component
export default function Standings() {
    return (
        <div className={styles.leaderboard}>
            <div className={styles.topics}>
                <div className={styles.infoleft}>Rank</div>
                <div className={styles.info}>Player</div>
                <div className={styles.inforight}>Wins</div>
            </div>
            <div className={styles.ranks}>
                <div className={styles.infoleft}>1</div>
                <div className={styles.info}>Player 1</div>
                <div className={styles.inforight}>10</div>
            </div>
            <div className={styles.ranks}>
                <div className={styles.infoleft}>2</div>
                <div className={styles.info}>Player 2</div>
                <div className={styles.inforight}>9</div>
            </div>
            <div className={styles.ranks}>
                <div className={styles.infoleft}>3</div>
                <div className={styles.info}>Player 3</div>
                <div className={styles.inforight}>8</div>
            </div>
            <div className={styles.ranks2}>
                <div className={styles.infoleft}>4</div>
                <div className={styles.info}>Player 4</div>
                <div className={styles.inforight}>7</div>
            </div>
            <div className={styles.ranks2}>
                <div className={styles.infoleft}>5</div>
                <div className={styles.info}>Player 5</div>
                <div className={styles.inforight}>6</div>
            </div>
            <div className={styles.ranks2}>
                <div className={styles.infoleft}>6</div>
                <div className={styles.info}>Player 6</div>
                <div className={styles.inforight}>5</div>
            </div>
            <div className={styles.ranks3}>
                <div className={styles.infoleft}>7</div>
                <div className={styles.info}>Player 7</div>
                <div className={styles.inforight}>4</div>
            </div>
        </div>
    );
}