import { increaseMatchScoreOfTeam, decreaseMatchScoreOfTeam, getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

/**
 * Route for updating the score of a team in a match
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {

            // Initialize connection to the database
            await Database.setup();

            // Deconstructruct id from query request
            const { id } = req.query;
            if (typeof id !== "string") {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            // Deconstruct values to be from the client side
            const { teamIndex, operation } = req.body;

            //validate teamIndex and match score
            if (isNaN(parseInt(teamIndex)) || teamIndex < 0 || teamIndex > 1 || operation !== "increase" && operation !== "decrease") {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //get match by id
            const match = await getMatchById(id as string);

            //get user session
            const session = await unstable_getServerSession(req, res, authOptions);

            //guard route against unauthorized access
            if (!session || session.user.id !== match.matchHost) {
                throw {
                    code: 401,
                    message: "unauthorized"
                };
            }

            //update match score based on operation
            if (operation === "increase") {
                await increaseMatchScoreOfTeam(id as string, teamIndex);
            }

            if (operation === "decrease") {
                await decreaseMatchScoreOfTeam(id as string, teamIndex);
            }

            // Then return updateMatch as a json response
            res.status(200).json({ message: `Match score of team ${teamIndex} ${operation}ed` });
        } else {
            throw {
                code: 405,
                message: "method not allowed"
            };
        }
    } catch (err: any) {
        res.status(err.code || 500).json({
            message: err.message + "cause" + (err.cause??"undefined") || "Internal Server Error",
        });
    }
}