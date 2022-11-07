//Import component style module
import styles from "@/styles/Components.module.sass";

//Interface for match detail props
interface Props {
  startTime: string;
  sport: string;
  location: string;
}

//Card component to display match information
export default function Card(details: Props) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardInfo}>
        <div className={styles.time}>
          <p>{details.startTime}</p>
        </div>
        <div className={styles.sportType}>
          <p>{details.sport}</p>
        </div>
        <div className={styles.miniContainer}>
          <div className={styles.location}>
            <p>{details.location}</p>
          </div>
          <button className={styles.cancelButton}>Leave</button>
          <button className={styles.cancelButton}>Delete</button>
        </div>
      </div>
    </div>
  );
}
