// Imports NextApiRequest and NextApiResponse from next
import { NextApiRequest, NextApiResponse } from "next";

// Imports Database
import Database from "@/lib/resources/database";

// Imports calculateStats, findUserByUsername and updateUser functions
import { getUserByUserName, updateUser } from "@/lib/actions/user";

// Imports object and string type from yup
import { object, string } from "yup";

// Imports PHONE_REGEX
import { PHONE_REGEX } from "@/lib/helpers/validation";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        // Sets up the Database connection
        await Database.setup();

        // Gets the username in the req.query
        const { username } = req.query;

        //validates the username
        if (typeof username !== "string" || username.length < 8 || username.length > 30) {
            throw new Error("invalid username");
        }

        // Checks if the method is GET
        if (req.method === "GET") {
            await Database.setup();
            const user = await getUserByUserName(username);
            res.status(200).json(user);

            // Checks if the method is PUT
        } else if (req.method === "PUT") {

            // Gets the firstName, lastName, phonenumber and image
            const { firstName, lastName, phonenumber, image } = req.body;

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
            // Stores the updated user
            const updatedUser = await updateUser(
                username as string,
                firstName.charAt(0) + firstName.substring(1).toLowerCase(),
                lastName.charAt(0) + lastName.substring(1).toLowerCase(),
                phonenumber,
                image
            );

            // Returns code 200 and the updated user
            res.status(200).json({
                updatedUser,
            });
        }

        // Catches and sends response status 400 and error
    } catch (error: any) {
        res.status(400).json({
            message: "Bad Request",
            error
        });
    }
}

