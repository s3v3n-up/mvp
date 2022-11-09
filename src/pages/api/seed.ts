// Imports the Database
import Database from "@/lib/resources/database";

// Imports the function seedAll
import seedAll from "@/shared/seed";

// Imports NextApiRequest and NextApiResponse from next
import { NextApiRequest, NextApiResponse } from "next";

// Function That will handle request to create a sport
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Stores the admin_api_key
    const adminAPIKey = req.headers.admin_api_key;

    // Checks if there is a admin_api_key
    if (!adminAPIKey || adminAPIKey !== process.env.ADMIN_API_KEY) {

        // Returns Bad request
        res.status(401).send("BAD Request");

        return;
    }

    // Sets up the database connection
    await Database.setup();

    // Await the function to be executed
    await seedAll();

    // Return Success message
    res.status(200).send("Success");
}