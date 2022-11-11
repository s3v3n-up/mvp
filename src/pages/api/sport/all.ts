//third-part imports
import { NextApiRequest, NextApiResponse } from "next";

//local imports
import { getAllSports } from "@/lib/actions/sport";

/**
 * @description this a function that handles api request for getting all sports
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // If the HTTP method is GET
    if (req.method === "GET") {
        try {

            //call the getAllSports function
            const response = await getAllSports();

            //returns the response as json
            res.status(200).json(
                {
                    response
                }
            );

            //catches and throws a status code and error message
        } catch (error: any) {

            const { code = 500, message } = error;

            res.status(code).json(
                {
                    message
                }
            );

            return;
        }
    }
}