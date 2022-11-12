// Local imports
import { UserProfile } from "@/lib/types/User";
import { createUser } from "@/lib/actions/user";
import { APIErr } from "@/lib/types/General";

// Third party imports
import { validate } from "@/shared/validate";
import { userSchema } from "@/shared/schema";
import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";


/**
 * @description = a function that handles api request for registering user
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (req.method === "POST") {
        try {

            // Checks if there is no session and throw code 401 and message
            if(!session) {
                throw{
                    code: 401,
                    message: "Unauthorized request"
                };
            }

            // Deconstruct body to get individual properties to be used for validation
            let {
                userName,
                firstName,
                lastName,
                phoneNumber,
                image,
                email,
                matches,
            } = req.body as UserProfile;

            // Converts username to lowercase for uniformity
            userName = userName.toLowerCase();

            // Converts email to lowercase for uniformity
            email = email.toLowerCase();

            // Converts first letter of the firstname to capital and the rest is lowercase
            firstName = firstName.charAt(0) + firstName.substring(1).toLowerCase();

            // Converts first letter of the lastname to capital and the rest is lowercase
            lastName = lastName.charAt(0) + lastName.substring(1).toLowerCase();

            // Define user object to be created in the database
            const user = {
                userName,
                email,
                firstName,
                lastName,
                phoneNumber,
                image,
                matches,
            };

            try {

                // Stores the created user into the response
                const response = await createUser(user);

                // Returns the code and the user created
                res.status(200).json(
                    {
                        response,
                        method: req.method
                    }
                );

            //Catches any error and throws code, message and cause
            } catch (error) {
                const { code = 400, message, cause } = error as APIErr;
                throw {
                    code,
                    message,
                    cause
                };
            }

        //Catches any error and throws code, message and cause
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

            return;
        }
    }
}

// Validates before exporting
export default validate(userSchema, handler);
