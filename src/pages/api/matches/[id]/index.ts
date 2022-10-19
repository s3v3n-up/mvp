import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
import { getMatchById, updateMatch } from "@/lib/actions/match";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await Database.setup();
        const { id } = req.query;
        if (req.method === "GET") {


            console.log(id);
            const match = await getMatchById(id as string);
            console.log(match);

            // return match;
            res.status(200).json({
                match
            });
        } else if (req.method === "PUT") {
            const { location, matchStart, description } = req.body;
            const updatedMatch = await updateMatch(id as string, location, matchStart, description);
            res.status(200).json({
                updatedMatch
            });
        }
    } catch (error: any) {
        throw new Error("Failed searching for match",error);
    }
}