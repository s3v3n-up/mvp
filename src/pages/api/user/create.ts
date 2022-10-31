// Imports NextApiRequest and NextApiResponse from next
import { NextApiRequest, NextApiResponse } from "next";

// Imports UserProfile interface
import { UserProfile } from "@/types/User";

// Imports createUser function
import { createUser } from "@/backend/actions/user";

// Imports PHONE_REGEX and EMAIL_REGEX
import { PHONE_REGEX, EMAIL_REGEX } from "@/helpers/validation";

// Imports object and string types from yup
import { object, string } from "yup";

/**
 * @description = a function that handles api request for registering user
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {

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

            // Yup validation criteria
            const schema = object({
                userName: string().required().min(8).max(30),
                firstName: string().required().min(2).max(64),
                lastName: string().required().min(2).max(64),
                phonenumber: string()
                    .required()
                    .matches(PHONE_REGEX, "invalid input for phone number"),
                image: string().required(),
                email: string()
                    .required()
                    .matches(EMAIL_REGEX, "invalid input for email"),
            });

            // Checks if it passes the yup validation
            await schema.validate(req.body);

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

            // Stores the created user into the response
            const response = await createUser(user);

            // Returns the code and the user created
            res.status(response.code).json({
                response,
            });

            //Catches any error and throws it in message
        } catch (error: any) {
            const { code = 500, message } = error;
            res.status(code).json({
                message,
            });

            return;
        }
    }
}
