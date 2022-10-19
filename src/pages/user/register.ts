import { NextApiRequest, NextApiResponse } from "next";
import { UserProfile } from "@/lib/types/User";
import { createUser } from "@/lib/actions/user";
import { PHONE_REGEX, EMAIL_REGEX } from "@/lib/resources/constants";
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
                phonenumber,
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
            const validatedUser = await schema.validate(req.body);

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
                phonenumber,
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
