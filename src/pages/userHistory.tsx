// Import our style modules
import styles from "@/styles/History.module.sass";
//import styles from "@/styles/Components.module.sass";

// Import useState and getMatches function
import { useState } from "react";
import { getMatches } from "@/lib/actions/match";

// History function for page
export default function History({ createdMatches, pastMatches }: any) {
  //constants to indicate whether tab is active or not
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Labels and content to populate the selected tab
  const tabsData = [
    {
      label: "Created Matches",
      content: (
        <>
          {createdMatches.map((created: any, idx: any) => (
            // Cards to hold match information
            <div className={styles.cardContainer} key={idx}>
              <div className={styles.cardInfo}>
                <div className={styles.time}>
                  <p>{created.startTime}</p>
                </div>
                <div className={styles.sportType}>
                  <p>{created.sport}</p>
                </div>
                <div className={styles.miniContainer}>
                  <div className={styles.location}>
                    <p>{created.location}</p>
                  </div>
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
          {pastMatches.map((past: any, idx: any) => (
            <div className={styles.cardContainer} key={idx}>
              <div className={styles.cardInfo}>
                <div className={styles.time}>
                  <p>{past.startTime}</p>
                </div>
                <div className={styles.sportType}>
                  <p>{past.sport}</p>
                </div>
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

  //The rendered content of the page
  return (
    <div className={styles.baseContainer}>
      <div className={styles.historyContainer}>
        <div className={styles.background}>
          <div className={styles.titleContainer}>
            {tabsData.map((tab, idx) => {
              return (
                //Tabs styling changes depending on it being selected
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
      </div>
    </div>
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

  //checks if the match has passed already
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
