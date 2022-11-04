import { NextApiRequest, NextApiResponse } from "next";
import { getUsersByUserName } from "@/lib/actions/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { usernames } = req.query;

        if (typeof usernames !== "string") {
            throw {
                code: 400,
                message: "invalid username"
            };
        }

        const users = await getUsersByUserName(usernames.split(","));
        res.status(200).json(users);
    } catch (error: any) {
        const { code = 500, message = "internal server error" } = error;
        res.status(code).json({ message: message });
    }
}