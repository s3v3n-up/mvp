// Import our style modules
import styles from "@/styles/History.module.sass";
import Compstyles from "@/styles/Components.module.sass";

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
            <div className={Compstyles.cardContainer} key={idx}>
              <div className={Compstyles.cardInfo}>
                <div className={Compstyles.time}>
                  <p>{created.startTime}</p>
                </div>
                <div className={Compstyles.sportType}>
                  <p>{created.sport}</p>
                </div>
                <div className={Compstyles.miniContainer}>
                  <div className={Compstyles.location}>
                    <p>{created.location}</p>
                  </div>
                  <button className={Compstyles.cancelButton}>Leave</button>
                  <button className={Compstyles.cancelButton}>Delete</button>
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
            <div className={Compstyles.cardContainer} key={idx}>
              <div className={Compstyles.cardInfo}>
                <div className={Compstyles.time}>
                  <p>{past.startTime}</p>
                </div>
                <div className={Compstyles.sportType}>
                  <p>{past.sport}</p>
                </div>
                <div className={Compstyles.miniContainer}>
                  <div className={Compstyles.location}>
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
        <div className={Compstyles.background}>
          <div className={Compstyles.titleContainer}>
            {tabsData.map((tab, idx) => {
              return (
                //Tabs styling changes depending on it being selected
                <button
                  key={idx}
                  className={` ${
                    idx === activeTabIndex
                      ? Compstyles.selectedTab
                      : Compstyles.unselectedTab
                  }`}
                  //Change the active tab on click.
                  onClick={() => setActiveTabIndex(idx)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className={Compstyles.tabContent}>
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
