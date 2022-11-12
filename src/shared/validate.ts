// Third party imports
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ObjectShape, OptionalObjectSchema } from "yup/lib/object";

// https://www.youtube.com/watch?v=ZG7sLbI8kL8&t=710s
/**
 * @description Function that validates the req.body using the yup validation
 * @param {OptionalObjectSchema<ObjectShape>} schema the schema that needs to be checked
 * @param {NextApiHandler} handler the api endpoint
 */
export function validate(schema: OptionalObjectSchema<ObjectShape>, handler: NextApiHandler) {
    return async function (req: NextApiRequest, res: NextApiResponse) {

        // Checks the req.method if its a PUT or a POST
        if(["POST", "PUT"].includes(req.method as string)) {
            try {
                const newSchema = schema;
                req.body = await newSchema.validate(req.body, { stripUnknown: true });
                await handler(req, res);

            // Catches and sends the error and code
            } catch(error: any) {
                const { code = 500, message } = error;
                res.status(code).json({
                    message,
                });
            }
        }
    };
}