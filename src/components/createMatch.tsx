// Third-party imports
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import router from "next/router";
import axios from "axios";
import dynamic from "next/dynamic";
import styled from "styled-components";

// Local imports
import Input from "./Input";
import SelectOption from "./SelectOption";
import { SportsOptions, Modes, FullLocation } from "@/lib/types/General";
import { Sport } from "@/lib/types/Sport";

//dynamic imports
const AddLocationAlt = dynamic(
    () => import("@mui/icons-material/AddLocationAlt")
);
const SportsBasketball = dynamic(
    () => import("@mui/icons-material/SportsBasketball")
);
const PeopleAlt = dynamic(() => import("@mui/icons-material/PeopleAlt"));
const AccessTime = dynamic(() => import("@mui/icons-material/AccessTime"));
const AlertMessage = dynamic(() => import("@/components/alertMessage"));

interface Props {
  props: Sport[];
}


/*
 * this component is used in create match page
 */
export default function CreateMatch({ props }: Props) {

    // Accessing session in front end
    const { data: session } = useSession();

    // Location useState
    const [location, setLocation] = useState<FullLocation>();

    // Address useState
    const [address, setAddress] = useState("");

    // Address suggestions useState - this is for the autofill
    const [suggestions, setSuggestions] = useState([]);

    // Sports useState
    const [sportname, setSportname] = useState("Basketball");

    // Mode useState
    const [mode, setMode] = useState("1V1");

    // Date useState
    const [date, setDate] = useState("");

    // Description useState
    const [description, setDescription] = useState("");

    // Array containing all existing sport
    const allSports: SportsOptions[] = [];

    // Array containing all accessed modes per existing sport
    const allModes: Modes[] = [];

    // This function gets all sport names and push them into allSports array to be accessed later
    props.map((sport: Sport) => {
        allSports.push({ value: sport.name, name: sport.name });
    });

    // This functions gets all existing game modes on each existing sports and push them into allModes array to be accessed later
    props.map((sport: Sport) => {
        if (sport.name === sportname) {
            sport.gameModes.map((mode:any) => {
                allModes.push({ value: mode, name: mode });
            });
        }
    });

    /**
   * This splits the mode string then turns into a number to compute for required players
   * @returns a number to be used for requiredPlayers field in match creation
   */
    function computeReqPlayers(data: string) {

        // Splits mode string into an array of character
        const modeArray = data.split("V");

        // Gets first character from modeArray and converts it to a number
        const num1 = parseInt(modeArray[0]);

        // Gets second character from modeArray and converts it to a number
        const num2 = parseInt(modeArray[1]);

        // Returns computed number for required players
        return num1 + num2;
    }

    //Form submission state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to handle location change event
    async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;

        // handle change of address value in front end
        setAddress(val);

        // Code to set location to be saved on database and set suggestions for autofill
        try {
            const endpoint =
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}
                .json?&limit=3&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
            await axios.get(endpoint).then(({ data }) => {
                setLocation(data);
                setSuggestions(data?.features);
            });
        } catch (error) {
            console.log("Error fetching data, ", error);
        }
    }

    // Function to handle sport change event
    function handleSportChange(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        setSportname(val);
    }

    // Function to handle mode change event
    function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        setMode(val);
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

    // Function to handle submission of form event
    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);

            // Axios fetch post to access create match api
            const res = await axios.post("/api/match/create", {
                matchHost: session!.user.id,
                location: {
                    lng: location?.features[0].geometry.coordinates[0],
                    lat: location?.features[0].geometry.coordinates[1],
                    address: {
                        fullAddress: location?.features[0].place_name,
                        pointOfInterest: location?.features[0].context[0].text,
                        city: location?.features[0].context[2].text,
                        country: location?.features[0].context[5].text,
                    }
                },
                sport: sportname,
                gameMode: { modeName: mode, requiredPlayers: computeReqPlayers(mode) },
                description: description,
                matchStart: date,
                matchType: "REGULAR",
                status: "UPCOMING",
                teams: [
                    { members: [session!.user.userName], score: 0, status: "UNSET" },
                    { members: [], score: 0, status: "UNSET" }
                ]
            });

            // Checks if no successful post response
            if (!res) {
                throw new Error("No Response");
            }

            // Redirect to index page
            router.push("/");

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

    // Custom parent wrapper for autofill feature
    const SuggestionWrapper = styled.div`
	  display: flex;
	  flex-direction: column;
	  background: white;
	  width: 100%;
	  border-radius: 0px 0px 10px 10px;
	  gap: 10px 0px;
      position: absolute;
      z-index: 100;
      top: 5rem;
      background-color: black;
	`;

    // Custom child wrapper for autofill feature
    const Suggestion = styled.p`
	  cursor: pointer;
	  width: 100%;
      color: white;
      transition: all 0.2s ease-in-out;
	`;

    return (
        <div className="flex justify-evenly">
            <div className="flex flex-col gap-2 lg:justify-end ">
                <div className="mt-5">
                    {/* Header for Create Match */}
                    <h1 className="text-white text-3xl text-center pt-3">
                        Create a Match
                    </h1>
                </div>
                {/* Form to be submitted */}
                <form onSubmit={handleFormSubmit} className="w-full text-base">
                    {/* Error and Loading div */}
                    {error && <AlertMessage message={error} type="error" />}
                    {loading && <AlertMessage message="Loading..." type="loading" />}
                    {/* Location Input Box */}
                    <div className="flex flex-col gap-2 z-10 relative w-full">
                        <Input
                            label="Location"
                            value={address}
                            name="location"
                            onChange={handleLocationChange}
                        >
                            <AddLocationAlt />
                        </Input>
                        {/* Autofill for address */}
                        {suggestions?.length > 0 && (
                            <SuggestionWrapper>
                                {suggestions.map((suggestion: any, index: any) => {
                                    return (
                                        <Suggestion
                                            className="w-full text-base hover:bg-orange-500 p-5"
                                            key={index}
                                            onClick={() => {
                                                setAddress(suggestion.place_name);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {suggestion.place_name}
                                        </Suggestion>
                                    );
                                })}
                            </SuggestionWrapper>
                        )}
                    </div>
                    {/* Selection box for Sport */}
                    <SelectOption
                        label="Sport"
                        options={allSports}
                        value={sportname}
                        name="sport"
                        onChange={handleSportChange}
                    >
                        <SportsBasketball />
                    </SelectOption>
                    {/* Selection box for Mode */}
                    <SelectOption
                        label="Type of Match"
                        options={allModes}
                        value={mode}
                        name="mode"
                        onChange={handleModeChange}
                    >
                        <PeopleAlt />
                    </SelectOption>
                    {/* DateTime Input Box */}
                    <Input
                        label="Date and Time"
                        value={date}
                        name="date"
                        type="datetime-local"
                        onChange={handleDateChange}
                    >
                        <AccessTime />
                    </Input>
                    {/* Location Textarea*/}
                    <div className="my-2">
                        <label className="text-[#f3f2ef]" htmlFor="description">
                            Description
                        </label>
                    </div>
                    <div>
                        <textarea
                            className="w-full rounded-md bg-[##f1ecec] px-3 py-2"
                            required
                            rows={3}
                            name="description"
                            value={description}
                            onChange={handleDescriptionChange}
                        ></textarea>
                    </div>
                    <div className="flex justify-center pt-5 cursor-pointer">
                        {/* Button to submit the form*/}
                        <button
                            type="submit"
                            className="rounded-sm w-80 bg-[#fc5c3e] h-10  font-extrabold  text-[#f1ecec]"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}