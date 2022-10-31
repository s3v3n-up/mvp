import { getLeaderboardOfSport } from "@/backend/actions/match";
import Database from "@/backend/resources/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    //guard against non GET requests
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
    } else {
        const { sportname } = req.query;

        //guard against invalid and missing sportname
        if (typeof sportname !== "string" || !sportname) {
            res.status(400).json({ message: "Bad request" });
        }

        //setup database connection
        await Database.setup();

        //get leaderboard of sport base on wins
        const leaderboard = await getLeaderboardOfSport(sportname as string, 30);
        res.status(200).json(leaderboard);
    }
}