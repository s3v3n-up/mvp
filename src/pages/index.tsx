//third-party import
import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import haversine from "haversine-distance";

//local import
import styles from "@/styles/Home.module.sass";
import Cardstyles from "@/styles/MatchCard.module.sass";
import Input from "@/components/Input";
import { getMatches } from "@/lib/actions/match";
import { getUsers } from "@/lib/actions/user";
import { Location } from "@/lib/types/General";

//dynamic import
const Search = dynamic(() => import("@mui/icons-material/Search"), {
    ssr: false,
});
const ScrollContainer = dynamic(() => import("react-indiana-drag-scroll"), {
    ssr: false,
});

/**
 * *
 * @description this page displays all the matches created by users from regular matches to quick matches
 *
 */
export default function Home({ regMatches, quickMatches, users }: any) {
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const [search, setSearch] = useState("");

	 // Location useState
	 const [currentLocation, setCurrentLocation] = useState<Location>();

	 // Address useState
	 const [address, setAddress] = useState<Location>();

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

            setCurrentLocation({
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

    /**
   * handle search input change
   */
    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    /**
   * handle clicked for cards
   */
    function cardClicked(id: string) {
        return router.push(`/match/${id}/view`);
    }

    function hostAvatar(id: string) {
        const host = users.filter((user: any) => user._id === id);

        return host[0].image;
    }

    function lookUser(id: string) {
        const userFound = users.filter((user: any) => user._id === id);

        return userFound[0].userName;
    }

    return (
        <div className={styles.matches}>
            {/* search container */}
            <div className={styles.search}>
                {/* title for the page */}
                <h1>Matches</h1>
                <div className={styles.searchitem}>
                    {/* search input field */}
                    <Input
                        type="text"
                        placeholder="Enter username or location"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button>
                        <Search fontSize="medium" />
                    </button>
                </div>
            </div>
            <div>
                {/* Subtitle for quick matches */}
                <p>Quick Matches</p>
                {/* Scroll container for quick matches */}
                {quickMatches.length === 0 && (
                    <p className="text-2xl text-white text-center">
                        {" "}
            ⚠️ There is no quick match found
                    </p>
                )}
                <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                    {/* //add comments */}
                    {quickMatches.length > 0 &&
                        quickMatches
                            .filter(
                                (quick: any) =>
                                    quick.sport.toLowerCase().includes(search.toLowerCase()) ||
                  lookUser(quick.matchHost).includes(search.toLowerCase())
                            )
                            .map((quick: any, idx: any) => (

                                // card container
                                <div className={Cardstyles.container} key={idx}>
                                    <div className={Cardstyles.time}>
                                        <div className={Cardstyles.detail}>
                                            <p>Now</p>
                                        </div>
                                        <div>
                                            <button className={Cardstyles.join}>join</button>
                                        </div>
                                    </div>

                                    <div className={Cardstyles.sport}>
                                        <p>{quick.sport}</p>
                                    </div>
                                    <div className={Cardstyles.location}>
                                        <div>
                                            <LocationOnIcon />
                                        </div>
                                        <p>{quick.location.address.pointOfInterest}</p>
                                        <p>{Math.ceil(haversine({ latitude: currentLocation?.lat as number, longitude: currentLocation?.lng as number },{ latitude: quick.location.lat as number, longitude: quick.location.lng as number }) / 1000)}km away</p>
                                        <Image
                                            src={hostAvatar(quick.matchHost)}
                                            alt="avatar"
                                            className={Cardstyles.avatar}
                                            width={45}
                                            height={45}
                                        />
                                    </div>
                                </div>
                            ))}
                </ScrollContainer>
            </div>
            <div className="sm:mt-4 mt-10">
                {/*  Subtitle for regular matches */}
                <p>Regular Matches</p>
                {/* Scroll container for regular matches */}
                {regMatches.length === 0 && (
                    <p className="text-2xl text-white text-center">
                        {" "}
            ⚠️ There is no regular match found
                    </p>
                )}
                <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                    {/*filters through regular matches including lower case letters in text input*/}
                    {regMatches.length > 0 &&
            regMatches
                .filter(
                    (reg: any) =>
                        reg.sport.toLowerCase().includes(search.toLowerCase()) ||
                  lookUser(reg.matchHost).includes(search.toLowerCase())
                )
                .map((reg: any, idx: any) => (

                    // card container
                    <div
                        className={Cardstyles.container}
                        key={idx}
                        onClick={() => cardClicked(reg._id as string)}
                    >
                        <div className={Cardstyles.time}>
                            <div className={Cardstyles.detail}>
                                {/* custom format for match that includes date, day of the week and time */}
                                <p>
                                    {new Date(reg.matchStart)
                                        .toDateString()
                                        .concat(
                                            " " +
                              new Date(reg.matchStart).toLocaleTimeString(
                                  "en-US"
                              )
                                        )}
                                </p>
                            </div>
                            <div>
                                <button className={Cardstyles.join}>join</button>
                            </div>
                        </div>

                        <div className={Cardstyles.sport}>
                            <p>{reg.sport}</p>
                        </div>

                        <div className={Cardstyles.location}>
                            <div>
                                <LocationOnIcon />
                            </div>
                            <p>{reg.location.address.pointOfInterest}</p>
                            <p>{Math.ceil(haversine({ latitude: currentLocation?.lat as number, longitude: currentLocation?.lng as number },{ latitude: reg.location.lat as number, longitude: reg.location.lng as number }) / 1000)}km away</p>
                            <Image
                                src={hostAvatar(reg.matchHost)}
                                alt="avatar"
                                className={Cardstyles.avatar}
                                width={45}
                                height={45}
                            />
                        </div>
                    </div>
                ))}
                </ScrollContainer>
            </div>
        </div>
    );
}

// Access sport detail and pass as props
export async function getServerSideProps() {

    //call getMatches function
    const data = await getMatches();

    // Call getUsers function
    const dataUsers = await getUsers();

    //converts data into object
    const matches = JSON.parse(JSON.stringify(data));

    // Convert dataUsers into object
    const users = JSON.parse(JSON.stringify(dataUsers));

    //check if the match is quick
    const quickMatches = matches.filter(
        (match: any) => match.matchType === "QUICK" && match.status === "UPCOMING"
    );

    //checks if the match is regular
    const regMatches = matches.filter(
        (match: any) => match.matchType === "REGULAR" && match.status === "UPCOMING"
    );

    //returns as a props
    return {
        props: {
            quickMatches,
            regMatches,
            users,
        },
    };
}