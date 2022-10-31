//third-party import
import Navbar from "@/components/navbar";
import React, { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * *
 * @description page that handles all that similar components for all pages
 */
 interface Props {
    children: ReactNode
}
const Layout = ({ children }: Props) => {
    const router = useRouter();
    const isAuthPage = router.pathname === "/login" || router.pathname === "/register";

    return (
        <div className={styles.container}>
            <div className="fixed top-0 bottom-0 right-0 left-0 -z-50">
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
        </div>
    );
};
export default Layout;