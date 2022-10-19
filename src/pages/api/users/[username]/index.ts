import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
import { calculateWin, findUserByUsername, updateUser } from "@/lib/actions/user";
import { UserProfile } from "@/lib/types/User";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await Database.setup();
        const { username } = req.query;
        if (req.method === "GET") {


            console.log(username);
            const user = await findUserByUsername(username as string);
            console.log(user);

            const { userName } = user[0];

            const stats = await calculateWin(userName);

            console.log(stats);

            // return user;
            res.status(200).json({
                user,
                stats
            });
        } else if (req.method === "PUT") {
            const { firstName, lastName, phonenumber, image } = req.body;
            const updatedUser = await updateUser(username as string, firstName, lastName, phonenumber, image);
            res.status(200).json({
                updatedUser
            });
        }
    } catch (error: any) {
        throw new Error("Failed searching for user",error);
    }
}