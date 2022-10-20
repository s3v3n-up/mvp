import Navbar from "@/components/navbar/Navbar";
import style from "@/styles/Layout.module.sass";
import React from "react";

const Layout = ({ children }) => {
    return (

        <div className={style.container}>
            <Navbar/>
            { children }
        </div>
    );
};

export default Layout;