//third-party import
import { useState, ChangeEvent, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

//local import
import styles from "@/styles/Home.module.sass";
import Input from "@/components/Input";

//dynamic import
const Search = dynamic(() => import("@mui/icons-material/Search"), { ssr: false });

//create fake data for card components
const names = ["whale", "squid", "turtle", "coral", "starfish", "star"];

/**
 * *
 * @description this page displays all the matches created by users from regular matches to quick matches
 *
 */
export default function Home() {
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
            <div className={styles.search}>
                <h1>Matches</h1>
                <div className={styles.searchitem}>
                    <Input
                        type="text"
                        placeholder="Enter username or location"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button>
                        <Search fontSize="medium"/>
                    </button>
                </div>
            </div>
            <div>
                <p>Quick Matches</p>
                <ScrollContainer className="flex w-full" horizontal hideScrollbars>
                    {names.map((name) => (
                        <div className={styles.cards} key={name}>
                            {name}
                        </div>
                    ))}
                </ScrollContainer>
            </div>
            <div className="sm:mt-3 mt-10">
                <p>Regular Matches</p>
                <ScrollContainer className="flex w-full" horizontal hideScrollbars nativeMobileScroll>
                    {names.map((name) => (
                        <div className={styles.cards} key={name}>
                            {name}
                        </div>
                    ))}
                </ScrollContainer>
            </div>
        </div>
    );
}
