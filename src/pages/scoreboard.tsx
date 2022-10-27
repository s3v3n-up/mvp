import styles from "../styles/Scoreboard.module.sass";
import Image from "next/image";

export default function Scoreboard(){
    return(
        <div className={styles.page}>
            <div className="relative h-7 w-full">
                <Image
                    src="/crown.svg"
                    alt="crown icon"
                    layout="fill"
                    objectFit="contain"
                    objectPosition={"center"}
                />
            </div>
            <div className={styles.scoreboard}>
                <div className={styles.hometeam}>
                    <h1 className={styles.home}>Home</h1>
                    <div className={styles.scoreh}>
                        <div className={styles.points}>
                            <h1>24</h1>
                        </div>
                    </div>
                    <div className={styles.homeplayers}>
                        <div className={styles.homeplayer}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 1</h1>
                            <button className={styles.homeleave}> Leave </button>
                        </div>
                        <div className={styles.homeplayer}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 2</h1>
                            <button className={styles.homeleave}> Leave </button>
                        </div>
                        <div className={styles.homeplayer}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 3</h1>
                            <button className={styles.homeleave}> Leave </button>
                        </div>
                    </div>
                    <div className={styles.button}>
                        <button className={styles.pause}> Pause </button>
                    </div>
                </div>
                <div className={styles.awayteam}>
                    <h1 className={styles.away}>Away</h1>
                    <div className={styles.scorea}>
                        <div className={styles.points}>
                            <h1>8</h1>
                        </div>
                    </div>
                    <div className={styles.awayplayers}>
                        <div className={styles.player}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 1</h1>
                            <button className={styles.leave}> Leave </button>
                        </div>
                        <div className={styles.player}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 2</h1>
                            <button className={styles.leave}> Leave </button>
                        </div>
                        <div className={styles.player}>
                            <Image src="/icon.svg" width={39.75} height={29.33} alt="icon"/>
                            <h1>Player 3</h1>
                            <button className={styles.leave}> Leave </button>
                        </div>
                    </div>
                    <div className={styles.buttone}>
                        <button className={styles.finish}> Finish </button>
                    </div>
                </div>
            </div>
        </div>
    );
}