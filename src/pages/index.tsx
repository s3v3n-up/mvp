//third-party import
import { useState, ChangeEvent, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Home.module.sass";
import Cardstyles from "@/styles/MatchCard.module.sass";
import Input from "@/components/Input";
import { getMatches } from "@/lib/actions/match";

//dynamic import
const Search = dynamic(() => import("@mui/icons-material/Search"), { ssr: false });
const ScrollContainer = dynamic(() => import("react-indiana-drag-scroll"), { ssr: false });

/**
 * *
 * @description this page displays all the matches created by users from regular matches to quick matches
 *
 */
export default function Home({ regMatches, quickMatches }: any) {
    const { status } = useSession();
    const router = useRouter();
    useEffect(()=> {
        if (status==="loading") return;
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const [search, setSearch] = useState("");

    /**
     * handle search input change
     */
    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
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
                {quickMatches.length === 0 && <p className="text-2xl text-white text-center"> ⚠️ There is no regular match found</p>}
                <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                    {quickMatches.length > 0 && quickMatches.map((quick: any, idx: any) => (

                        // card container
                        <div className={ Cardstyles.container} key={idx}>
                            <div className={ Cardstyles.time}>
                                <div className={Cardstyles.detail}>
                                    <p>Now</p>
                                </div>
                                <div>
                                    <button className={Cardstyles.join}>join</button>
                                </div>
                            </div>

                            <div className={ Cardstyles.sport}>
                                <p>{quick.sport}</p>
                            </div>
                            <div className={Cardstyles.location}>
                                <div>
                                    <LocationOnIcon/>
                                </div>
                                <p>location</p>
                            </div>
                        </div>
                    ))}
                </ScrollContainer>
            </div>
            <div className="sm:mt-4 mt-10">
                {/*  Subtitle for regular matches */}
                <p>Regular Matches</p>
                {/* Scroll container for regular matches */}
                {regMatches.length === 0 && <p className="text-2xl text-white text-center"> ⚠️ There is no quick match found</p>}
                <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                    {regMatches.map((reg : any, idx: any) => (

                        // card container
                        <div className={ Cardstyles.container} key={idx}>
                            <div className={ Cardstyles.time}>
                                <div className={Cardstyles.detail}>
                                    {/* custom format for match that includes date, day of the week and time */}
                                    <p>{new Date(reg.matchStart).toDateString().concat(" " + new Date(reg.matchStart).toLocaleTimeString("en-US"))}</p>
                                </div>
                                <div>
                                    <button className={ Cardstyles.join}>join</button>
                                </div>
                            </div>

                            <div className={ Cardstyles.sport}>
                                <p>{reg.sport}</p>
                            </div>

                            <div className={Cardstyles.location}>
                                <div>
                                    <LocationOnIcon/>
                                </div>
                                <p> location</p>
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

    //converts data into object
    const matches = JSON.parse(JSON.stringify(data));

    //check if the match is quick
    const quickMatches = matches.filter(
        (match: any) => match.matchType === "QUICK"
    );

    //checks if the match is regular
    const regMatches = matches.filter(
        (match: any) => match.matchType === "REGULAR"
    );

    //returns as a props
    return {
        props: {
            quickMatches,
            regMatches,
        },
    };
}
