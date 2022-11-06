// Local imports
import Input from "./Input";
import SelectOption from "./SelectOption";
import { Location, Sports, Props, Modes } from "@/lib/types/General";

// Third party imports
import { ChangeEvent, FormEvent, useState } from "react";
import {
    AddLocationAlt,
    SportsBasketball,
    PeopleAlt,
} from "@mui/icons-material";
import axios from "axios";
import { useSession } from "next-auth/react";
import router from "next/router";

/*
 * this component is used in create match page
 */
export default function QuickMatch({ props }: Props) {

    // Gets the session of the user
    const { data: session } = useSession();

    // Stores and Sets the location
    const [location, setLocation] = useState<Location>();

    // Stores and Sets the sportname
    const [sportname, setSportname] = useState("Basketball");

    // Stores and Sets the mode
    const [mode, setMode] = useState("1V1");

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
        setMode(val);
    }

    // Function that handles form submission
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
                matchStart: new Date(Date.now()),
                matchType: "QUICK",
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

    return (
        <div className="flex justify-evenly">
            <div className="flex flex-col space-y-2 lg:justify-end ">
                <div>
                    {/* Header for Quick Match Page */}
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
            Create Quick Match
                    </h1>
                </div>
                {/* Form to be submitted */}
                <form onSubmit={handleFormSubmit}>
                    {/* Input box for Location */}
                    <Input
                        label="Location"
                        value={"0"}
                        name="location"
                        onChange={handleLocationChange}
                    >
                        <AddLocationAlt />
                    </Input>
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
                    {/* Button to submit the form */}
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
