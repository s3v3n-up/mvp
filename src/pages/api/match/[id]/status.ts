import { NextApiRequest, NextApiResponse } from "next/types";
import Database from "@/lib/resources/database";
import { updateMatchStatus } from "@/lib/actions/match";

//function to update the status of the match
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
            const { status } = req.body;

            //update matchStatus
            await updateMatchStatus(id as string, status);

            res.status(200).json({ message: "Match status updated" });
        }
    } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message || "Internal Server Error", cause: error.cause });
    }
}