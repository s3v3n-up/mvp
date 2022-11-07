//third-party import
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { Match } from "@/lib/types/Match";
import { GetServerSidePropsContext } from "next";
import router from "next/router";

//local-import
import styles from "@/styles/MatchView.module.sass";

// https://www.npmjs.com/package/add-to-calendar-button
// eslint-disable-next-line camelcase
import { atcb_action } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";

// interface for props
interface Props {
    data: Match
}

// Interface for the config used in add to calendar
interface Config {
    name: string,
    startDate: string,
    endDate: string,
    options: string[],
    timeZone: string,
    iCalFileName: string,
    description: string
}

/**
 * @description displays MatchView page
*/
export default function MatchView({ data } : Props){

    // Combine team1 and team2
    let allTeams: string[] = data.teams[0].members.concat(data.teams[1].members);

    // Converts the date type(mm/dd/yyyy) to string format ("yyyy-dd-mm")
    const startTime = new Date(data.matchStart).toLocaleDateString("en-GB").split("/").reverse().join("-");
    const endTime = new Date(data.matchStart).toLocaleDateString("en-GB").split("/").reverse().join("-");

    // Configuration to be pass in the atcb_action
    // https://www.npmjs.com/package/add-to-calendar-button
    const config: Config = {
        name: data.sport,
        startDate: startTime,
        endDate: endTime ? endTime : startTime,
        options: ["Apple", "Google", "iCal", "Microsoft365", "Outlook.com", "Yahoo"],
        timeZone: "America/Los_Angeles",
        iCalFileName: "Reminder-Event",
        description: data.description
    };

    // Function to redirect by matchid
    function editClicked(id: string ){

        return router.push(`/match/${id}/edit`);
    }

    return(
        <div className={styles.container}>
            {/* Header for Sport */}
            <button className={styles.edit} onClick={() => editClicked(data._id as string)} >Edit</button>
            <h1>{data.sport}</h1>
            <div>
                {/* Sub Header for Match Type */}
                <h3>Match Type</h3>
                {/* Data for match type */}
                <p>{data.matchType}</p>
            </div>
            <div>
                <button className={styles.directions}>Get Directions</button>
                {/* Sub Header for Match Type */}
                <h3>Address</h3>
                {/* Data for match type */}
                <p>Location</p>
            </div>
            <div>
                {/* https://www.npmjs.com/package/add-to-calendar-button */}
                {/* Add to your local calendar button */}
                <button className={styles.calendar } onClick={() => atcb_action(config as Config as any)}>Add to Calendar</button>
                {/* Sub Header for Date and Time */}
                <h3>Date and Time</h3>
                {/* Data for match type */}
                <p>{new Date(data.matchStart).toDateString().concat(" " + new Date(data.matchStart).toLocaleTimeString("en-US"))}</p>
            </div>
            <div>
                {/* Sub Header for Description */}
                <h3>Description</h3>
                {/* Data for match type */}
                <p>{data.description}</p>
            </div>
            <div>
                {/* Sub Header for Joined Players */}
                <button className={styles.directions}>Join</button>
                <h3>Joined Players</h3>
                <div>
                    {/* Displays all joined players */}
                    {allTeams.map((name: any, idx: number) =>
                        <div className={styles.players} key={idx}>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try{

        // Gets the id parameter in the dynamic url
        const { id } = context.params!;

        // Database connection
        await Database.setup();

        // Get the specific match that you want to view
        const match = await getMatchById(id as string);

        // Redirect them to index if the match type is not REGULAR
        if(match.matchType === "QUICK" || !match) {
            return {
                redirect: {
                    destination: "/"
                }
            };
        }

        // Returns the data as props
        return {
            props: {
                data: JSON.parse(JSON.stringify(match))
            }
        };
    }

    // When there is an error you will be redirected to the index
    catch(error: any){
        return{
            redirect: {
                destination: "/"
            }
        };
    }
}