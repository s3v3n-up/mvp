//local imports
import { updateUser } from "@/lib/actions/user";
import Database from "@/lib/resources/database";
import { APIErr } from "@/lib/types/General";
import { firstNameSchema } from "@/shared/schema";

// third party imports
import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // https://next-auth.js.org/getting-started/client
    // Gets the session of the user
    const session = await unstable_getServerSession(req, res, authOptions);

    // Checks if there is no session and throw code 401 and message
    if(!session) {
        throw{
            code: 401,
            message: "Unauthorized request"
        };
    }

    // Gets the username and fieldname from the request.query
    const { username, fieldname } = req.query;


    //validates the username
    if (typeof username !== "string" || username.length < 8 || username.length > 30) {
        return res.status(401).json({
            message: "Unauthorized Request"
        });
    }

    try {

        // Checks if there is no session and throw code 401 and message
        if(req.method === "PUT") {

            //Checks if the session.user.userName is the same as the user requesting
            if(session.user.userName !== username) {
                return res.status(401).json({
                    message: "Unauthorized Request"
                });
            }

            // Check if the fieldname is firstName
            if(fieldname === "firstName") {

                // Get the firstName in request body
                const { firstName } = req.body;

                //Checks if firstName is Valid
                await firstNameSchema.validate({ firstName });

                // Sets up the Database connection
                await Database.setup();

                // Updates the users firstName
                const updatedUser = await updateUser({
                    firstName: firstName.charAt(0) + firstName.substring(1).toLowerCase() }
                , username as string);

                // Returns the updatedUser
                res.status(200).json(
                    {
                        updatedUser
                    });

            // Check if the fieldname is lastName
            } else if(fieldname === "lastName") {

                // Get the lastName in request body
                const { lastName } = req.body;

                //Checks if lastName is Valid
                await firstNameSchema.validate({ lastName });

                // Sets up the Database connection
                await Database.setup();

                // Updates the users lastName
                const updatedUser = await updateUser({
                    lastName: lastName.charAt(0) + lastName.substring(1).toLowerCase() }
                , username as string);

                // Returns the updatedUser
                res.status(200).json(
                    {
                        updatedUser
                    });

            // Check if the fieldname is phoneNumber
            } else if(fieldname === "phoneNumber") {

                // Get the phoneNumber in request body
                const { phoneNumber } = req.body;

                //Checks if phoneNumber is Valid
                await firstNameSchema.validate({ phoneNumber });

                // Sets up the Database connection
                await Database.setup();

                // Updates the users phoneNumber
                const updatedUser = await updateUser({
                    phoneNumber }
                , username as string);

                // Returns the updatedUser
                res.status(200).json(
                    {
                        updatedUser
                    });

            // Check if the fieldname is image
            } else if(fieldname === "image") {

                // Get the image in request body
                const { image } = req.body;

                // Sets up the Database connection
                await Database.setup();

                // Updates the users image
                const updatedUser = await updateUser({
                    image }
                , username as string);

                // Returns the updatedUser
                res.status(200).json(
                    {
                        updatedUser
                    });
            }
        }

    // Catches and sends code and error
    } catch(error: any) {
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