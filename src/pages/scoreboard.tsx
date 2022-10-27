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
                    objectPosition="center"
                />
            </div>
            <div className={styles.scoreboard}>
                <div className={styles.hometeam}>
                    <h1 className={styles.home}>Home</h1>
                    <div className="relative w-full h-40 flex flex-col justify-center">
                        <div className="absolute bg-white w-full h-full rounded">
                            <Image
                                src="/scorebg.svg"
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                                alt="scorebg"
                            />
                        </div>
                        <div className="z-10 bg-white p-5 w-11/12 m-auto rounded-md border-2 border-orange-600">
                            <h1 className="text-black font-extrabold text-3xl text-center">8</h1>
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
                    <button className={styles.pause}> Pause </button>
                </div>
                <div className={styles.awayteam}>
                    <h1 className={styles.away}>Away</h1>
                    <div className="relative w-full h-40 flex flex-col justify-center">
                        <div className="absolute bg-orange-600 w-full h-full rounded">
                            <Image
                                src="/scorebg.svg"
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                                alt="bg"
                            />
                        </div>
                        <div className="z-10 bg-white p-5 w-11/12 m-auto rounded-md">
                            <h1 className="text-black font-extrabold text-3xl text-center">8</h1>
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
                    <button className={styles.finish}> Finish </button>
                </div>
            </div>
        </div>
    );
}