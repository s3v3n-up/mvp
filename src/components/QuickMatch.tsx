// Local imports
import SelectOption from "./SelectOption";
import { Location, Sports, Props, Modes } from "@/lib/types/General";
import Input from "./Input";

// Third-party imports
import axios from "axios";
import { useSession } from "next-auth/react";
import router from "next/router";
import dynamic from "next/dynamic";
import { ChangeEvent, FormEvent, useState } from "react";

//dynamic imports
const AddLocationAlt = dynamic(
    () => import("@mui/icons-material/AddLocationAlt")
);
const SportsBasketball = dynamic(
    () => import("@mui/icons-material/SportsBasketball")
);
const PeopleAlt = dynamic(() => import("@mui/icons-material/PeopleAlt"));
const AlertMessage = dynamic(() => import("@/components/alertMessage"));

/*
 * this component is used in create match page
 */
export default function QuickMatch({ props }: Props) {
    const { data: session } = useSession();
    const [location, setLocation] = useState<Location>();
    const [sportname, setSportname] = useState("Basketball");
    const [mode, setMode] = useState("1V1");

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

    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);

            // Axios fetch post to access create match api
            const res = await axios.post("/api/match/create", {
                matchHost: session!.user.id,
                location: { lat: 22, lng: -122 }, // this is temporary while we haven't finished mapbox
                sport: sportname,
                gameMode: { modeName: mode, requiredPlayers: computeReqPlayers(mode) },
                matchStart: new Date(Date.now()),
                matchType: "QUICK",
                status: "UPCOMING",
            });

            // Checks if no successful post response
            if (!res) {
                throw new Error("No Response");
            }
            router.push("/");
        } catch (err: any) {
            if (err!.response) {
                setError(err.response.data.message);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // Array containing all existing sport
    const allSports: Sports[] = [
        { value: "basketball", name: "basketball" },
        { value: "soccer", name: "soccer" },
    ];

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
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
            Create Quick Match
                    </h1>
                </div>
                <form onSubmit={handleFormSubmit}>
                    {error && <AlertMessage message={error} type="error" />}
                    {loading && <AlertMessage message="Loading..." type="loading" />}
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
