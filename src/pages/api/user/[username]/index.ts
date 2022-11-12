// third-party imports
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { object, string } from "yup";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";

// local imports
import Database from "@/lib/resources/database";
import { getUserByUserName, updateUser } from "@/lib/actions/user";

// import { PHONE_REGEX } from "@/lib/helpers/validation";
import { validate } from "@/shared/validate";
import { userSchema } from "@/shared/schema";
import { authOptions } from "../../auth/[...nextauth]";


/**
 * api route for updating and getting user by username
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // https://next-auth.js.org/getting-started/client
    // Gets the session of the user
    const session = await unstable_getServerSession(req, res, authOptions);

    // Gets the username in the req.query
    const { username } = req.query;
    try {

        // Checks if there is no session and throw code 401 and message
        if(!session) {
            throw{
                code: 401,
                message: "Unauthorized request"
            };
        }

        // Sets up the Database connection
        await Database.setup();

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

            if(session.user.userName !== username) {
                return res.status(401).json({
                    message: "Unauthorized Request"
                });
            }

            // Gets the firstName, lastName, phonenumber and image
            const { firstName, lastName, phoneNumber, image } = req.body;

            // Converts first letter of the firstname to capital and the rest is lowercase
            // Stores the updated user
            const updatedUser = await updateUser(
                username as string,
                firstName.charAt(0) + firstName.substring(1).toLowerCase(),
                lastName.charAt(0) + lastName.substring(1).toLowerCase(),
                phoneNumber,
                image
            );

            // Returns code 200 and the updated user
            res.status(200).json({
                updatedUser,
                method: req.method
            });
        }

    // Catches and sends response status 400 and error
    } catch (error: any) {
        const { code = 500,
            message = "Internal server error" } = error;
        res.status(code).json({
            message
        });
    }
}

export default validate(userSchema, handler);