import { getMatchById, addMemberToTeam, removeMemberFromTeam } from "@/lib/actions/match";
import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { APIErr } from "@/lib/types/General";

/**
 * api router for add/remove a member to/from a team.
 * teamIndex and userName are required from request
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { id } = req.query;
            const { teamIndex, operation, userName } = req.body;

            //guard route against invalid inputs
            if (isNaN(parseInt(teamIndex)) ||
                parseInt(teamIndex) < 0 ||
                parseInt(teamIndex) > 1 ||
                operation !== "add" && operation !== "remove" ||
                typeof userName !== "string") {
                throw {
                    code: 400,
                    message: "bad request",
                    cause: "invalid inputs"
                };
            }

            //guard route against unauthorized access
            const session = await unstable_getServerSession(req, res, authOptions);

            if (!session || session.user.userName !== userName) {
                throw {
                    code: 401,
                    message: "unauthorized",
                    cause: "login first"
                };
            }

            //initialize connection to the database
            await Database.setup();

            //perform add/remove member based on operation
            if (operation === "add") {
                await addMemberToTeam(id as string, teamIndex, userName);
            }

            if (operation === "remove") {
                await removeMemberFromTeam(id as string, teamIndex, userName);
            }

            //update match team members
            res.status(200).json(
                {
                    message: `successfully ${operation}ed ${userName} to team`
                }
            );
        } else {
            throw {
                code: 405,
                message: "method not allowed"
            };
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