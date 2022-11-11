// Local imports
import Input from "./Input";
import SelectOption from "./SelectOption";
import { Location, SportsOptions, Modes, Pos, FullLocation } from "@/lib/types/General";
import { Sport } from "@/lib/types/Sport";

// Third party imports
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import router from "next/router";
import dynamic from "next/dynamic";

//dynamic imports
const AddLocationAlt = dynamic(
    () => import("@mui/icons-material/AddLocationAlt")
);
const SportsBasketball = dynamic(
    () => import("@mui/icons-material/SportsBasketball")
);
const PeopleAlt = dynamic(() => import("@mui/icons-material/PeopleAlt"));
const AlertMessage = dynamic(() => import("@/components/alertMessage"));

// Props interface
export interface Props {
  props: Sport[];
}

/*
 * this component is used in create match page
 */
export default function QuickMatch({ props }: Props) {

    // Gets the session of the user
    const { data: session } = useSession();

    // Stores and Sets the location
    const [location, setLocation] = useState<Location>();

    // Stores and sets address
    const [address, setAddress] = useState<FullLocation>();

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

            setLocation({
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

    // useEffect to set address for it to display as a string since we are storing location as longitude and latitude in the database
    useEffect(() => {
        axios
            .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${location?.lng},${location?.lat}
                .json?types=address&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
            )
            .then(({ data }) => {
                setAddress(data);
            });
    }, [location]);

    // Stores and Sets the sportname
    const [sportname, setSportname] = useState<string>("Basketball");

    // Stores and Sets the mode
    const [mode, setMode] = useState<string>("1V1");

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
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

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
                location: {
                    lng: address?.query[0],
                    lat: address?.query[1],
                    address: {
                        fullAddress: address?.features[0].place_name,
                        pointOfInterest: address?.features[0].context[0].text,
                        city: address?.features[0].context[2].text,
                        country: address?.features[0].context[5].text,
                    }
                },
                sport: sportname,
                gameMode: { modeName: mode, requiredPlayers: computeReqPlayers(mode) },
                matchType: "QUICK",
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
            sport.gameModes.map((mode: any) => {
                allModes.push({ value: mode.modeNames, name: mode.modeNames });
            });
        }
    });

    return (
        <div className="flex justify-evenly mt-10 w-full">
            <div className="flex flex-col space-y-2 sm:w-3/5 w-11/12">
                <div>
                    {/* Header for Quick Match Page */}
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-1 mb-5">
                        Create Quick Match
                    </h1>
                </div>
                {/* Form to be submitted */}
                <form onSubmit={handleFormSubmit} className="lg:w-2/5 w-11/12 m-auto text-base flex flex-col gap-3">
                    {/* Error and Loading div */}
                    {error && <AlertMessage message={error} type="error" />}
                    {loading && <AlertMessage message="Loading..." type="loading" />}
                    <Input
                        label="Location"
                        value={address ? address.features[0].place_name : ""}
                        name="location"
                        readonly
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
                            className="rounded-md bg-[#fc5c3e] h-10  font-extrabold  text-[#f1ecec] w-full"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
