import styles from '../styles/leaderboard.module.sass'
import Image from 'next/image'
import Standings from '@/components/Leaderboard/Leaderboard'

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