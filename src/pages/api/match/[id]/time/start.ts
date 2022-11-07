import { NextApiRequest, NextApiResponse } from "next/types";
import Database from "@/lib/resources/database";
import { updateMatchStartTime } from "@/lib/actions/match";
import { Match } from "@/lib/types/Match";

//function to update the start time of the match 
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
            const { startTime } = req.body;

            //validate matchStartTime
            if (isNaN(Date.parse(startTime)) && startTime !== null) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update matchStartTime
            await updateMatchStartTime(id as string, !isNaN(Date.parse(startTime)) ? new Date(startTime) : null);

            res.status(200).json({ message: "Match start time updated" });
        }
    } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message || "Internal Server Error", cause: error.cause });
    }
}