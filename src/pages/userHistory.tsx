import styles from "../styles/History.module.sass";
//import Image from 'next/image';
import Card from "@/components/card";
import Tab from "@/components/tab";

export default function History() {
    return(
        <div className={styles.background}>
            <div className={styles.historyContainer}>
                <Tab/>
                <Card/>
            </div>

        </div>
    );
}