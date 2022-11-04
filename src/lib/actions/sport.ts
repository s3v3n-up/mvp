//local-import
import SportModel from "../resources/models/Sport";
import Database from "../resources/database";

/**
 * @description this is a function that gets all sports from the sport models
 */
export async function getAllSports() {
    try {

        //sets up database connection
        await Database.setup();

        //queries all sports and store to existing sports
        const existingSports = await SportModel.find({});

        //returns all existing sports
        return existingSports;

        //catches and throws an error
    } catch(error: any) {
        throw new Error("Error retrieving sports");
    }
}