//third-party imports
import Image from "next/image";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dynamic from "next/dynamic";

// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

//local imports
import styles from "@/styles/Login.module.sass";
import Button from "@/components/buttons/primaryButton";
import Input from "@/components/Input";
import useAuth from "@/hooks/useAuth";

//dynamic imports
const EmailIcon = dynamic(() => import("@mui/icons-material/Email"));
const IconComponent = dynamic(() => import("@mui/material/Icon"));
const AlertMessage = dynamic(() => import("@/components/alertMessage"));

/**
 * @description this page lets user login using their email
 */
export default function Login() {

    //guard page against unauthenticated users on client side
    useAuth();
    const router = useRouter();

    //login error state
    const [error, setError] = useState("");

    //catching next-auth login error
    useEffect(() => {
        const splitByError = router.asPath.split("error");
        if (splitByError.length > 1) {
            const err = splitByError[-1].substring(1);
            if (err == "OAuthAccountNotLinked") {
                setError(
                    "You already login with a different provider, ex: you previously logged in with Google, but now you are trying to log in with email/discord. Please log in with the same provider you used previously."
                );
            } else {
                setError(
                    "An error has occured when trying to sign you in. Please try again later."
                );
            }
        }
    }, [router]);

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
        try {
            signIn("email", { email });
        } catch {
            setError("Error sending email to your account.");
        }
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | Login</title>
                <meta name="description" content="Login page" />
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.about}>
                        <h2>Are YOU the MVP?</h2>
                        <p>
                            Create your matches <br />
                            Schedule your face-off
                            <br />
                            Put your skills to the test.
                        </p>
                        <h2>Can you be #1?</h2>
                    </div>
                </div>
                <div className="flex flex-col items-center flex-auto">
                    <div className={styles.imgwrapper}>
                        <Image
                            src={"/img/logo.png"}
                            alt="logo"
                            width={263}
                            height={184}
                            priority
                        />
                    </div>
                    <div className={styles.input}>
                        <div className="w-full">
                            <form onSubmit={handleEmailSubmit} className="w-full">
                                {error && <AlertMessage message={error} type="error" />}
                                <Input
                                    type="email"
                                    placeholder="enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                >
                                    <EmailIcon />
                                </Input>
                                <Button type="submit" className={styles.login}>
                                    Log in
                                </Button>
                            </form>
                            <div className="flex w-full items-center gap-2 my-5">
                                <hr className="flex-1" />
                                <p className="flex-none text-white">OR</p>
                                <hr className="flex-1" />
                            </div>
                            <button
                                className={styles.discord}
                                type="button"
                                onClick={() => {
                                    signIn("discord");
                                }}
                            >
                                <IconComponent fontSize="large">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={"/icons/discord.png"}
                                        alt={"icon"}
                                        layout="responsive"
                                    />
                                </IconComponent>
                                <p>Continue with Discord</p>
                            </button>
                            <button
                                className={styles.google}
                                type="button"
                                onClick={() => {
                                    signIn("google");
                                }}
                            >
                                <IconComponent fontSize="large">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={"/icons/google.png"}
                                        alt={"icon"}
                                        layout="responsive"
                                    />
                                </IconComponent>
                                <p>Continue with Google</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

//guards page against unauthenticated users from server side
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (session) {
        if (session.user.isFinishedSignup) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        } else {
            return {
                redirect: {
                    destination: "/register",
                    permanent: false,
                },
            };
        }
    }

    return {
        props: {},
    };
}
