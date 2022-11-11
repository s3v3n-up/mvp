import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
import { calculateStats } from "@/lib/actions/user";

/**
 * api route for getting user stats
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { username } = req.query;

        //validates the username
        if (typeof username !== "string" || username.length < 8 || username.length > 30) {
            throw {
                code: 400,
                message: "invalid username"
            };
        }
        await Database.setup();
        const stats = await calculateStats(username);
        res.status(200).json(stats);
    } catch (error: any) {
        const { code = 500, message = "internal server error" } = error;
        res.status(code).json(
            {
                message: message
            }
        );
    }
}