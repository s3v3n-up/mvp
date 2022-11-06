//third-party import
import Navbar from "@/components/navbar";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Components.module.sass";

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
            {!isAuthPage && <Navbar/> }
            <main className="flex-auto z-10">
                { children }
            </main>
        </section>
    );
};
export default Layout;