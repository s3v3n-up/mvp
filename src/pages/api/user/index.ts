import { NextApiRequest, NextApiResponse } from "next";
import { getUsersByUserName } from "@/lib/actions/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { usernames } = req.query;
        console.log(usernames);
        res.status(200).json(usernames);
    } else {
        res.status(405).json({ message: "method not allowed" });
    }
}