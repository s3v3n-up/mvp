import { NextApiRequest, NextApiResponse } from "next/types";
import Database from "@/lib/resources/database";
import { updateMatchStatus, getMatchById } from "@/lib/actions/match";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

//function to update the status of the match
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {

            //guard against unauthorized access
            const session = await unstable_getServerSession(req, res, authOptions);
            if (!session) {
                throw {
                    code: 401,
                    message: "unauthorized"
                };
            }

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

            //get match by id
            const match = await getMatchById(id);

            // Deconstruct values to be from the client side
            const { status } = req.body;

            // Check if the status is valid
            const availableStatus = ["UPCOMING", "INPROGRESS", "FINISHED", "CANCELLED", "PAUSED"];
            if (!availableStatus.includes(status)) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //guard against unauthorized access to finish and cancel, pause
            if (status === "FINISHED" || status === "CANCELLED" || status === "PAUSED") {
                if (session.user.id !== match.matchHost) {
                    throw {
                        code: 403,
                        message: "access denied"
                    };
                }
            }

            //guard against unauthorized access to resume match
            if (status === "INPROGRESS" && match.status === "PAUSED") {
                if (session?.user.id !== match.matchHost) {
                    throw {
                        code: 403,
                        message: "access denied"
                    };
                }
            }

            //update matchStatus
            await updateMatchStatus(id as string, status);
            res.status(200).json({ message: "Match status updated" });
        }
    } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message || "Internal Server Error", cause: error.cause });
    }
}