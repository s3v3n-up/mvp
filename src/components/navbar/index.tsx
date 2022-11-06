//third-party import
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Menu, Close } from "@mui/icons-material";
import { useContext } from "react";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Components.module.sass";
import { AvatarContext } from "@/context/avatar";

//dynamic import
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));

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
                    <Link href={"/"}>
                        <li>Ranking</li>
                    </Link>
                    <Link href={"/"}>
                        <li>Matches</li>
                    </Link>
                    <Link href={"/"}>
                        <li>
                            Create Match
                        </li>
                    </Link>
                    <Link href={"/"}>
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
                    <Link href={"/"}>
                        <p>Ranking</p>
                    </Link>
                    <Link href={"/"}>
                        History
                    </Link>

                    <div className="hidden md:flex items-center space-x-6 px-4">
                        <Link href={"/user/profile"}>
                            <div className="relative h-14 w-14 rounded-full bg-white">
                                <Image
                                    src={avatar}
                                    alt="avatar"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="center center"
                                    className="rounded-full"
                                />
                            </div>
                        </Link>

                        <Link href={"/login"} >
                            <button className="text-white bg-[#FC5C3E] rounded py-1 px-2 hidden md:flex" onClick={handleLogout}>Logout</button>
                        </Link>
                    </div>
                </ul>
            </nav>
        </header>
    );
}