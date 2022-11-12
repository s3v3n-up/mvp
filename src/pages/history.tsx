// Import the style module for the userHistory page
import styles from "@/styles/History.module.sass";

// Import useState and getMatches function
import useAuth from "@/hooks/useAuth";
import { getMatches } from "@/lib/actions/match";
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import HistoryLayout from "@/components/layout/history";
import Card from "@/components/history/card";
import type { Match } from "@/lib/types/Match";

// History function for page
export default function History({ pastMatches, activeMatches }: any) {

    const { session } = useAuth();

    const joinActive: Match[] = activeMatches.filter((match:any) => match.teams[0].members.includes(session?.user.userName)
                        || (match.teams[1] && match.teams[1].members.includes(session?.user.userName)));
    const pasts: Match[] = pastMatches.filter((match:any) => match.teams[0].members.includes(session?.user.userName)
                        || (match.teams[1] && match.teams[1].members.includes(session?.user.userName)));

    // Constants to indicate whether tab is active or not
    const [activeTab, setActiveTab] = useState<"present"|"past">("present");

    // Labels and content to populate the selected tab
    const tabsData = {
        present: {

            // The title or label of our tab
            label: "Created Matches",
            content: (
                <section role="list">
                    {/* Created match cards to hold match information*/}
                    {joinActive.map((created: any, idx: any) => (
                        <Card key={idx} {...created} />
                    ))}
                </section>
            ),
        },

        // Tab for user's past matches
        past: {
            label: "History",
            content: (
                <section role="list" className="mt-5">
                    {/* Past match cards to hold match information*/}
                    {pasts.map((past: any, idx: any) => (
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
            <div>{tabsData[activeTab].content}</div>
        </HistoryLayout>
    );
}

// Access the match's details and pass as props
export async function getServerSideProps() {

    // We call the getMatches function
    const data: Match[] = await getMatches();

    // Filter all active matches
    const activeMatches = data.filter((match: any) => match.status === "UPCOMING" || match.status === "INPROGRESS");

    // Filter all cancelled or finished matches
    const pastMatches = data.filter((match: any) => match.status === "CANCELLED" || match.status === "FINISHED");

    // Returns as props
    return {
        props: {
            activeMatches: JSON.parse(JSON.stringify(activeMatches)),
            pastMatches: JSON.parse(JSON.stringify(pastMatches)),
        },
    };
}

