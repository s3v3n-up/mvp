// third-party imports
import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// local imports
import Database from "@/lib/resources/database";
import { getUserByUserName, updateUser } from "@/lib/actions/user";
import { validate } from "@/shared/validate";
import { userSchema } from "@/shared/schema";
import { APIErr } from "@/lib/types/General";

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
        }

    // Catches and sends code and error
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
    }
}

export default validate(userSchema, handler);