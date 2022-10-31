//import styling from styles folder
import styles from '../styles/leaderboard.module.sass'
//import next/image
import Image from 'next/image'
//import the standings component from the components folder
import Standings from '@/components/Leaderboard/Leaderboard'

//Leaderboard page
export default function Leaderboard() {
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Image src="/crown.svg" alt="l" width={40} height={60} />
                <p className={styles.leader}>Leaderboard</p>    
            </div>
            <Standings/>
        </div>
    )
}