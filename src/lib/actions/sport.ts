import { Sport } from '@/lib/types/Sport'
import SportModel from '../resources/models/Sport'

import Database from '@/lib/resources/database'

/**
 * @description = a function that creates user and save to the database
 * @param user = accepts a user object
 * @returns = returns a code and a message if successful user creation or user already taken 
 */
export async function createSport(sport: Sport) {
    await Database.setup()

    // Deconstruct username 
    const { name } = sport

    // Check if the sport already exist in the database
    const existingSport = await SportModel.findOne({ name })

    // If sport exist returns an error code and message
    if(existingSport) {
        return { 
            code: 400,
            message: "This sport already exists in the database"
        }
    }

    // Creates a SportModel
	const playerSport = new SportModel<Sport>(sport)

    // Saves the UserModel in the database
    await playerSport.save()

    // Returns a code and message for successful creation of user
    return {
        code: 200,
        message: "Sport successfully created"
    }

   
}
