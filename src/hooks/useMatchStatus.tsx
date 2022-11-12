import type { Match } from "@/lib/types/Match";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { checkIfMatchHasStarted } from "@/lib/helpers/match";

/**
 * hooks to navigate according to match status
 * @param match - match data
 */
export default function useMatchNavigate(match: Match) {
    const router = useRouter();

    useEffect(() => {

        //check match every 1 seconds for if it has started
        const checkMatchStart = setInterval(async ()=> {

            //if match has type of quick
            if (match.matchType === "QUICK" &&
            router.pathname !== `/match/${match._id}/scoreboard`)
            {
                router.push(`/match/${match._id}/scoreboard`);
            }

            //check if match has started, if yes navigate to scoreboard
            checkIfMatchHasStarted(match,()=>{
                if (router.pathname !== `/match/${match._id}/scoreboard`) {
                    router.push(`/match/${match._id}/scoreboard`);
                }
            });
        }, 1000);

        if (((match.status === "INPROGRESS" ||
            match.status === "PAUSED") &&
            router.pathname === `/match/${match._id}/scoreboard`) ||
            match.status === "FINISHED" ||
            match.status === "CANCELLED" ||
            match.matchType === "QUICK") {
            clearInterval(checkMatchStart);
        }

        //redirect to result page if match is finished
        if (match.status === "FINISHED") {
            router.push(`/match/${match._id}/result`);

            return;
        }

        //redirect to cancel page if match cancelled
        if (match.status === "CANCELLED") {
            router.push("/match/cancel");

            return;
        }

        return () => clearInterval(checkMatchStart);
    }, [match, router]);
}