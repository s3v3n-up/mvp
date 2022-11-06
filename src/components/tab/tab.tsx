//Import the style module
import styles from "@/styles/Components.module.sass";
import { useState } from "react";

//Import the card component
import Card from "@/components/card/card";

//create fake data for card components
const names = ["whale", "squid", "turtle", "coral", "starfish", "star"];

//create fake data for card components
const hylians = ["link", "impa", "zelda"];

//Tab function to render tabs and the container
export default function Tab() {

    //constants to indicate whether tab is active or not
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    //Labels and content to populate the selected tab
    const tabsData = [
        {
            label: "Created Matches",
            content: (
                <>
                    {names.map((name) => (
                        <Card startTime={""} sport={""} location={""} key={name} />
                    ))}
                </>
            ),
        },
        {
            label: "History",
            content: (
                <>
                    {hylians.map((hylian) => (
                        <Card startTime={""} sport={""} location={""} key={hylian} />
                    ))}
                </>
            ),
        },
    ];

    //The rendered content
    return (
        <div className={styles.background}>
            <div className={styles.titleContainer}>
                {tabsData.map((tab, idx) => {
                    return (

                    //Tabs styling changes depending on it being clicked
                        <button
                            key={idx}
                            className={` ${
                                idx === activeTabIndex
                                    ? styles.selectedTab
                                    : styles.unselectedTab
                            }`}

                            //Change the active tab on click.
                            onClick={() => setActiveTabIndex(idx)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            <div className={styles.tabContent}>
                <p>{tabsData[activeTabIndex].content}</p>
            </div>
        </div>
    );
}
