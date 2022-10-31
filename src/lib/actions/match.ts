import MatchModel from "../resources/models/Match";
import type { Match } from "@/lib/types/Match";

/**
 * add a new match to the database
 * @param {Match} match new match data
 * @returns {Promise<Match>} promise that resolves to the new match
 * @throws {Error} if match creation fails
 */
export async function createMatch(match: Match): Promise<Match> {
    try {

        // create new match
        const createdMatch = await MatchModel.create(match);

        //return created match
        return createdMatch;
    } catch(error: any) {
        throw new Error("error creating match", { cause: error });
    }
}

/**
 * get all matches from the database
 * @returns {Promise<Match[]>} promise that resolves to an array of matches
 */
export async function getMatches(): Promise<Match[]> {
    try {

        // get all matches
        const matches = await MatchModel.find({});

        // return matches
        return matches;
    } catch(error: any) {
        throw new Error("error getting matches", { cause: error });
    }
}

/**
 * find match by _id
 * @param {string} id of match to find
 * @returns {Promise<Match>} promise that resolves to a match
 */
export async function getMatchById(_id: string): Promise<Match> {
    try {

        //find match by id in database
        const match = await MatchModel.findById(_id);

        //if match is not found, throw error
        if (!match) {
            throw new Error("match not found");
        }

        //return match that matches the _id
        return match;
    } catch(error: any) {

        //database error
        if (error.code) {
            throw new Error("database server error", { cause: error });
        }

        //match not found error
        throw new Error("error finding match", { cause: error });
    }
}

/**
 * Update a team's score in a match
 * @param matchId id of match to update
 * @param teamIdx index of team to update
 * @returns {Promise<Match>} promise that resolves to updated match
 */
export async function IncreaseMatchScoreOfTeam(matchId: string, teamIdx: number) {
    try {
        const match = await MatchModel.findById(matchId);
        if (!match) {
            throw new Error("match not found");
        }

        //increase score of team
        match.teams[teamIdx].score++;

        //save match
        await match.save();

        //return updated match
        return match;
    } catch(error: any) {
        throw new Error("error increasing match score", { cause: error });
    }
}

/**
 * find matches between two dates
 * @param start start date of matches to find
 * @param end end date of matches to find
 * @returns {Promise<Match[]>} promise that resolves to array of matches
 */
export async function getMatchesBetweenDates(start: Date, end: Date) {
    try {
        const matches = await MatchModel.find({
            startDate: {
                $gte: start,
                $lt: end,
            },
        });

        return matches;
    } catch(error: any) {
        throw new Error("error getting matches between dates", { cause: error });
    }
}

/**
 * add new members to a match's team
 * @param matchId id of match to update
 * @param teamIdx team index to add members to, 0 means home team, 1 means away team
 * @param userNames list of usernames to add to team
 * @returns {Promise<Match>} promise that resolves to updated match
 * @throws {Error} if match is not found
 */
export async function addMembersToTeam(matchId: string, teamIdx: 0 | 1, userNames: string[]) {
    try {
        const match = await MatchModel.findById(matchId);

        //if match is not found, throw error
        if (!match) {
            throw new Error("match not found");
        }

        //if member not in team yet, add member to team
        for (const userName of userNames) {
            if (!match.teams[teamIdx].members.includes(userName)) {
                match.teams[teamIdx].members.push(userName);
            }
        }
        await match.save();

        return match;
    } catch(error: any) {
        throw new Error("error adding members to team", { cause: error });
    }
}

/**
 * remove members from a match's team
 * @param matchId id of match to update
 * @param teamIdx team index to remove members from, 0 mean home team, 1 means away team
 * @param userNames list of usernames to remove from team
 * @returns {Promise<Match>} promise that resolves to updated match
 * @throws {Error} if match is not found
 */
export async function removeMembersFromTeam(matchId: string, teamIdx: 0 | 1, userNames: string[]) {
    try {
        const match = await MatchModel.findById(matchId);

        //if match is not found, throw error
        if (!match) {
            throw new Error("match not found");
        }

        //remove specified members from team
        match.teams[teamIdx].members = match.teams[teamIdx].members.filter((member) => !userNames.includes(member));
        await match.save();

        return match;
    } catch (error: any) {
        throw new Error("error removing members from team", { cause: error });
    }
}

/**
 * update a match with a new match data
 * @param matchId id of match to update
 * @param match new match data
 * @returns {Promise<Match>} promise that resolves to updated match
 */
export async function updateMatch(matchId: string, match: Match) {
    try {

        //ref: https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
        const updatedMatch = await MatchModel.findByIdAndUpdate(matchId, match);

        return updatedMatch;
    } catch(error: any) {
        throw new Error("error updating match", { cause: error });
    }
}

/**
 * get leaderboard of a sport
 * @param {string} sport - sport to get leaderboard for
 * @limit {number} limit - number of users to return
 * @returns {Promise<{_id: string, numberOfWins: number}[]>} a promise that resolves to an array of users and their number of wins
 */
// steps:
// 1. get all matches of a sport
// 2. get all teams of each match
// 3. get all winning teams from those teams
// 4. get all users from those winning teams
// 5. group all users by user id and count them
// 6. sort users by count
// 7. return top users
// ref: https://www.youtube.com/watch?v=uQ2Kom7Z9Ug&list=PLYxzS__5yYQmr3HQQJMPBMbKtMY37sdsv&index=6
// ref: https://www.youtube.com/watch?v=zwjRdEhn2xs&list=PLYxzS__5yYQmr3HQQJMPBMbKtMY37sdsv&index=5
// ref: https://www.youtube.com/watch?v=Wvy_njVn7x8&list=PLYxzS__5yYQmr3HQQJMPBMbKtMY37sdsv&index=7
// ref: https://www.youtube.com/watch?v=V4UoZvb-YW8&list=PLYxzS__5yYQmr3HQQJMPBMbKtMY37sdsv&index=9
// ref: https://stackoverflow.com/questions/21509045/mongodb-group-by-array-inner-elements
export async function getLeaderboardOfSport(sportName: string, limit: number): Promise<{_id: string, numberOfWins: number}[]> {
    try {

        //validate limit
        if (isNaN(limit) || limit < 1) {
            throw new Error("invalid limit");
        }

        //populate the leaderboard
        const leaderboard = await MatchModel.aggregate([
            { $match: { "sport": sportName } },
            { $unwind: "$teams" },
            { $match: { "teams.status": "WIN" } },
            { $unwind: "$teams.members" },
            { $group: {
                "_id": "$teams.members",
                "numberOfWins": { $sum: 1 } }
            },
            { $sort: { "numberOfWins": -1 } },
            { $limit: limit },
        ], { allowDiskUse: true });

        return leaderboard;
    } catch(error: any) {
        throw new Error("error getting leaderboard", { cause: error });
    }
}

/**
 * remove a match by id from database
 * @param {string} matchId - id of match to delete
 * @throws {Error} - if match deletion fails
 */
export async function deleteMatch(matchId: string) {
    try {
        await MatchModel.findByIdAndDelete(matchId);
    } catch(error: any) {
        throw new Error("error deleting match", { cause: error });
    }
}