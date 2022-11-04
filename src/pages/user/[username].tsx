import ViewUserProfile from "@/components/ViewUserProfile";
import { getUsers, calculateStats } from "@/lib/actions/user";
import { getUserByUserName } from "@/lib/actions/user";
import { GetStaticPropsContext } from "next";
import type { UserProfile } from "@/lib/types/User";

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
 * incrementally static generate page every 5 minutes
 */
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
            revalidate: 300
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




