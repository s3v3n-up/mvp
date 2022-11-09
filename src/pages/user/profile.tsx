import UserProfile from "@/components/user/UserProfile";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Head from "next/head";

/*
 *this is user profile page
 */
export default function Profile() {

    //guard page from unauthenticated user from client side
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | Profile</title>
                <meta name="description" content="User profile page" />
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <div>
                <UserProfile />
            </div>
        </>
    );
}
