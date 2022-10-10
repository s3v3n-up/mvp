import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Login.module.sass";
import Link from "next/link";

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
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        width={263}
                        height={184}
                    />
                </div>

                <div className={styles.input}>
                    <div className={styles.email}>
                        {/* <Image className={styles.iconemail} src={"/icons/email.png"} width={21} height={16} alt="icon"/> */}
                        <input type="email" placeholder="enter your email" />
                        <Link href={""}>
                            <a className={styles.login}>Log In</a>
                        </Link>
                        <Image
                            className={styles.line}
                            src={"/icons/Line.png"}
                            width={400}
                            height={35}
                            alt={"line"}
                        />
                        <button className={styles.discord}>
                            <Image width={50} height={50} src={"/icons/discord.png"} alt={"icon"}/>
                            <p>Continue with Discord</p>
                        </button>

                        <button className={styles.google}>
                            <Image width={50} height={50} src={"/icons/google.png"} alt={"icon"} />
                            <p>Continue with Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
