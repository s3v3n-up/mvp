import ViewUserProfile from "@/components/ViewUserProfile";
import { getUsers, calculateStats } from "@/lib/actions/user";
import { getUserByUserName } from "@/lib/actions/user";
import { GetStaticPropsContext } from "next";
import type { UserProfile } from "@/lib/types/User";

interface Props {
    user: UserProfile;
    stats: {
        win: number;
        lose: number;
        draw: number;
    };
}

/*
*this is view other user's profile page
*/
export default function ViewProfile({ user, stats }: Props) {
    const { firstName, lastName, userName, image, phoneNumber } = user;
    const fullName = `${firstName} ${lastName}`;
    const phone = phoneNumber;

    return (
        <div>
            <ViewUserProfile data={
                {
                    fullName,
                    userName,
                    phone,
                    image,
                    stats
                }
            } />
        </div>
    );
}

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

export async function getStaticProps(context: GetStaticPropsContext ) {
    const { username } = context.params as { username: string };
    try {
        const user = await getUserByUserName(username as string);
        const stats = await calculateStats(username);

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                stats: JSON.parse(JSON.stringify(stats))
            },
            revalidate: 5
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




