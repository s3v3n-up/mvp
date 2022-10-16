import { Match } from '@/lib/types/Match'
// import Database from  '@/lib/resources/database'
import MatchModel from '../resources/models/Match'

import Database from '@/lib/resources/database'

/**
 * @description = a function that creates user and save to the database
 * @param user = accepts a user object
 * @returns = returns a code and a message if successful user creation or user already taken 
 */
export async function createMatch(match: Match) {
    await Database.setup()    

    // Creates a Match Model
	const playerMatch = new MatchModel<Match>(match)

    // Saves the UserModel in the database
    await playerMatch.save()

    // Returns a code and message for successful creation of match
    return {
        code: 200,
        message: "Match successfully created"
    }

   
}