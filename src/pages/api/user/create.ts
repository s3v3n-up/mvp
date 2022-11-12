// Imports NextApiRequest and NextApiResponse from next
import { NextApiRequest, NextApiResponse } from "next";

// Imports UserProfile interface
import { UserProfile } from "@/lib/types/User";

// Imports createUser function
import { createUser } from "@/lib/actions/user";

// Imports object and string types from yup
import { object, string } from "yup";
import { validate } from "@/shared/validate";
import { userSchema } from "@/shared/schema";
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
                res.status(200).json({
                    response,
                    method: req.method
                });

            // Catches error and throw code and message
            } catch (error: any) {
                if (error.cause.code === "11000") {
                    throw {
                        code: 400,
                        message: error.message,
                    };
                }
                throw error;
            }

        //Catches any error and throws it in message
        } catch (error: any) {
            const { code = 500, message } = error;
            res.status(code).json({
                code,
                message
            });

            return;
        }
    }
}

// Validates before exporting
export default validate(userSchema, handler);
