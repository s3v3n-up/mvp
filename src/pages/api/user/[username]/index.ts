// Imports NextApiRequest and NextApiResponse from next
import { NextApiRequest, NextApiResponse } from "next";
// Imports Database
import Database from "@/lib/resources/database";
// Imports calculateStats, findUserByUsername and updateUser functions
import { calculateStats, findUserByUsername, updateUser } from "@/lib/actions/user";
// Imports object and string type from yup
import { object, string } from "yup";
// Imports PHONE_REGEX
import { PHONE_REGEX } from "@/lib/resources/constants";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Sets up the Database connection
        await Database.setup();
        // Gets the username in the req.query
        const { username } = req.query;
        // Checks if the method is GET
        if (req.method === "GET") {
            // Stores and looks for a specific username
            const user = await findUserByUsername(username as string);
            
            // Gets the username of the user
            const { userName } = user[0];

            // Store and calculate the stats (win/lose/draw) of the user
            const stats = await calculateStats(userName);

            // return user and stats;
            res.status(200).json({
                user,
                stats
            })

            // Checks if the method is PUT
        } else if (req.method === "PUT") {
            // Gets the firstName, lastName, phonenumber and image
            let { firstName, lastName, phonenumber, image } = req.body;

            // Yup validation criteria
            const schema = object({
                firstName: string().required().min(2).max(64),
                lastName: string().required().min(2).max(64),
                phonenumber: string()
                    .required()
                    .matches(PHONE_REGEX, "invalid input for phone number"),
                image: string().required(),
            });
            // Checks if it passes the yup validation
            await schema.validate(req.body);

            // Converts first letter of the firstname to capital and the rest is lowercase
            firstName = firstName.charAt(0) + firstName.substring(1).toLowerCase();
            // Converts first letter of the lastname to capital and the rest is lowercase
            lastName = lastName.charAt(0) + lastName.substring(1).toLowerCase();
            // Stores the updated user
            const updatedUser = await updateUser(username as string, firstName, lastName, phonenumber, image);
            // Returns code 200 and the updated user
            res.status(200).json({
                updatedUser
            });
        }
        // Catches and throws error
    } catch (error: any) {
        throw new Error("Failed searching for user",error);
    }
}