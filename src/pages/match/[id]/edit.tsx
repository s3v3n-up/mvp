// local import
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { FullLocation } from "@/lib/types/General";
import { Match } from "@/lib/types/Match";
import styles from "@/styles/MatchEdit.module.sass";

//Third party imports
import { AccessTime, AddLocationAlt } from "@mui/icons-material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import router from "next/router";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const AlertMessage = dynamic(() => import("@/components/alertMessage"));

// interface for props
interface Props {
  data: Match;
}

/**
 * @description displays Match Edit page
 */
export default function MatchEdit({ data }: Props) {

    //location useState
    const [location, setLocation] = useState<FullLocation>();

    // Address useState
    const [address, setAddress] = useState("");

    // Address suggestions useState - this is for the autofill
    const [suggestions, setSuggestions] = useState([]);

    // Date useState
    const [date, setDate] = useState("");

    // Description useState
    const [description, setDescription] = useState("");

    //Form submission state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    //axios to get the userdata and stats from api
    useEffect(() => {
        const offSetDateTime = new Date(data.matchStart!).getTime() - 28800000;
        setDate(new Date(offSetDateTime!).toISOString().slice(0, 16));
        setDescription(data.description);
        setIsDataLoaded(true);
    }, [data.matchStart, data.description]);

    // Function to handle location change event
    async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;

        // handle change of address value in front end
        setAddress(val);

        // Code to set location to be saved on database and set suggestions for autofill
        try {
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/
                ${val}.json?&limit=3&access_token=${process.env
                .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}`;
            const res = await axios.get(endpoint);

            if (res.status === 200) {
                const data = res.data;
                setLocation(data);
                setSuggestions(data?.features);
            }
        } catch (error: any) {
            throw new Error("Error fetching data, ", error);
        }
    }

    // Function to handle date change event
    function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setDate(val);
    }

    // Function to handle description change event
    function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const val = e.target.value;
        setDescription(val);
    }

    //function that handles delete
    async function handleDelete(id: string) {
        setLoading(true);
        try {

            //axios fetch post to delete a match
            const res = await axios.delete(`/api/match/${id}`);
            if (res.status === 200) {
                router.push("/");
            }
        } catch (error: any) {
            const { message } = error as Error;
            setError(message);
        }
    }

    // Function to handle submission of form event
    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);
            if (!address) {
                throw new Error("needed input for location");
            }

            if (!description) {
                throw new Error("needed input for description");
            }

            // Axios fetch post to access create match api
            const res = await axios.put(`/api/match/${data._id}`, {
                teams: data.teams,
                matchHost: data.matchHost,
                sport: data.sport,
                location: {
                    lng: location?.features[0].geometry.coordinates[0],
                    lat: location?.features[0].geometry.coordinates[1],
                    address: {
                        fullAddress: location?.features[0].place_name,
                        pointOfInterest: location?.features[0].context[0].text,
                        city: location?.features[0].context[2].text,
                        country: location?.features[0].context[5].text,
                    },
                },
                matchStart: date,
                description: description,
            });

            // Checks if no successful post response
            if (!res) {
                throw new Error("No Response");
            }

            // Redirect to index page
            router.push(`/match/${data._id}`);

            // Catches and throws the error
        } catch (err: any) {

            // If  there is a error in the response display it using setError
            if (err!.response) {
                setError(err.response.data.message);

                // Else show the error
            } else {
                setError(err.message);
            }

            // Lastly remove the loading
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleFormSubmit}>
                {error && <AlertMessage message={error} type="error" />}
                {loading && <AlertMessage message="Loading..." type="loading" />}
                {/* Header for Sport */}
                <h1>{data.sport}</h1>
                <div>
                    {/* Sub Header for Match Type */}
                    <h3>Address</h3>
                    <div className={styles.location}>
                        <div className={styles.address}>
                            <div>
                                <AddLocationAlt />
                                <input
                                    className={styles.inputaddress}
                                    value={address}
                                    name="location"
                                    onChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        {/* Autofill for address */}
                        {suggestions?.length > 0 && (
                            <div className={styles.suggest}>
                                {suggestions.map((suggestion: {place_name:string}, index: number) => {
                                    return (
                                        <p
                                            key={index}
                                            onClick={() => {
                                                setAddress(suggestion.place_name);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {suggestion.place_name}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    {/* Sub Header for Date and Time */}
                    <h3>Date and Time</h3>
                    <div className={styles.date}>
                        <AccessTime />
                        <input
                            value={date}
                            name="date"
                            type="datetime-local"
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
                <div>
                    {/* Sub Header for Description */}
                    <h3>Description</h3>
                    {/* container for text area */}
                    <div>
                        <textarea
                            className={styles.description}
                            required
                            rows={3}
                            value={description}
                            name="description"
                            onChange={handleDescriptionChange}
                        ></textarea>
                    </div>
                </div>
                <div className={styles.buttoncontainer}>
                    {/* button for save */}
                    <button type="submit" className={styles.save}>
                        Save
                    </button>

                    <button
                        className={styles.delete}
                        onClick={() => handleDelete(data._id as string)}
                    >
                        Delete
                    </button>
                </div>
            </form>


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
        return {
            redirect: {
                destination: "/",
            },
        };
    }
}