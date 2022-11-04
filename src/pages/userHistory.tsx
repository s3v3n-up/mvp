// All the imports needed for the page
import styles from "@/styles/History.module.sass";

// import tab component to display user's live and past matches
import Tab from "@/components/tab/tab";

// History function for page
export default function History() {
    return (
        <div className={styles.background}>
            <div className={styles.historyContainer}>
                <Tab />
            </div>
        </div>
    );
}
