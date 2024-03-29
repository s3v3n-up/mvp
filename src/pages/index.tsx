//third-party import
import Head from "next/head";
import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import haversine from "haversine-distance";

//local import
import styles from "@/styles/Home.module.sass";
import Cardstyles from "@/styles/MatchCard.module.sass";
import Input from "@/components/Input";
import { getMatches } from "@/lib/actions/match";
import { getUsers } from "@/lib/actions/user";
import { Location, Pos } from "@/lib/types/General";
import axios from "axios";
import Database from "@/lib/resources/database";
import type { Match } from "@/lib/types/Match";
import type { UserProfile } from "@/lib/types/User";
import { checkIfMatchIsFull } from "@/lib/helpers/match";

//dynamic import
const Search = dynamic(() => import("@mui/icons-material/Search"), {
    ssr: false,
});
const ScrollContainer = dynamic(() => import("react-indiana-drag-scroll"), {
    ssr: false,
});
const LocationOnIcon = dynamic(() => import("@mui/icons-material/LocationOn"), {
    ssr: false,
});

/**
 * home page props type
 * @property {Match[]} regMatches - list of regular matches
 * @property {Match[]} quickMatches - list of quick matches
 * @property {UserProfile[]} users - list of users
 */
interface Props {
  regMatches: Match[];
  quickMatches: Match[];
  users: UserProfile[];
}

/**
 * *
 * @description this page displays all the matches created by users from regular matches to quick matches
 *
 */
export default function Home({ regMatches, quickMatches, users }: Props) {
    const { session } = useAuth();
    const router = useRouter();

    const [search, setSearch] = useState("");

    // Location useState
    const [currentLocation, setCurrentLocation] = useState<Location>();

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

            setCurrentLocation({
                lat: crd.latitude,
                lng: crd.longitude,
            });
        };

        // Error parameter for currentPosition function
        function error(err: any) {
            alert(`ERROR(${err.code}): ${err.message}`);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);

    /**
   * handle search input change
   */
    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    //handles card clicked
    function handleCardClicked(id: string) {
        return router.push(`/match/${id.toString()}/scoreboard`);
    }

    //handles filtering user
    function handleLookUser(id: string) {
        const userFound = users.filter((user: UserProfile) => user._id === id);

        return userFound && userFound.length > 0 ? userFound[0].userName : "";
    }

    //handles hostAvatar
    function handleHostAvatar(id: string) {
        const host = users.filter((user: UserProfile) => user._id === id);

        return host && host.length > 0 ? host[0].image : "/img/logo.png";

    }

    // Function to join the regular match
    async function joinReg(id: string) {
        try {
            await axios.put(`api/match/${id.toString()}/team/join`, {
                userName: session?.user.userName,
            }).then(()=>{
                router.push(`/match/${id.toString()}/scoreboard`);
            });
        } catch (error) {
            return;
        }
    }

    // Functrion to join the quick match
    async function joinQuick(id: string) {
        await axios.put(`api/match/${id.toString()}/team/join`, {
            userName: session?.user.userName,
        }).then(()=> {
            router.push(`/match/${id.toString()}/scoreboard`);
        });
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | Home</title>
                <meta
                    name="description"
                    content="View or create matches and compete with
                strangers to be number one in your favourite sports"
                />
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <div className={styles.matches}>
                {/* search container */}
                <div className={styles.search}>
                    {/* title for the page */}
                    <h1 className="px-2 py-3">Matches</h1>
                    <div className={styles.searchitem}>
                        {/* search input field */}
                        <Input
                            type="text"
                            placeholder="Enter username or sport"
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
                    {quickMatches.length === 0 && (
                        <p className="text-2xl text-white text-center">
              ⚠️ There is no quick match found
                        </p>
                    )}
                    {/* horizontal sroll for created matches */}
                    <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                        {/*filters through quick matches including lower case letters in text input*/}
                        {quickMatches.length > 0 &&
              quickMatches
                  .filter(
                      (quick: Match) =>
                          quick.sport.toLowerCase().includes(search.toLowerCase()) ||
                    handleLookUser(quick.matchHost).includes(
                        search.toLowerCase()
                    )
                  )
                  .map((quick: Match, idx: number) => {
                      const distance = Math.ceil(
                          haversine(
                              {
                                  latitude: currentLocation?.lat as number,
                                  longitude: currentLocation?.lng as number,
                              },
                              {
                                  latitude: quick.location.lat as number,
                                  longitude: quick.location.lng as number,
                              }
                          ) / 1000
                      );

                      return (

                      // card container
                          <div className={Cardstyles.container} key={idx}>
                              {/* displays day/date/time */}
                              <div
                                  className={Cardstyles.time}
                                  onClick={() => handleCardClicked(quick._id!.toString())}
                              >
                                  <div className={Cardstyles.detail}>
                                      <p>Now</p>
                                  </div>
                                  {/* button for user join a match */}
                                  {quick.matchHost !== session?.user.id && (
                                      <div>
                                          <button
                                              className={Cardstyles.join}
                                              onClick={() => joinQuick(quick._id!.toString())}
                                          >
                              join
                                          </button>
                                      </div>
                                  )}
                              </div>
                              {/* displays the type of sports */}
                              <div className={Cardstyles.sport}>
                                  <p>{quick.sport}</p>
                              </div>
                              {/* displays the point of interest and how far is the user away from the specific location in km */}
                              <div className={Cardstyles.location}>
                                  <div>
                                      <LocationOnIcon />
                                  </div>
                                  <p>{quick.location.address.pointOfInterest}</p>
                                  <p>
                                      {(!isNaN(distance) && `${distance}km away`) ||
                            "No Location"}
                                  </p>
                                  {/* displays user avatar that create the match */}
                                  <Image
                                      src={handleHostAvatar(quick.matchHost)}
                                      alt="avatar"
                                      className={Cardstyles.avatar}
                                      width={45}
                                      height={45}
                                  />
                              </div>
                          </div>
                      );
                  })}
                    </ScrollContainer>
                </div>
                <div className="sm:mt-4 mt-10">
                    {/*  Subtitle for regular matches */}
                    <p>Regular Matches</p>
                    {regMatches.length === 0 && (
                        <p className="text-2xl text-white text-center">
              ⚠️ There is no regular match found
                        </p>
                    )}
                    {/* horizontal scroll for created matches */}
                    <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                        {/*filters through regular matches including lower case letters in text input*/}
                        {regMatches.length > 0 &&
              regMatches
                  .filter(
                      (reg: Match) =>
                          reg.sport.toLowerCase().includes(search.toLowerCase()) ||
                    handleLookUser(reg.matchHost).includes(search.toLowerCase())
                  )
                  .map((reg: Match, idx: number) => {
                      const distance = Math.ceil(
                          haversine(
                              {
                                  latitude: currentLocation?.lat as number,
                                  longitude: currentLocation?.lng as number,
                              },
                              {
                                  latitude: reg.location.lat as number,
                                  longitude: reg.location.lng as number,
                              }
                          ) / 1000
                      );

                      return (

                      // card container
                          <div className={Cardstyles.container} key={idx}>
                              <div
                                  className={Cardstyles.time}
                                  onClick={() => handleCardClicked(reg._id as string)}
                              >
                                  <div className={Cardstyles.detail}>
                                      {/* custom format for match that includes date, day of the week and time */}
                                      <p>
                                          {new Date(reg.matchStart!)
                                              .toDateString()
                                              .concat(
                                                  " " +
                                  new Date(reg.matchStart!).toLocaleTimeString(
                                      "en-US"
                                  )
                                              )}
                                      </p>
                                  </div>
                                  {/* button for user join a match */}
                                  {reg.matchHost !== session?.user.id && (
                                      <button
                                          className={Cardstyles.join}
                                          onClick={() => joinReg(reg._id!.toString())}
                                      >
                            join
                                      </button>
                                  )}
                              </div>
                              {/* displays the type of sports */}
                              <div className={Cardstyles.sport}>
                                  <p>{reg.sport}</p>
                              </div>
                              {/* displays the point of interest and how far is the user away from the specific location in km */}
                              <div className={Cardstyles.location}>
                                  <div>
                                      <LocationOnIcon />
                                  </div>
                                  <p>{reg.location.address.pointOfInterest}</p>
                                  <p>
                                      {(!isNaN(distance) && `${distance}km away`) ||
                            "No Location"}
                                  </p>
                                  {/* displays user that create the match */}
                                  <Image
                                      src={handleHostAvatar(reg.matchHost)}
                                      alt="avatar"
                                      className={Cardstyles.avatar}
                                      width={45}
                                      height={45}
                                  />
                              </div>
                          </div>
                      );
                  })}
                    </ScrollContainer>
                </div>
            </div>
        </>
    );
}

// Access sport detail and pass as props
export async function getServerSideProps() {

    //setup database connection
    await Database.setup();

    //call getMatches function
    const matchData: Match[] = await getMatches();

    // Call getUsers function
    const usersData: UserProfile[] = await getUsers();

    const availableMatches = matchData.filter(
        (match) => !checkIfMatchIsFull(match)
    );

    //check if the match is quick
    const quickMatches = availableMatches.filter(
        (match: Match) => match.matchType === "QUICK" && match.status === "UPCOMING"
    );

    //checks if the match is regular
    const regMatches = availableMatches.filter(
        (match: Match) =>
            match.matchType === "REGULAR" && match.status === "UPCOMING"
    );

    //returns as a props
    return {
        props: {
            quickMatches: JSON.parse(JSON.stringify(quickMatches)),
            regMatches: JSON.parse(JSON.stringify(regMatches)),
            users: JSON.parse(JSON.stringify(usersData)),
        },
    };
}
