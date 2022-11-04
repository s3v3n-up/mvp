// Third-party imports
import { NextApiRequest, NextApiResponse } from "next";
import { object, string, date, array } from "yup";

// Local imports
import { Match } from "@/lib/types/Match";
import { createMatch } from "@/lib/actions/match";
import Database from "@/lib/resources/database";

/**
 * @description = a function that handles api request for creating a match
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {

            // Deconstruct request body to access values from the client
            let {
                matchHost,
                sport,
                gameMode,
                matchType,
                location,
                matchStart,
                matchEnd,
                description,
                teams,
            } = req.body as Match;

            // Yup validation custom rules
            const schema = object({
                matchHost: string().required(),
                sport: string().required(),
                gameMode: string().required(),
                matchType: string().required(),
                location: object().required(),
                matchStart: date(),
                matchEnd: date(),
                description: string().required(),
                teams: array().required(),
            });

            // Checks if the values from the request body are meeting the validation rules set.
            await schema.validate(req.body);

            // Inserting the values into an object variable
            const match: Match = {
                matchHost,
                sport,
                gameMode,
                matchType,
                location,
                matchStart,
                matchEnd,
                description,
                teams,
                status: "UPCOMING",
            };

            // Initialize connection to database
            await Database.setup();

            // Call upon the createMatch action to use the values above and create a match model
            const response = await createMatch(match);

            // Return the response as json
            res.status(200).json({
                response,
            });

            // Catch any errors caught above and send it back as json
        } catch (error: any) {
            const { code = 500, message } = error;
            res.status(code).json({
                message,
            });

            return;
        }
    }
}
