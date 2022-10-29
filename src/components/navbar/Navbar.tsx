//third-party import
import Image from "next/image";
import Link from "next/link";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */


export default function Navbar() {
    return (
        <>
            <div className={styles.nav}>
                <Image
                    className={styles.img}
                    src={"/icons/logo.png"}
                    alt="logo"
                    width={130}
                    height={100}
                />

                <div className={styles.option}>
                    <Link href={"/"}>
                        <p>Ranking</p>
                    </Link>
                    <Link href={"/"}>
                        <p>Matches</p>
                    </Link>
                    <Link href={"/"}>
                        <p>Create Match</p>
                    </Link>
                    <Link href={"/"}>
                        <p>History</p>
                    </Link>
                </div>

                <div className={styles.auth}>
                    <Image src={"/icons/avatar.png"} alt="logo" width={25} height={25} />
                    <Link href={"/"}>
                        <p>Logout</p>
                    </Link>
                </div>
            </div>

            <div className={styles.bottomNav}>
                <div className={styles.option}>
                    <Link href={"/"}>
                        <p>Ranking</p>
                    </Link>
                    <Link href={"/"}>
                        <p>Matches</p>
                    </Link>
                    <Link href={"/"}>
                        <p>Create Match</p>
                    </Link>
                    <Link href={"/"}>
                        <p>History</p>
                    </Link>
                </div>
            </div>
        </>
    );
}
