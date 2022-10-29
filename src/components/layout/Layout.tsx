//third-party import
import Navbar from "@/components/navbar/Navbar";
import React, { ReactNode } from "react";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * page that handles all that similar components for all pages
 */

 interface Props {
    children: ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className={styles.container}>
            <Navbar/>
            { children }
        </div>
    );
};

export default Layout;