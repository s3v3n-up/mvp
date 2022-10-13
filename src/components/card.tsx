import styles from "./Card.module.sass";

export default function Card() {
    return(
        <div className={styles.cardContainer}>
            <div className={styles.cardInfo}>
                <div className={styles.time}>
                    <p>Time</p>
                </div>
                <div className={styles.sportType}>
                    <p>Soccer</p>
                </div>
                <div className={styles.miniContainer}>
                    <div className={styles.location}>
                        <p>Location</p>
                    </div>
                    <button className={styles.leaveButton}>Leave</button>
                </div>
            </div>
        </div>
    )
};