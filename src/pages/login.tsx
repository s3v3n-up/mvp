//third-party imports
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mui/material";
import { Email } from "@mui/icons-material";
import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

//local imports
import styles from "@/styles/Login.module.sass";
import Button from "@/components/buttons/primaryButton";
import Input from "@/components/Input";

/**
 * @description this page lets user login using their email
 */
export default function Login() {

    //email state
    const [email, setEmail] = useState("");

    /**
     * handle email input change
     */
    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    /**
     * handle email submission
     */
    function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        signIn("email", { email });
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.about}>
                    <h2>Are YOU the MVP?</h2>
                    <p>
                       Create your matches <br/>
                       Schedule your face-off<br/>
                       Put your skills to the test.
                    </p>
                    <h2>Can you be #1?</h2>
                </div>
            </div>
            <div className="flex flex-col items-center flex-auto">
                <div className={styles.imgwrapper}>
                    <Image src={"/img/logo.png"} alt="logo" width={263} height={184} />
                </div>
                <form className={styles.input} onSubmit={handleEmailSubmit}>
                    <div className={styles.email}>
                        <Input
                            type="email"
                            placeholder="enter your email"
                            value={email}
                            onChange={handleEmailChange}
                        >
                            <Email />
                        </Input>
                        <Button type="submit" className={styles.login}>
                            Login
                        </Button>
                        <div className="flex w-full items-center gap-2 my-5">
                            <hr className="flex-1"/>
                            <p className="flex-none text-white">OR</p>
                            <hr className="flex-1"/>
                        </div>
                        <button
                            className={ styles.discord }
                            type="button"
                            onClick={ ()=> {
                                signIn("discord");
                            } }>
                            <Icon fontSize="large">
                                <Image
                                    width={100}
                                    height={100}
                                    src={"/icons/discord.png"}
                                    alt={"icon"}
                                    layout="responsive"
                                />
                            </Icon>
                            <p>Continue with Discord</p>
                        </button>
                        <button
                            className={styles.google}
                            type="button"
                            onClick={()=> {
                                signIn("google");
                            }}
                        >
                            <Icon fontSize="large">
                                <Image
                                    width={100}
                                    height={100}
                                    src={"/icons/google.png"}
                                    alt={"icon"}
                                    layout="responsive"
                                />
                            </Icon>
                            <p>Continue with Google</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
