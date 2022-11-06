//third-party import
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useContext } from "react";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Components.module.sass";
import { AvatarContext } from "@/context/avatar";

//dynamic import
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));
const LeaderboardIcon = dynamic(()=> import("@mui/icons-material/Leaderboard"), { ssr: false });
const HomeIcon = dynamic(()=>import("@mui/icons-material/Home"), { ssr: false });
const AddHomeOutlinedIcon = dynamic(()=>import("@mui/icons-material/AddHomeOutlined"), { ssr: false });
const Person = dynamic(()=>import("@mui/icons-material/Person"), { ssr: false });

/**
 * *
 *  @description components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */
export default function Navbar() {
    const avatarContext = useContext(AvatarContext);
    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

    //user profile image
    const [avatar, setAvatar] = useState("/img/logo.png");

    //set user profile image
    useEffect(() => {
        if (avatarContext && avatarContext.currAvatar) {
            setAvatar(avatarContext.currAvatar);
        }
    }, [avatarContext]);

    const router = useRouter();

    /**
     * handle user sign out
     */
    async function handleLogout() {
        await signOut();
        avatarContext?.setCurrAvatar(null);
        router.push("/");
    }

    return (
        <header className="z-50">
            <nav className={styles.nav}>
                <div className="relative w-32 h-12">
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="left"
                    />
                </div>
                <ul className={styles.option}>
                    <Link href={"/leaderboard"}>
                        <li>Ranking</li>
                    </Link>
                    <Link href={"/"}>
                        <li>Matches</li>
                    </Link>
                    <Link href={"/create"}>
                        <li>
                            Create Match
                        </li>
                    </Link>
                    <Link href={"/userHistory"}>
                        <li>History</li>
                    </Link>
                </ul>
                <ul className={styles.auth}>
                    <button className="relative h-14 w-14 rounded-full" onClick={()=>router.push("/user/profile")}>
                        { isAvatarLoaded &&
                            <Skeleton
                                variant="circular"
                                width="100%"
                                height="100%"
                                animation="wave"
                            />
                        }
                        <Image
                            src={avatar}
                            alt="avatar"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center center"
                            className="rounded-full"
                            onLoad={() => setIsAvatarLoaded(true)}
                        />
                    </button>
                    <button onClick={ handleLogout }>Logout</button>
                </ul>
            </nav>
            <nav className={styles.bottomNav}>
                <ul className={styles.option}>
                    <Link href={"/leaderboard"}>
                        <li className="flex flex-col items-center cursor-pointer">
                            <LeaderboardIcon/>
                            Ranking
                        </li>
                    </Link>
                    <Link href={"/"}>
                        <li className="flex flex-col items-center cursor-pointer">
                            <HomeIcon />
                            Matches
                        </li>
                    </Link>
                    <Link href={"/create"}>
                        <li className="flex flex-col items-center cursor-pointer">
                            <AddHomeOutlinedIcon />
                            Create Match
                        </li>
                    </Link>
                    <Link href={"/userHistory"}>
                        <li className="flex flex-col items-center cursor-pointer">
                            <Person />
                            History
                        </li>
                    </Link>
                </ul>
            </nav>
        </header>
    );
}