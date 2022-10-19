import Database from "@/lib/resources/database";
import seedAll from "@/seed";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const adminAPIKey = req.headers.admin_api_key;
    if (!adminAPIKey || adminAPIKey !== process.env.ADMIN_API_KEY) {
        res.status(401).send('BAD');
        return;
    }
    await Database.setup();
    await seedAll();

    res.status(200).send('Good');
}