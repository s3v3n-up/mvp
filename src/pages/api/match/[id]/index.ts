// Third-party imports
import { NextApiRequest, NextApiResponse } from "next";

// Local imports
import Database from "@/lib/resources/database";
import { getMatchById, updateMatch } from "@/lib/actions/match";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        // Initialize connection to the database
        await Database.setup();

        // Deconstructruct id from query request
        const { id } = req.query;

        // If the HTTP method is GET
        if (req.method === "GET") {

            // Then use the id above as parameter of getMatchById action then insert into a variable
            const match = await getMatchById(id as string);

            // Return match as json
            res.status(200).json({
                match,
            });

            // If the HTTP method is POST
        } else if (req.method === "PUT") {

            // Deconstruct values to be from the client side
            const { location, matchStart, description } = req.body;

            // Call upon the updateMatch action and update the existing match model based on the id
            const updatedMatch = await updateMatch(id as string, {
                location,
                matchStart,
                description,
                matchHost: "",
                sport: "",
                gameMode: "",
                matchType: "REGULAR",
                matchEnd: new Date(Date.now()),
                teams: [
                    { members: [""], score: 0, status: "UNFINISHED" },
                    { members: [""], score: 0, status: "UNFINISHED" },
                ],
            });

            // Then return updateMatch as a json response
            res.status(200).json({
                updatedMatch,
            });
        }

        // Catches a specific error when there is no match for the id set
    } catch (error: any) {
        throw new Error("Failed searching for match", error);
    }
}
