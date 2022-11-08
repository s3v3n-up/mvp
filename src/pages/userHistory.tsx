// Import the style module for the userHistory page
import styles from "@/styles/History.module.sass";
import Head from "next/head";

// Import useState and getMatches function
import { useState } from "react";
import { getMatches } from "@/lib/actions/match";

// History function for page
export default function History({ createdMatches, pastMatches }: any) {

    // Constants to indicate whether tab is active or not
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Labels and content to populate the selected tab
    const tabsData = [
        {

            // The title or label of our tab
            label: "Created Matches",
            content: (
                <>
                    {/* Created match cards to hold match information*/}
                    {createdMatches.map((created: any, idx: any) => (
                        <div className={styles.cardContainer} key={idx}>
                            <div className={styles.cardInfo}>
                                {/* The starting time of the match*/}
                                <div className={styles.time}>
                                    <p>{created.startTime}</p>
                                </div>
                                {/* The type of sport of the match*/}
                                <div className={styles.sportType}>
                                    <p>{created.sport}</p>
                                </div>
                                <div className={styles.miniContainer}>
                                    {/* The type of sport of the match*/}
                                    <div className={styles.location}>
                                        <p>{created.location}</p>
                                    </div>
                                    {/* The delete or leave button corresponding to whether the match was created or joined*/}
                                    <button className={styles.cancelButton}>Leave</button>
                                    <button className={styles.cancelButton}>Delete</button>
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
                    {pastMatches.map((past: any, idx: any) => (
                        <div className={styles.cardContainer} key={idx}>
                            <div className={styles.cardInfo}>
                                {/* The starting time of the match*/}
                                <div className={styles.time}>
                                    <p>{past.startTime}</p>
                                </div>
                                {/* The type of sport of the match*/}
                                <div className={styles.sportType}>
                                    <p>{past.sport}</p>
                                </div>
                                {/* The match's location*/}
                                <div className={styles.miniContainer}>
                                    <div className={styles.location}>
                                        <p>{past.location}</p>
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
                <meta name="description" content="History page" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon.ico"
                ></link>
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
                            <p>{tabsData[activeTabIndex].content}</p>
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

    // We check if the match has yet to transpire
    const createdMatches = matches.filter(
        (match: any) => match.matchType === "UPCOMING"
    );

    // Checks if the match has passed already
    const pastMatches = matches.filter(
        (match: any) => match.matchType === "FINISHED"
    );

    // Returns as props
    return {
        props: {
            createdMatches,
            pastMatches,
        },
    };
}
