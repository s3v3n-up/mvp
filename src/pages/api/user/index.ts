import { NextApiRequest, NextApiResponse } from "next";
import { getUsersByUserName } from "@/lib/actions/user";
import { APIErr } from "@/lib/types/General";

/**
 * api route for getting users by usernames
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { usernames } = req.query;

        //guard against invalid usernames
        if (typeof usernames !== "string") {
            throw {
                code: 400,
                message: "invalid username"
            };
        }

        //get all users with username that in the usernames query
        const users = await getUsersByUserName(usernames.split(","));
        res.status(200).json(users);
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