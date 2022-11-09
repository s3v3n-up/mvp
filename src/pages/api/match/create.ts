// Third-party imports
import { NextApiRequest, NextApiResponse } from "next";
import { object, string, date, array } from "yup";

// Local imports
import { Match } from "@/lib/types/Match";
import { createMatch, findUserActiveMatches } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import MatchModel from "@/lib/resources/models/Match";

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
                status,
            } = req.body as Match;

            // Yup validation custom rules
            const schema = object({
                matchHost: string().required(),
                sport: string().required(),
                gameMode: object().required(),
                matchType: string().required(),
                location: object(),
                matchStart: date().when("matchType", {
                    is: ((matchType: any) => matchType==="REGULAR"),
                    then: date().min(
                        new Date(Date.now() + 3600000),
                        "You cannot set a date or time less than 1 hour from now."),
                    otherwise: date().min(new Date(Date.now() - 60000), "You cannot set a date or time in the past")
                }),
                matchEnd: date(),
                description: string(),
                teams: array(),
                status: string().required(),
            });

            // Checks if the values from the request body are meeting the validation rules set.
            await schema.validate(req.body);

            // Initialize connection to database
            await Database.setup();

            // Checks if user is host to allow match creation
            const matches = await findUserActiveMatches(matchHost);

            // Variable that will store lapsed and active matches
            let lapsedMatches: Match[] = [];
            let activeMatches: Match[] = [];

            // Loops through all matches and look for UPCOMING and INPROGRESS matches
            matches.map(async (match: Match) => {
                if (Date.now() - match.matchStart!.getTime() > 3600000) {
                    lapsedMatches.push(match);
                } else {
                    activeMatches.push(match);
                }
            });

            // Checks if there is a lapsed match
            if (lapsedMatches.length > 0) {

                // Loops through lapsed matches and update the status to CANCELLED
                lapsedMatches.map(async (match: Match) => {
                    await MatchModel.updateOne(
                        { _id: match._id },
                        { $set: { status: "CANCELLED" } }
                    );
                });
            }

            // Checks if there are active matches and return an error if there is
            if (activeMatches.length > 0) {
                throw new Error("You already have an active match");
            }

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
                status,
                matchQueueStart: null,
                matchPause: null
            };

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
