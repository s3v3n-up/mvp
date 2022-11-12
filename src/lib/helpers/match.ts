import type { Match } from "@/lib/types/Match";
import axios from "axios";

/**
 * function to check if regular match has started, then update match status accordingly
 * @param match - regular match to check
 * @param onMatchStart - callback function to execute when match has started
 */
export function checkIfMatchHasStarted(match: Match, onMatchStart: ()=> void) {
    if (match.matchType === "QUICK") {
        return;
    }

    //boolean check if match teams are full
    const isMemberFull = match.teams[0].members.concat(match.teams[1].members).length === match.gameMode.requiredPlayers;

    //boolean check if match is alredy started
    const isMatchStarted = new Date(match.matchStart!.toLocaleString()).getTime() <= new Date().getTime();

    //if match is started
    if (isMatchStarted) {

        //if member is not full, cancel the match
        if (!isMemberFull && match.status !== "CANCELLED") {
            (async()=>await axios.put(`/api/match/${match._id}/operation/cancel`,{
                cancelTime: new Date().toString()
            }))();
        }

        //if status is still upcoming, update it to in progress
        else if (match.status === "UPCOMING") {
            (async()=>await axios.put(`/api/match/${match._id}/status`,{
                status: "INPROGRESS"
            }))();
        }

        //on match start do something
        onMatchStart();
    }
}

/**
 * @param match the match user want to join
 * @param user check for username
 */

export function checkIfUserInMatch(match:Match, userName:string){

    // find out the username
    const user = userName;

    //check if the username exist in the match members
    const userInMatch = match.teams[0].members.concat(match.teams[1].members).includes(user);

    if(userInMatch){
        return true;
    }

    return false;
}

/**
 * @param {Match} match - to check if full
 */
export function checkIfMatchIsFull(match:Match){

    //check if the match is full
    const isMemberFull = match.teams[0].members.concat(match.teams[1].members).length === match.gameMode.requiredPlayers;

    if(isMemberFull){
        return true;
    }

    return false;
}

