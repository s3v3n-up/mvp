import type { UserProfile } from "../types/User";
import axios from "axios";

/**
* map players in a list to their team(home or away)
* @param {UserProfile[]} players list of players to map
* @param {{members: string[]}, {members: string[]}} teams to map players to
*/
export function mapPlayerToTeam(players: UserProfile[], teams: [{members: string[]}, {members: string[]}]) {
    const [home, away] = teams;
    const team1Players = players.filter((player) => home.members.includes(player.userName));
    const team2Players = players.filter((player) => away.members.includes(player.userName));

    return [team1Players, team2Players];
}