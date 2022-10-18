import PrimaryButton from "@/components/buttons/primaryButton";
import SecondaryButton from "@/components/buttons/secondaryButton";
import Layout from "@/components/layout/Layout";
import Image from "next/image";
import styles from "@/styles/Home.module.sass";


const names = ["whale", "squid", "turtle", "coral", "starfish"];

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
                    <div>
                        {names.map(name =>
                            <div className={styles.quick} key={name}>
                                <p>{name}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className={styles.regular}>
                    <p>Regular Matches</p>
                    <div>
                        <div className={styles.quick}>
                            <div>

                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </Layout>
    );
}
