//third-party import
import Navbar from "@/components/navbar";
import { ReactNode, useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Components.module.sass";
import { AvatarContext } from "@/context/avatar";

//dynamic import
const Skeleton = dynamic(() => import("@mui/material/Skeleton"), { ssr: false });

/**
 * *
 * @description page that handles all that similar components for all pages
 */
 interface Props {
    children: ReactNode
}

/**
 * main layout of website contain the global navbar and website content
 * @param website content
 * @returns {JSX.Element} layout of website
 */
const Layout = ({ children }: Props) => {
    const router = useRouter();
    const isAuthPage = router.pathname === "/login" || router.pathname === "/register";
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

    return (
        <section className={styles.container}>
            <div className="fixed top-0 bottom-0 right-0 left-0 -z-50 bg-black">
                <Image
                    src="/bg.svg"
                    layout="fill"
                    objectFit="cover"
                    alt="background"
                    objectPosition={"top center"}
                    priority={true}
                />
            </div>
            {!isAuthPage && <Navbar /> }
            <nav className="md:hidden flex flex-row justify-between pr-3 pt-3 items-center">
                <div className="relative w-32 h-12 mr-auto">
                    <Image
                        src={"/img/logo.png"}
                        alt="logo"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="left"
                    />
                </div>
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
            </nav>
            <main className="flex-auto z-10">
                { children }
            </main>
        </section>
    );
};
export default Layout;