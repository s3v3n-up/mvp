//third-party import
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useContext } from "react";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Components.module.sass";
import { AvatarContext } from "@/context/avatar";
import NavTab from "./navtab";

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

    //navbar color state
    const [navbarColor, setNavbarColor] = useState("bg-transparent");

    useEffect(()=>{
        function handleScroll() {
            if (window.scrollY > 0) {
                setNavbarColor("bg-[#1a1a1a] bg-opacity-90");
            } else {
                setNavbarColor("bg-transparent");
            }
        }
        if (window) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        <header className={`z-50 sticky top-0 ${navbarColor} flex items-center justify-center`}>
            <nav className={styles.nav}>
                <button className="relative w-32 h-12" onClick={()=>router.push("/")}>
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="left"
                    />
                </button>
                <ul className={styles.option}>
                    <NavTab href="/" pageName="Matches"/>
                    <NavTab href="/create" pageName="Create"/>
                    <NavTab href="/leaderboard" pageName="Leaderboard"/>
                    <NavTab href="/userHistory" pageName="History"/>
                </ul>
                <ul className={styles.auth}>
                    <button className="relative h-14 w-14 rounded-full bg-white" onClick={()=>router.push("/user/profile")}>
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
                            className="rounded-full bg-white"
                            onLoad={() => setIsAvatarLoaded(true)}
                        />
                    </button>
                    <button onClick={ handleLogout }>Logout</button>
                </ul>
            </nav>
            <nav className={styles.bottomNav}>
                <ul className={styles.option}>
                    <NavTab href="/" pageName="Matches">
                        <HomeIcon/>
                    </NavTab>
                    <NavTab href="/create" pageName="Create">
                        <AddHomeOutlinedIcon/>
                    </NavTab>
                    <NavTab href="/leaderboard" pageName="Leaderboard">
                        <LeaderboardIcon/>
                    </NavTab>
                    <NavTab href="/userHistory" pageName="History">
                        <Person/>
                    </NavTab>
                </ul>
            </nav>
        </header>
    );
}