// Imports style for the match view
import styles from "@/styles/MatchView.module.sass";

// Created Fake data for testing
const names = ["angelo", "ryan", "emil", "allmight", "deku", "hesus"];

/**
 * @description displays MatchView page
*/
export default function MatchView(){
    return(
        <div className={styles.container}>
            {/* Header for Sport */}
            <h1>Sport</h1>
            <div>
                {/* Sub Header for Match Type */}
                <h3>Match Type</h3>
                {/* Data for match type */}
                <p>game mode</p>
            </div>
            <div>
                <button className={styles.directions}>Get Directions</button>
                {/* Sub Header for Match Type */}
                <h3>Address</h3>
                {/* Data for match type */}
                <p>address info</p>
            </div>
            <div>
                <button className={styles.calendar}>Add to Calendar</button>
                {/* Sub Header for Date and Time */}
                <h3>Date and Time</h3>
                {/* Data for match type */}
                <p>details</p>
            </div>
            <div>
                {/* Sub Header for Description */}
                <h3>Description</h3>
                {/* Data for match type */}
                <p>display discord links or comments here</p>
            </div>
            <div>
                {/* Sub Header for Joined Players */}
                <h3>Joined Players</h3>
                <div>
                    {/* Displays all joined players */}
                    {names.map((name) =>
                        <div className={styles.players} key={name}>
                            {name}
                            <div>
                                {/* Leave the match button */}
                                <button>Leave</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}