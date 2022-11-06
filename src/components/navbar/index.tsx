//third-party import
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Menu, Close } from "@mui/icons-material";
import { useContext } from "react";

//local import
import styles from "@/styles/Components.module.sass";
import { ProfileContext } from "@/context/profile";

/**
 * *
 *  @description components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */
export default function Navbar() {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav);

    //auth session
    const { data: session } = useSession();
    const profileContext = useContext(ProfileContext);

    //user profile image
    const [avatar, setAvatar] = useState("/img/logo.png");

    //set user profile image
    useEffect(() => {
        if (profileContext && profileContext.currProfile) {
            setAvatar(profileContext.currProfile.image);
        }
    }, [profileContext]);

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
            <div className="top-0 flex w-full justify-between px-4 py-4 ">
                <div>
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        width={120}
                        height={100}
                        objectFit="cover"
                        objectPosition="left"
                    />
                </div>
                <div className="hidden md:flex items-center space-x-6 text-white text-xl font-semibold">
                    <Link href={"/"}>
                        Category
                    </Link>
                    <Link href={"/"}>
                        Matches
                    </Link>
                    <Link href={"/create"}>
                        Create Match
                    </Link>
                    <Link href={"/quickmatch"}>
                        Create Quick Match
                    </Link>
                    <Link href={"/leaderboard"}>
                        Ranking
                    </Link>
                    <Link href={"/"}>
                        History
                    </Link>
                </div>
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
                <div className="relative h-10 w-10 rounded-full flex justify-end sm:hidden cursor-pointer">
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
                </div>
                <div className="md:hidden flex justify-end" onClick={handleClick}>
                    {!nav ? <Menu className="w-6" color="warning" /> : <Close className="w-6" color="warning"/>}
                </div>
                <ul className={!nav ? "hidden":"absolute w-2/4 px-10 rounded-lg text-[#FC5C3E] bg-neutral-900 text-lg" }>
                    <li>
                        <Link href={"/"} className=" py-2 px-4 text-sm hover:bg-white">
                        Category
                        </Link>
                    </li>
                    <li>
                        <Link href={"/"} className=" py-2 px-4 text-sm hover:bg-white">
                        Matches
                        </Link>
                    </li>
                    <li>
                        <Link href={"/create"} className=" py-2 px-4 text-sm hover:bg-white">
                        Create Match
                        </Link>
                    </li>
                    <li>
                        <Link href={"/quickmatch"} className=" py-2 px-4 text-sm hover:bg-white">
                        Create Quick Match
                        </Link>
                    </li>
                    <li>
                        <Link href={"/leaderboard"} className=" py-2 px-4 text-sm hover:bg-white">
                        Ranking
                        </Link>
                    </li>
                    <li>
                        <Link href={"/"} className=" py-2 px-4 text-sm hover:bg-white">
                        History
                        </Link>
                    </li>
                    <li>
                        <Link href={"/login"} className="py-2 px-4 text-sm hover:bg-white">
                            <button className="text-white bg-[#FC5C3E] rounded py-1 px-2 md:flex" onClick={handleLogout}>Logout</button>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}