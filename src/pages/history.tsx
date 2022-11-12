// Import useState and getMatches function
import useAuth from "@/hooks/useAuth";
import { getMatches } from "@/lib/actions/match";
import { useState } from "react";
import Head from "next/head";
import HistoryLayout from "@/components/layout/history";
import Card from "@/components/history/card";
import type { Match } from "@/lib/types/Match";
import { checkIfUserInMatch } from "@/lib/helpers/match";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

interface Props {
    pastMatches: Match[];
    activeMatches: Match[];
}

// History function for page
export default function History({ pastMatches, activeMatches }: Props) {

    //guard against unauthorized access
    useAuth();

    // Constants to indicate whether tab is active or not
    const [activeTab, setActiveTab] = useState<"present"|"past">("present");

    // Labels and content to populate the selected tab
    const tabsData = {
        present: {

            // The title or label of our tab
            label: "Created Matches",
            content: (
                <section role="list" className="w-full mt-5">
                    {/* Created match cards to hold match information*/}
                    {activeMatches.map((created: Match, idx: number) => (
                        <Card key={idx} {...created} />
                    ))}
                </section>
            ),
        },

        // Tab for user's past matches
        past: {
            label: "History",
            content: (
                <section role="list" className="w-full mt-5">
                    {/* Past match cards to hold match information*/}
                    {pastMatches.map((past: Match, idx: number) => (
                        <Card key={idx} {...past} />
                    ))}
                </section>
            ),
        },
    };

    // The rendered content of the page
    return (
        <HistoryLayout currTab={activeTab} setTab={setActiveTab}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | History</title>
                <meta name="description" content="History page" />
            </Head>
            {/*Here we display the appropriate tab content (or matches) that correspond to the active tab */}
            {tabsData[activeTab].content}
        </HistoryLayout>
    );
}

// Access the match's details and pass as props
export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {

    // Get the session
    const session = await unstable_getServerSession(req , res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // We call the getMatches function
    const data: Match[] = await getMatches();

    // Filter all active matches
    const activeMatches = data.filter((match: Match) => {

        // Check if match is still active
        const isActive = match.status === "UPCOMING" ||
                         match.status === "INPROGRESS" ||
                         match.status === "PAUSED";

        // Check if user is in the match
        const isUserInMatch = checkIfUserInMatch(match, session.user.userName);
        if (isActive && isUserInMatch) {
            return true;
        }
    });

    // Filter all cancelled or finished matches
    const pastMatches = data.filter((match: Match) => {

        // Check if match is cancelled or finished
        const isEnded = match.status === "CANCELLED" || match.status === "FINISHED";

        // Check if user is in match
        const isUserInMatch = checkIfUserInMatch(match, session.user.userName);
        if (isEnded && isUserInMatch) {
            return true;
        }
    });

    // Returns as props
    return {
        props: {
            activeMatches: JSON.parse(JSON.stringify(activeMatches)),
            pastMatches: JSON.parse(JSON.stringify(pastMatches)),
        },
    };
}

