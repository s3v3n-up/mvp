//third-party imports
import Image from "next/image";
import Link from "next/link";

//local imports
import styles from "@/styles/Login.module.sass";

/**
 * *
 * @description this page lets user login using their email 
 *
 */
export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.about}>
                    <p> Are YOU the MVP?</p>
                    <p>Create your matches </p>
                    <p>Schedule your face-off</p>
                    <p>Put your skills to the test.</p>
                    <p>Can you be #1?</p>
                </div>
            </div>
            <div className={styles.background}>
                <div className={styles.imgwrapper}>
                    <Image src={"/img/logo.png"} alt="logo" width={263} height={184} />
                </div>
                <div className={styles.input}>
                    <div className={styles.email}>
                        <input type="email" placeholder="enter your email" />
                        <Link href={""}>
                            <a className={styles.login}>Login</a>
                        </Link>
                        <Image
                            className={styles.line}
                            src={"/icons/Line.png"}
                            width={400}
                            height={35}
                            alt={"line"}
                        />
                        <button className={styles.discord}>
                            <Image
                                width={50}
                                height={50}
                                src={"/icons/discord.png"}
                                alt={"icon"}
                            />
                            <p>Continue with Discord</p>
                        </button>
                        <button className={styles.google}>
                            <Image
                                width={50}
                                height={50}
                                src={"/icons/google.png"}
                                alt={"icon"}
                            />
                            <p>Continue with Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
