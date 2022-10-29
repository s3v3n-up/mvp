//third-party import
import Navbar from "@/components/navbar/Navbar";
import React from "react";

//local import
import styles from "@/styles/Components.module.sass";

/**
 * page that handles all that similar components for all pages
 */

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Navbar/>
            { children }
        </div>
    );
};

export default Layout;