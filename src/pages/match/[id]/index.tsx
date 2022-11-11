//third-party import
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import useSWR from "swr";
import "reactjs-popup/dist/index.css";

//local-import
import styles from "@/styles/MatchView.module.sass";
import { getMatchById, updateMatchFields } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { Location, Pos } from "@/lib/types/General";
import { Match } from "@/lib/types/Match";
import { dateConverter } from "@/lib/helpers/time";
import useAuth from "@/hooks/useAuth";
import useMatchNavigate from "@/hooks/useMatchStatus";
import { getUTCTime } from "@/lib/helpers/time";

// https://www.npmjs.com/package/add-to-calendar-button
// eslint-disable-next-line camelcase
import "add-to-calendar-button/assets/css/atcb.css";
import fetcher from "@/lib/helpers/fetcher";

//dynamic imports
const Snackbar = dynamic(()=> import("@mui/material/Snackbar"), { ssr: false });
const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

// Interface for passed props
interface Props {
  matchData: Match;
}

// Interface for the config used in add to calendar
interface Config {
  name: string;
  startDate?: string;
  endDate?: string;
  options: ["Apple", "Google", "iCal", "Microsoft365", "Outlook.com", "Yahoo"];
  timeZone: string;
  iCalFileName: string;
  description: string;
}

interface Result {
    routes: [
        {
            legs: [
                {steps: Steps[]}
            ],
            duration: number
        }
    ]
}

interface Steps {
    maneuver: {
        instruction: string;
    }
}

// interface Steps

/**
 * @description displays MatchView page
 */
export default function MatchView({ matchData }: Props) {

    // Access session
    const { session } = useAuth();

    //current match state
    const [match, setMatch] = useState<Match>(matchData);

    // Stores and Sets the location
    const [startLocation, setstartLocation] = useState<Location>();

    // Stores and set data from the mapbox
    const [result, setResult] = useState<Result>();

    //error state
    const [errorMessage, setErrorMessage] = useState<string>("");

    //start time
    const [matchStartTime, setMatchStartTime] = useState<string>("loading...");

    //guard page against match already started
    const router = useRouter();

    //refetch match every 1 seconds
    const { data, error } = useSWR<{match: Match}>(`/api/match/${matchData._id}`, fetcher, {
        refreshInterval: 1000,
        fallback: { match }
    });

    //update match with new info
    useEffect(()=> {
        if (data && !error) {
            setMatch(data.match);
            setMatchStartTime(dateConverter(data.match.matchStart!, true));
        } if (error) {
            setErrorMessage("failed to fetch lastest info");
        }
    }, [data, error]);

    //redirect user according to match status and type
    useMatchNavigate(match);

    // useEffect to get user current location then set location to be saved in database
    useEffect(() => {

        // options parameter for currentPosition function
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        // Success parameter for currentPosition function
        const success = (pos: Pos) => {

            // access position coordinates
            const crd = pos.coords;

            setstartLocation({
                lat: crd.latitude,
                lng: crd.longitude,
            });
        };

        // Error parameter for currentPosition function
        function error(err: any) {
            setErrorMessage(`ERROR(${err.code}): ${err.message}. Error getting your location`);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);

    // Configuration to be pass in the atcb_action
    // https://www.npmjs.com/package/add-to-calendar-button
    const config: Config = {
        name: match.sport?? "No Sport",
        startDate: dateConverter(match.matchStart!)?? undefined,
        endDate: match.matchEnd?
            dateConverter(match.matchEnd) : undefined,
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
        description: match.description ?? "",
    };

    // function to add to calendar
    async function addToCal() {
        try {

            //// https://www.npmjs.com/package/add-to-calendar-button
            await (import("add-to-calendar-button")).then((atcb) => {
                atcb.atcb_action(config);
            });

        // Catches Error and displays an alert
        }catch {
            setErrorMessage("Adding to calendar failed, try again later");
        }
    }

    // Function to handle get direction click event
    async function getDirectionsClicked() {

        // fetch mapbox api using directions services
        try {
            const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/
            ${startLocation!.lng},
            ${startLocation!.lat};
            ${match.location.lng},
            ${match.location.lat}
            ?steps=true&geometries=geojson&access_token=
            ${ process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN }`;
            await axios.get(endpoint).then(({ data }) => {
                setResult(data);
            });
        } catch {
            setErrorMessage("Error getting directions, please try again later");
        }
    }

    // Contains steps, maneuver and instruction data
    let steps: Steps[] = [];

    // Stores trip duration for when you get directions
    let duration: number = 0;

    // Guard to check if result from api fetch contains data
    if (result) {
        steps = result.routes[0].legs[0].steps;

        // calculation to get trip duration in minutes
        duration = Math.floor(result.routes[0].duration / 60);
    }

    return (
        <article className={styles.container}>
            {/* Header for Sport */}
            {session?.user.id === match.matchHost &&
            <button
                className={styles.edit}
                onClick={() => router.push(`/match/${match._id}/edit`)}
            >
                Edit
            </button>}
            <h1>{match.sport}</h1>
            <div>
                {/* Sub Header for Match Type */}
                <h3>Match Type</h3>
                {/* Data for match type */}
                <p>{match.matchType}</p>
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
                            {steps.map((step: Steps, index: number) => {
                                return (<li className={styles.list} key={index}>{step.maneuver.instruction}</li>);
                            })}
                        </ol>
                    </div>}
                </Popup>

                {/* Sub Header for Match Type */}
                <h3>Address</h3>
                {/* Data for match type */}
                <p>{match.location.address.fullAddress}</p>
            </div>
            <div>
                {/* https://www.npmjs.com/package/add-to-calendar-button */}
                {/* Add to your local calendar button */}
                <button
                    className={styles.calendar}
                    onClick={() => addToCal()}
                >
                    Add to Calendar
                </button>
                {/* Sub Header for Date and Time */}
                <h3>Date and Time</h3>
                <p>
                    {matchStartTime}
                </p>
            </div>
            <div>
                {/* Sub Header for Description */}
                <h3>Description</h3>
                {/* Data for match type */}
                <p>{match.description}</p>
            </div>
            <div>
                {/* Sub Header for Joined Players */}
                {session?.user.id !== match.matchHost &&
                    <button className={styles.directions}>
                        Join
                    </button>
                }
                <h3>Joined Players</h3>
                <div>
                    {/* Displays all joined players */}
                    {match.teams[0].members.concat(match.teams[1].members)
                        .map((name: string, idx: number) => (
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
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={errorMessage.length > 0}
                autoHideDuration={3000}
                onClose={() => setErrorMessage("")}
            >
                <p className={
                    `w-full bg-red-100 
                    px-5 py-3 
                    drop-shadow-lg z-50 
                    rounded-lg text-center`
                }>
                    <span className="text-red-700">{errorMessage}</span>
                </p>
            </Snackbar>
        </article>
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

        //get required amount of players
        const{ requiredPlayers: maxPlayers } = match.gameMode;

        //get current amount of players
        const totalMembers = (match.teams[0].members.concat(match.teams[1].members)).length;

        //boolean to check if match is full
        const isMembersFull = totalMembers === maxPlayers;

        //if match not found, redirect to 404 page
        if (!match) {
            return {
                notFound: true,
            };
        }

        // Redirect them to index if the match type is not REGULAR
        if (match.matchType === "QUICK") {
            return {
                redirect: {
                    destination: `/match/${id}/scoreboard`,
                    permanent: false,
                },
            };
        }

        //guard against regular match already start,
        //update match status and redirect to scoreboard if start time is passed
        if (
            match.matchType === "REGULAR" &&
            getUTCTime(match.matchStart!) <= getUTCTime(new Date())
        ) {

            //if members is not full, cancel the match
            if (!isMembersFull && match.status !== "CANCELLED") {
                await updateMatchFields(id as string, {
                    status: "CANCELLED",
                    matchEnd: new Date(),
                });
            }

            //if status is still upcoming, update it to in progress
            else if (match.status === "UPCOMING") {
                await updateMatchFields(id as string, {
                    status: "INPROGRESS",
                });
            }

            return {
                redirect: {
                    destination: `/match/${id}/scoreboard`,
                    permanent: false,
                }
            };
        }

        // Returns the data as props
        return {
            props: {
                matchData: JSON.parse(JSON.stringify(match)),
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