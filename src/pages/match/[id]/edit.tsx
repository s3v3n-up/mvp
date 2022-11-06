// local import
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { Match } from "@/lib/types/Match";
import styles from "@/styles/MatchEdit.module.sass";
import { AccessTime,AddLocationAlt } from "@mui/icons-material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import router from "next/router";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// interface for props
interface Props {
    data: Match
}

/**
 * @description displays Match Edit page
*/
export default function MatchEdit({ data } : Props){

    //location useState
    const [location, setLocation] = useState<Location>();

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
        setDate(new Date(data.matchStart).toISOString().slice(0,16));
        setDescription(data.description);
        setIsDataLoaded(true);
    }, [data.matchStart, data.description]
    );

    // Function to handle location change event
    function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;

        setLocation({
            lat: 0,
            lng: 0,
        });
    }

    // Function to handle date change event
    function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        console.log(typeof val);
        setDate(val);
    }

    // Function to handle description change event
    function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const val = e.target.value;
        setDescription(val);
    }

    // Function to handle submission of form event
    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);

            // Axios fetch post to access create match api
            const res = await axios.put(`/api/match/${data._id}`, {
                location: { lat: 22, lng: -122 },
                matchStart: date,
                description: description
            });

            // Checks if no successful post response
            if (!res) {
                throw new Error("No Response");
            }

            // Redirect to index page
            router.push(`/match/${data._id}/view`);

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

    return(
        <div className={styles.container}>
            <form onSubmit={handleFormSubmit}>
                {/* Header for Sport */}
                <h1>{data.sport}</h1>
                <div>
                    {/* Sub Header for Match Type */}
                    <h3>Address</h3>
                    <div className={styles.address}>
                        <AddLocationAlt />
                        <input value={"0"} name="location" placeholder="Address" onChange={handleLocationChange}/>
                    </div>
                </div>
                <div>
                    {/* Sub Header for Date and Time */}
                    <h3>Date and Time</h3>
                    <div className={styles.date}>
                        <AccessTime/>
                        <input value={date} name="date" type="datetime-local" onChange={handleDateChange}/>
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
                <div>
                    {/* button for delete */}
                    <button type="button" className={styles.delete}>Delete</button>
                    {/* button for save */}
                    <button type="submit" className={styles.save} >Save</button>
                </div>
            </form>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try{

        // Gets the id parameter in the dynamic url
        const { id } = context.params!;

        console.log("ID", id);

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