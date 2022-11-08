import ViewUserProfile from "@/components/user/ViewUserProfile";
import { getUsers, calculateStats } from "@/lib/actions/user";
import { getUserByUserName } from "@/lib/actions/user";
import { GetStaticPropsContext } from "next";
import type { UserProfile } from "@/lib/types/User";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/**
 * view user profile page props type
 */
interface Props {
    user: UserProfile;
    stats: {
        win: number;
        lose: number;
        draw: number;
    };
}

/**
 * view other user profile page
 * @param props - user profile data
 * @returns {JSX.Element} view user profile page element
 */
export default function ViewProfile({ user, stats }: Props) {

    //guard page from unauthenticated user from client side
    const { status } = useSession();
    const router = useRouter();
    useEffect(()=>{
        if(status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
    },[status, router]);

    //user data states
    const { firstName, lastName, userName, image, phoneNumber } = user;

    return (
        <div>
            <ViewUserProfile data={
                {
                    fullName: `${firstName} ${lastName}`,
                    userName,
                    phone: phoneNumber,
                    image,
                    stats
                }
            } />
        </div>
    );
}

/**
 * get all static paths for dynamic page static generation
 */
export async function getStaticPaths() {
    const users = await getUsers();
    const paths = users.map((user) => ({
        params: { username: user.userName },
    }));

    return {
        paths,
        fallback: "blocking"
    };
}

/**
 * incrementally static generate page every 10 seconds
 */
export async function getStaticProps(context: GetStaticPropsContext ) {
    const { username } = context.params as { username: string };
    try {

        //get user data and stats
        const user = await getUserByUserName(username as string);
        const stats = await calculateStats(user.userName);

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                stats: JSON.parse(JSON.stringify(stats))
            },
            revalidate: 10
        };
    } catch (error: any) {
        if (error.message="user not found") {
            return {
                notFound: true
            };
        }
        throw error;
    }
}




