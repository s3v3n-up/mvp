import MatchModel from "../resources/models/Match";
import type { Match } from "@/lib/types/Match";

/**
 * add a new match to the database
 * @param {Match} match new match data
 * @returns {Promise<Match>} cursor to new match
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
 * find match by _id
 * @param {string} id of match to find
 * @returns {Promise<Match>} cursor of match doc with matching id
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
 * update score of a match by id
 * @param {string} matchId - id of match to update
 * @param {number} teamAScore - first team score
 * @param {number} teamBScore - second team score
 * @returns updated match
 * @throws {Error} if score are not valid
 * @throws {Error} if match update fails
 */
export async function updateMatchScore(matchId: string, teamAScore: number, teamBScore: number): Promise<Match> {
    try {

        //validate match score
        if (teamAScore < 0 || teamBScore < 0) {
            throw new Error("invalid score");
        }

        //update match score
        const updatedMatch = await getMatchById(matchId) as any;
        updatedMatch.teamA.score = teamAScore;
        updatedMatch.teamB.score = teamBScore;
        await updatedMatch.save();

        //return updated match
        return updatedMatch as Match;
    } catch(error: any) {
        throw new Error("error updating match score", { cause: error });
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

/**
 * Edit/Update match details
 * @param {string} matchid - id of match to edit/update
 * @param {object} location - address/location where the match is being held
 * @param {string} matchStart - date and time of the match
 * @param {string} description - additional details or description of the match
 * @returns updated match details
 */

export async function updateMatch(matchid: string, location: object, matchStart: Date, description: string) {

    const matchFound = await MatchModel.findOneAndUpdate({ _id: matchid }, {
        location,
        matchStart,
        description
    }, {
        new: true
    });

	 // Returns the update match details
	 return matchFound;

}