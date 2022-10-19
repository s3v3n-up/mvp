import { NextApiRequest, NextApiResponse } from "next";
import { Sport } from "@/lib/types/Sport";
import { createSport } from "@/lib/actions/sport";
import { object, string, array, number, date } from "yup";


/**
 * @description = a function that handles api request for creating a match
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {

            let { name, gameModes, records } = req.body as Sport;

            const schema = object(
                {
                    name: string().required(),
                    gameModes: array(object()),
                    records: array(object())
                }
            );

            const validatedSport = await schema.validate(req.body);

            const sport = {
                name, gameModes, records
            };

            const response = await createSport(sport);

            res.status(response.code).json(
                {
                    message: response.message
                }
            );

        } catch (error: any) {
            const { code = 500, message } = error;
            res.status(code).json({
                message
            }
            );

            return;
        }
    }
}