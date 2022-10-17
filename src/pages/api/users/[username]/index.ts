import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
import { findUserByUsername, updateUser } from "@/lib/actions/user";
import { UserProfile } from "@/lib/types/User";
import { object, string } from "yup";
import { PHONE_REGEX } from "@/lib/resources/constants";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await Database.setup();
        const { username } = req.query;
        if (req.method === "GET") {


            console.log(username);
            const user = await findUserByUsername(username as string);
            console.log(user);

            // return user;
            res.status(200).json({
                user
            });
        } else if (req.method === "PUT") {
            let { firstName, lastName, phonenumber, image } = req.body;

            const schema = object({
                firstName: string().required().min(2).max(64),
                lastName: string().required().min(2).max(64),
                phonenumber: string()
                    .required()
                    .matches(PHONE_REGEX, "invalid input for phone number"),
                image: string().required(),
            });
            // Checks if it passes the yup validation
            const validatedUser = await schema.validate(req.body);

            // Converts first letter of the firstname to capital and the rest is lowercase
            firstName = firstName.charAt(0) + firstName.substring(1).toLowerCase();
            // Converts first letter of the lastname to capital and the rest is lowercase
            lastName = lastName.charAt(0) + lastName.substring(1).toLowerCase();
            const updatedUser = await updateUser(username as string, firstName, lastName, phonenumber, image);
            res.status(200).json({
                updatedUser
            });
        }
    } catch (error: any) {
        throw new Error("Failed searching for user",error);
    }
}