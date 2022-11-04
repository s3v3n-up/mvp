import styles from "@/styles/MatchView.module.sass";

const names = ["angelo", "ryan", "emil", "allmight", "deku", "hesus"];

export default function MatchView(){
    return(
        <div className={styles.box}>
            <h1>Sport</h1>
            <div>
                <h3>Match Type</h3>
                <p>game mode</p>
            </div>
            <div>
                <button className={styles.getDirect}>Get Directions</button>
                <h3>Address</h3>
                <p>address info</p>
            </div>
            <div>
                <button className={styles.addCalendar}>Add to Calendar</button>
                <h3>Date and Time</h3>
                <p>details</p>
            </div>
            <div>
                <h3>Description</h3>
                <p>display discord links or comments here</p>
            </div>
            <div>
                <h3>Joined Players</h3>
                <div>
                    {names.map((name) =>
                        <div className={styles.players} key={name}>
                            {name}
                            <div>
                                <button>Leave</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}