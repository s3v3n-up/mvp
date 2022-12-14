import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

/**
 * a custom hook that checks if user is authenticated
 */
export default function useAuth() {

    //get user session
    const { data: session, status } = useSession();
    const router = useRouter();

    //start checking if user is authenticated
    useEffect(() => {
        (async()=>{
            await getSession();
        })();
        if (status === "loading") return;
        if (status === "unauthenticated" && router.pathname !== "/login") {
            router.push("/login");
        }
    }
    , [session, status, router]);

    return { session, status };
}