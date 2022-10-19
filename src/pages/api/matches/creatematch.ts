import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "@/lib/types/Match";
import { createMatch } from "@/lib/actions/match";
import { insertMatch } from "@/lib/actions/user";
import { object, string, array, number, date } from "yup";
import Database from "@/lib/resources/database";



/**
 * @description = a function that handles api request for creating a match
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {

            let { matchHost, sport, gameMode, matchType, location, matchStart, matchEnd, description, teamA, teamB } = req.body as Match;



            const schema = object(
                {
                    matchHost: string().required(),
                    sport: string().required(),
                    gameMode: string().required(),
                    matchType: string().required(),
                    location: object().required(),
                    matchStart: date(),
                    matchEnd: date(),
                    description: string().required(),
                    teamA: object().required(),
                    teamB: object()
                }
            );

            const validatedMatch = await schema.validate(req.body);

            const match = {
                matchHost, sport, gameMode, matchType, location, matchStart, matchEnd, description, teamA, teamB
            };
            await Database.setup();
            const response = await createMatch(match);
            console.log("Response:", response);
            let id = response.id as string;
            console.log("ID: ", id)
            await insertMatch(matchHost, id);

            res.status(200).json(
                {
                    response
                }
            );

        } catch (error: any) {
            const { code = 500, message } = error;
            res.status(code).json({
                message
            }
            );

            return;
        }
    }
}