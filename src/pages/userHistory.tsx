// Import the style module for the userHistory page
import styles from "@/styles/History.module.sass";

// Import useState and getMatches function
import { useState } from "react";
import { getMatches } from "@/lib/actions/match";
import { useSession } from "next-auth/react";
import router from "next/router";
import axios from "axios";
import Head from "next/head";

// History function for page
export default function History({ pastMatches, activeMatches }: any) {

    const { data:session } = useSession();

    const joinActive = activeMatches.filter((match:any) => match.teams[0].members.includes(session?.user.userName) || (match.teams[1] && match.teams[1].members.includes(session?.user.userName)));
    const pasts = pastMatches.filter((match:any) => match.teams[0].members.includes(session?.user.userName) || (match.teams[1] && match.teams[1].members.includes(session?.user.userName)));

    // Constants to indicate whether tab is active or not
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Function to delete match and refresh page
    function deleteButton(id: string) {
        axios.delete(`/api/match/${id}`);

        return router.push("/userHistory").then(() => router.reload());
    }

    // Labels and content to populate the selected tab
    const tabsData = [
        {

            // The title or label of our tab
            label: "Created Matches",
            content: (
                <>
                    {/* Created match cards to hold match information*/}
                    {joinActive.map((created: {matchStart: string, sport: string, location: { address: { fullAddress: string }}, status: string, _id: string }, idx: number) => (
                        <div className={styles.cardContainer} key={idx}>
                            <div className={styles.cardInfo}>
                                {/* The starting time of the match*/}
                                <div className={styles.time}>
                                    <p>{new Date(created.matchStart)
                                        .toDateString()
                                        .concat(
                                            " " +
                              new Date(created.matchStart).toLocaleTimeString(
                                  "en-US"
                              )
                                        )}</p>
                                </div>
                                {/* The type of sport of the match*/}
                                <div className={styles.sportType}>
                                    <p>{created.sport}</p>
                                </div>
                                <div className={styles.miniContainer}>
                                    {/* The type of sport of the match*/}
                                    <div className={styles.location}>
                                        <p>{created.location.address.fullAddress}</p>
                                    </div>
                                    {/* The delete or leave button corresponding to whether the match was created or joined*/}
                                    {}
                                    <button className={styles.cancelButton}>Leave</button>
                                    {created.status === "UPCOMING" && <button className={styles.cancelButton} onClick={(e) => deleteButton(created._id)}>Delete</button>}

                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ),
        },

        // Tab for user's past matches
        {
            label: "History",
            content: (
                <>
                    {/* Past match cards to hold match information*/}
                    {pasts.map((past: any, idx: any) => (
                        <div className={styles.cardContainer} key={idx}>
                            <div className={styles.cardInfo}>
                                {/* The starting time of the match*/}
                                <div className={styles.time}>
                                    <p>{new Date(past.matchStart)
                                        .toDateString()
                                        .concat(
                                            " " +
                              new Date(past.matchStart).toLocaleTimeString(
                                  "en-US"
                              )
                                        )}</p>
                                </div>
                                {/* The type of sport of the match*/}
                                <div className={styles.sportType}>
                                    <p>{past.sport}</p>
                                </div>
                                {/* The match's location*/}
                                <div className={styles.miniContainer}>
                                    <div className={styles.location}>
                                        <p>{past.location.address.fullAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
    ];

    // The rendered content of the page
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | History</title>
                <meta name="description" content="Shows recently created and past matches" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon.ico"/>
            </Head>
            <div className={styles.baseContainer}>
                <div className={styles.historyContainer}>
                    <div className={styles.background}>
                        <div className={styles.titleContainer}>
                            {/*Each tab has a key, either 1 or 0, depending on the key, the tab is active or not*/}
                            {/*Tabs styling changes depending on it being selected or clicked*/}
                            {tabsData.map((tab, idx) => {
                                return (
                                    <button
                                        key={idx}
                                        className={` ${
                                            idx === activeTabIndex
                                                ? styles.selectedTab
                                                : styles.unselectedTab
                                        }`}
                                        onClick={() => setActiveTabIndex(idx)}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        {/*Here we display the appropriate tab content (or matches) that correspond to the active tab */}
                        <div className={styles.tabContent}>
                            <div>{tabsData[activeTabIndex].content}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Access the match's details and pass as props
export async function getServerSideProps() {

    // We call the getMatches function
    const data = await getMatches();

    // This converts our data into an object.
    const matches = JSON.parse(JSON.stringify(data));

    // Filter all active matches
    const activeMatches = matches.filter((match: any) => match.status === "UPCOMING" || match.status === "INPROGRESS");

    // Filter all cancelled or finished matches
    const pastMatches = matches.filter((match: any) => match.status === "CANCELLED" || match.status === "FINISHED");

    // Returns as props
    return {
        props: {
            pastMatches,
            activeMatches
        },
    };
}

