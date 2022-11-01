//third-party import
import Image from "next/image";
import Link from "next/link";
import Icon from "@mui/material/Icon";
import { signOut } from "next-auth/react";
import { Menu, Close } from "@mui/icons-material";

//local import
import styles from "@/styles/Components.module.sass";
import { useState } from "react";

/**
 * *
 *  @description components for navigation bar and bottom navigation, both responsive for mobile and desktop
 */
export default function Navbar() {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav);

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
                    <div className="relative h-10 w-10 rounded-full md:flex cursor-pointer">
                        <Link href={"/profile"}>
                            <Image
                                src="https://i.pravatar.cc/300?img=2"
                                alt="avatar"
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center center"
                                className="rounded-full"
                            />
                        </Link>
                    </div>
                    <Link href={"/login"} >
                        <button className="text-white bg-[#FC5C3E] rounded py-1 px-2 hidden md:flex" onClick={ ()=>signOut() }>Logout</button>
                    </Link>
                </div>
            </div>
            <div className="relative h-10 w-10 rounded-full flex justify-end md:hidden cursor-pointer">
                <Link href={"/profile"}>
                    <Image
                        src="https://i.pravatar.cc/300?img=2"
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center center"
                        className="rounded-full"
                    />
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
                        <button className="text-white bg-[#FC5C3E] rounded py-0.9 px-1 " onClick={ ()=>signOut() }>Logout</button>
                    </Link>
                </li>
            </ul>


        </>
    );
}