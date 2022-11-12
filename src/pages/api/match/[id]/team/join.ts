import { joinMatch } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { APIErr } from "@/lib/types/General";

/**
 * api route for user to join a match.
 * Add user to a match, will check(if team full) and compare both teams to add user to the team with less members.
 * only userName is required from request
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {

            // Deconstructruct id from query request
            const { id } = req.query;

            // Deconstruct values client sent
            const { userName } = req.body;

            //validate match id and username
            if (typeof id !== "string" || typeof userName!== "string") {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //guard route against unauthorized access
            const session = await unstable_getServerSession(req, res, authOptions);
            if (!session || session.user.userName !== userName) {
                throw {
                    code: 401,
                    message: "unauthorized"
                };
            }

            // Initialize connection to the database
            await Database.setup();

            //update match score based on operation
            await joinMatch(id as string, userName);

            // Return a success message
            res.status(200).json(
                {
                    message: "success"
                }
            );
        }
    } catch(error) {
        const {
            code = 500,
            message="internal server error",
            cause="internal error"
        } = error as APIErr;
        res.status(code).json(
            {
                code,
                message,
                cause
            }
        );
    }
}