import { getLeaderboardOfSport } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
import { APIErr } from "@/lib/types/General";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    //guard against non GET requests
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
    } else {
        const { sportname, limit } = req.query;

        //validate the query parameters
        if(!sportname || !limit || typeof sportname !== "string" || typeof limit !== "string") {
            res.status(400).json(
                {
                    message: "Bad request"
                }
            );
        }

        //validate the limit
        if(isNaN(Number(limit))) {
            res.status(400).json(
                {
                    message: "Invalid limit"
                }
            );
        }

        //get the leaderboard from the database
        try {
            await Database.setup();
            const leaderboard = await getLeaderboardOfSport(sportname as string, Number(limit));
            res.status(200).json(leaderboard);
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
}