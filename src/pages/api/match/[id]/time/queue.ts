import { NextApiRequest, NextApiResponse } from "next/types";
import Database from "@/lib/resources/database";
import { updateMatchQueueStartTime } from "@/lib/actions/match";

//function to update the start time of a match in the queue
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
            const { queueStartTime } = req.body;

            //validate matchQueueStartTime
            if (isNaN(Date.parse(queueStartTime)) && queueStartTime !== null) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update matchQueueStartTime
            await updateMatchQueueStartTime(id as string, !isNaN(Date.parse(queueStartTime)) ? new Date(queueStartTime) : null);
            res.status(200).json({ message: "Match queue start time updated" });
        }
    } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message || "Internal Server Error", cause: error.cause });
    }
}