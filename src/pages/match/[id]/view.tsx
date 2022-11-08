//third-party import
import { GetServerSidePropsContext } from "next";
import router from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

//https://popupsmart.com/blog/react-popup
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

//local-import
import styles from "@/styles/MatchView.module.sass";
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { Location } from "@/lib/types/General";

// https://www.npmjs.com/package/add-to-calendar-button
// eslint-disable-next-line camelcase
import { atcb_action } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";
import { useSession } from "next-auth/react";

// Interface for passed props
interface Props {
  data: any;
}

// Interface for the config used in add to calendar
interface Config {
  name: string;
  startDate: string;
  endDate: string;
  options: string[];
  timeZone: string;
  iCalFileName: string;
  description: string;
}

/**
 * @description displays MatchView page
 */
export default function MatchView({ data }: Props) {

    // Access session
    const { data: session } = useSession();

    // Stores and Sets the location
    const [startLocation, setstartLocation] = useState<Location>();

    const [result, setResult] = useState<any>();

    // useEffect to get user current location then set location to be saved in database
    useEffect(() => {

        // options parameter for currentPosition function
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        // Success parameter for currentPosition function
        const success = (pos: any) => {

            // access position coordinates
            const crd = pos.coords;

            setstartLocation({
                lat: crd.latitude,
                lng: crd.longitude,
            });
        };

        // Error parameter for currentPosition function
        function error(err: any) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);

    // Combine team1 and team2
    let allTeams: string[] = data.teams[1] ? data.teams[0].members.concat(data.teams[1].members) : data.teams[0].members;

    // Converts the date type(mm/dd/yyyy) to string format ("yyyy-dd-mm")
    const startTime = new Date(data.matchStart)
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
    const endTime = new Date(data.matchEnd)
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");

    // Configuration to be pass in the atcb_action
    // https://www.npmjs.com/package/add-to-calendar-button
    const config: Config = {
        name: data.sport,
        startDate: startTime,
        endDate: endTime ? endTime : startTime,
        options: [
            "Apple",
            "Google",
            "iCal",
            "Microsoft365",
            "Outlook.com",
            "Yahoo",
        ],
        timeZone: "America/Los_Angeles",
        iCalFileName: "Reminder-Event",
        description: data.description,
    };

    // Function to redirect by matchid
    function editClicked(id: string) {
        return router.push(`/match/${id}/edit`);
    }

    // Function to handle get direction click event
    async function getDirectionsClicked() {

        // fetch mapbox api using directions services
        try {
            const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${
        startLocation!.lng
            },${startLocation!.lat};${data.location.lng},${
                data.location.lat
            }?steps=true&geometries=geojson&access_token=${
                process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            }`;

            await axios.get(endpoint).then(({ data }) => {
                setResult(data);
            });
        } catch (error) {
            console.log("Error fetching data, ", error);
        }
    }

    // Contains steps, maneuver and instruction data
    let steps;

    // Stores trip duration for when you get directions
    let duration;

    // Guard to check if result from api fetch contains data
    if (result) {
        steps = result.routes[0].legs[0].steps;

        // calculation to get trip duration in minutes
        duration = Math.floor(result.routes[0].duration / 60);
    }

    return (
        <div className={styles.container}>
            {/* Header for Sport */}
            <button
                className={styles.edit}
                onClick={() => editClicked(data._id as string)}
            >
        Edit
            </button>
            <h1>{data.sport}</h1>
            <div>
                {/* Sub Header for Match Type */}
                <h3>Match Type</h3>
                {/* Data for match type */}
                <p>{data.matchType}</p>
            </div>
            <div>
                {/* Sidebar to get step-by-step instructions */}
                {/* https://popupsmart.com/blog/react-popup */}
                <Popup trigger={<button
                    className={styles.directions}
                >Get Directions</button>} onOpen={(e) => {getDirectionsClicked();}} position="right center">
                    {steps &&
                    <div className={styles.popupContent}>
                        <p>
                            <strong>Trip duration: {duration} min 🚴</strong>
                        </p>
                        <ol>
                            {steps.map((step: any, index: any) => {
                                return (<li className={styles.list} key={index}>{step.maneuver.instruction}</li>);
                            })}
                        </ol>
                    </div>}
                </Popup>

                {/* Sub Header for Match Type */}
                <h3>Address</h3>
                {/* Data for match type */}
                <p>{data.location.address.fullAddress}</p>
            </div>
            <div>
                {/* https://www.npmjs.com/package/add-to-calendar-button */}
                {/* Add to your local calendar button */}
                <button
                    className={styles.calendar}
                    onClick={() => atcb_action(config as Config as any)}
                >
          Add to Calendar
                </button>
                {/* Sub Header for Date and Time */}
                <h3>Date and Time</h3>
                {/* Data for match type */}
                <p>
                    {new Date(data.matchStart!)
                        .toDateString()
                        .concat(
                            " " + new Date(data.matchStart!).toLocaleTimeString("en-US")
                        )}
                </p>
            </div>
            <div>
                {/* Sub Header for Description */}
                <h3>Description</h3>
                {/* Data for match type */}
                <p>{data.description}</p>
            </div>
            <div>
                {/* Sub Header for Joined Players */}
                {session?.user.id !== data.matchHost && <button className={styles.directions}>Join</button>}
                <h3>Joined Players</h3>
                <div>
                    {/* Displays all joined players */}
                    {allTeams.map((name: any, idx: number) => (
                        <div className={styles.players} key={idx}>
                            {name}
                            <div>
                                {/* Leave the match button */}
                                <button>Leave</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {

        // Gets the id parameter in the dynamic url
        const { id } = context.params!;

        // Database connection
        await Database.setup();

        // Get the specific match that you want to view
        const match = await getMatchById(id as string);

        // Redirect them to index if the match type is not REGULAR
        if (match.matchType === "QUICK" || !match) {
            return {
                redirect: {
                    destination: "/",
                },
            };
        }

        // Returns the data as props
        return {
            props: {
                data: JSON.parse(JSON.stringify(match)),
            },
        };
    } catch (error: any) {

        // When there is an error you will be redirected to the index
        return {
            redirect: {
                destination: "/",
            },
        };
    }
}