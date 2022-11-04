// Third-party imports
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import {
    AddLocationAlt,
    SportsBasketball,
    PeopleAlt,
    AccessTime,
} from "@mui/icons-material";
import router from "next/router";
import axios from "axios";

// Local imports
import Input from "./Input";
import SelectOption from "./SelectOption";

// Location interface
interface Location {
  lng: number;
  lat: number;
}

// Props interface
interface Props {
  props: string[];
}

// Modes interface for all sport game modes
interface Modes {
  value: string;
  name: string;
}

// Sports interface for all sports
interface Sports {
  value: string;
  name: string;
}

/*
 * this component is used in create match page
 */
export default function CreateMatch({ props }: Props) {

    // Accessing session in front end
    const { data: session } = useSession();

    // Location useState
    const [location, setLocation] = useState<Location>();

    // Sports useState
    const [sportname, setSportname] = useState("Basketball");

    // Mode useState
    const [mode, setMode] = useState("");

    // Date useState
    const [date, setDate] = useState("");

    // Description useState
    const [description, setDescription] = useState("");

    // Array containing all existing sport
    const allSports: Sports[] = [];

    // Array containing all accessed modes per existing sport
    const allModes: Modes[] = [];

    // This function gets all sport names and push them into allSports array to be accessed later
    props.map((sport: any) => {
        allSports.push({ value: sport.name, name: sport.name });
    });

    // This functions gets all existing game modes on each existing sports and push them into allModes array to be accessed later
    props.map((sport: any) => {
        if (sport.name === sportname) {
            sport.gameModes.map((mode: any) => {
                allModes.push({ value: mode.modeNames, name: mode.modeNames });
            });
        }
    });

    //Form submission state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to handle location change event
    function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;

        setLocation({
            lat: 0,
            lng: 0,
        });
    }

    // Function to handle sport change event
    function handleSportChange(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        setSportname(val);
    }

    // Function to handle mode change event
    function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        console.log(val);
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
                location: { lat: 22, lng: -122 }, // this is temporary while we haven't finished mapbox
                sport: sportname,
                gameMode: mode,
                matchStart: date,
                description: description,
                matchType: "REGULAR",
            });

            // Checks if no successful post response
            if (!res) {
                throw new Error("No Response");
            }
            router.push("/");
        } catch (err: any) {
            throw new Error("NETWORK ERROR", err);
        }
    }

    return (
        <div className="flex justify-evenly">
            <div className="flex flex-col space-y-2 lg:justify-end ">
                <div className="mt-5">
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
            Create a Match
                    </h1>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <Input
                        label="Location"
                        value={"0"}
                        name="location"
                        onChange={handleLocationChange}
                    >
                        <AddLocationAlt />
                    </Input>
                    <SelectOption
                        label="Sport"
                        options={allSports}
                        value={sportname}
                        name="sport"
                        onChange={handleSportChange}
                    >
                        <SportsBasketball />
                    </SelectOption>
                    <SelectOption
                        label="Type of Match"
                        options={allModes}
                        value={mode}
                        name="mode"
                        onChange={handleModeChange}
                    >
                        <PeopleAlt />
                    </SelectOption>
                    <Input
                        label="Date and Time"
                        value={date}
                        name="date"
                        type="datetime-local"
                        onChange={handleDateChange}
                    >
                        <AccessTime />
                    </Input>
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
