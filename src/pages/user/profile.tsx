import UserProfile from "@/components/user/UserProfile";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/*
*this is user profile page
*/
export default function Profile(){

    //guard page from unauthenticated user from client side
    const { status } = useSession();
    const router = useRouter();
    useEffect(()=>{
        if(status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
    },[status, router]);

    return(
        <div>
            <UserProfile/>
        </div>
    );
}