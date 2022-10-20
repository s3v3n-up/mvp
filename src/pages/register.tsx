import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Register.module.sass";
import Link from "next/link";

import { GetServerSideProps } from "next";
import React, { useState } from "react";


export default function Register() {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.about}>
                    <p> Are YOU the MVP?</p>
                    <p>Create your matches </p>
                    <p>Schedule your face-off</p>
                    <p>Put your skills to the test.</p>
                    <p>Can you be #1?</p>
                </div>
            </div>

            <div className={styles.background}>
                <div className={styles.imgwrapper}>
                    <Image src={"/img/logo.png"} alt={"logo"} width={263} height={184} />
                </div>
                <div className={styles.imgupload}>
                    <input type="file"/>
                    <button><Image src={"/icons/addprofile.png"} alt="icon" width={30} height={30}></Image></button>
                </div>
                <div className={styles.input}>
                    <div className={styles.info}>
                        <input type="firstname" placeholder="enter your first name" />
                        <input type="lastname" placeholder="enter your last name" />
                        <input type="username" placeholder="enter your username" />
                        <input type="phonenum" placeholder="enter your phone number" />

                        <Link href={""}>
                            <a className={styles.signup}>sign up</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
