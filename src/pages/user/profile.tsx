import UserProfile from "@/components/user/UserProfile";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { getUserByUserName, calculateStats } from "@/lib/actions/user";
import Database from "@/lib/resources/database";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { UserProfile as Profile } from "@/lib/types/User";
import useAuth from "@/hooks/useAuth";

interface Props {
    profile: Profile;
    userStats: {
        win: number;
        lose: number;
        draw: number;
    };
}

/*
*this is user profile page
*/
export default function Profile({ profile, userStats }: Props) {

    //guard page from unauthenticated user from client side
    useAuth();

    return(
        <section>
            <UserProfile profile={profile} userStats={userStats}/>
        </section>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    //get request and response from context
    const { req, res } = context;

    //guard against unauthenticated user
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    //get user data from database
    await Database.setup();
    const userData = await getUserByUserName(session.user.userName);
    const stats = await calculateStats(userData.userName);

    return {
        props: {
            profile: JSON.parse(JSON.stringify(userData)),
            userStats: JSON.parse(JSON.stringify(stats)),
        }
    };
}
