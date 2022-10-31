//third-party import
import Image from "next/image";
import Link from "next/link";
import Icon from "@mui/material/Icon";
import { signOut } from "next-auth/react";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * *
 *  @description components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */
export default function Navbar() {
    return (
        <>
            <div className={styles.nav}>
                <div className="relative w-32 h-12">
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="left"
                    />
                </div>
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
                    <div className="relative h-10 w-10 rounded-full">
                        <Image
                            src="https://i.pravatar.cc/300?img=2"
                            alt="avatar"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center center"
                            className="rounded-full"
                        />
                    </div>
                    <Link href={"/login"}>
                        <button onClick={ ()=>signOut() }>Logout</button>
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
