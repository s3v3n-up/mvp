//third-party import
import Image from "next/image";
import Link from "next/link";
import Icon from "@mui/material/Icon";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * *
 *  @description components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */
export default function Navbar() {

    //auth session
    const { data: session } = useSession();

    //user profile image
    const [avatar, setAvatar] = useState("/img/logo.png");

    //set user profile image
    useEffect(() => {
        if (session && session.user.isFinishedSignup) {
            setAvatar(session.user.profile!.image);
        }
    }, [session]);

    const router = useRouter();

    /**
     * handle user sign out
     */
    function handleLogout() {
        signOut();
        router.push("/");
    }

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
                    <div className="relative h-14 w-14 rounded-full">
                        <Image
                            src={avatar}
                            alt="avatar"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center center"
                            className="rounded-full"
                        />
                    </div>
                    <button onClick={ handleLogout }>Logout</button>
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
