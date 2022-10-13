import styles from "./Tab.module.sass";
import Card from "./card";

export default function Tab(props) {
    return(
        <div className={styles.background}>
            <div className={styles.titleContainer}>
                <div className={styles.createTab}>
                <p>Created Match</p>
                </div>
                <div className={styles.historyTab}>
                    <p>History</p>
                </div>
            </div>
            <Card/>
        </div>
        
        
    

        
    )
}