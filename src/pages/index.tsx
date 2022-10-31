//third-party import
import Image from "next/image";

//local import
import Layout from "@/components/layout/Layout";
import styles from "@/styles/Home.module.sass";

//create fake data for card components
const names = ["whale", "squid", "turtle", "coral", "starfish", "star"];

/**
 * *
 * @description this page displays all the matches created by users from regular matches to quick matches
 *
 */
export default function Home() {
    return (
        <Layout>
            <div className={styles.matches}>
                <div className={styles.search}>
                    <h1>Matches</h1>
                    <div className={styles.searchitem}>
                        <input type={"text"} placeholder={"Enter username or location"} />
                        <button>
                            <Image
                                src={"/icons/search.png"}
                                width={17}
                                height={17}
                                alt={"logo"}
                            ></Image>
                        </button>
                    </div>
                </div>

                <div>
                    <p>Quick Matches</p>
                    <div className={styles.container}>
                        {names.map((name) => (
                            <div className={styles.cards} key={name}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <p>Regular Matches</p>
                    <div className={styles.container}>
                        {names.map((name) => (
                            <div className={styles.cards} key={name}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
