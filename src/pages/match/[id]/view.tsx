//third-party import
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { Match } from "@/lib/types/Match";
import { GetServerSidePropsContext } from "next";
import router from "next/router";

//local-import
import styles from "@/styles/MatchView.module.sass";

// interface for props
interface Props {
    data: Match
}

/**
 * @description displays MatchView page
*/
export default function MatchView({ data } : Props){

    // Combine team1 and team2
    let allTeams: string[] = data.teams[0].members.concat(data.teams[1].members);

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
                <button className={styles.calendar}>Add to Calendar</button>
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
    catch(error: any){
        return{
            redirect: {
                destination: "/"
            }
        };
    }
}