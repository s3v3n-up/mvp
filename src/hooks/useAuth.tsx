import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/**
 * a custom hook that checks if user is authenticated
 */
export default function useAuth() {

    //get user session
    const { data: session, status } = useSession();
    const router = useRouter();

    //start checking if user is authenticated
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {

            //if user hasn't finished setting up profile, redirect to register page
            if (!session.user.isFinishedSignup && router.pathname !== "/register") {
                router.push("/register");
            }
        }
    }
    , [session, status, router]);

    return { session, status };
}