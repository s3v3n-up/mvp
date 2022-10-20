import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { uploadFile } from "@/lib/actions/File";

/**
 * @description saves the file locally
 */
const upload = multer(
    {
        storage: multer.diskStorage(
            {
                destination: "/tmp",
                filename(req, file, callback) {
                    callback(null, `${ Date.now() }.${ file.mimetype.substring(6) }`);
                }
            }
        )
    }
);

/**
 * @description Check if the method is supported
 */
const handler = nextConnect(
    {
        onNoMatch(req: NextApiRequest, res: NextApiResponse) {
            res.status(405).json(
                {
                    error: `method: ${ req.method } is not allowed`
                }
            );
        }
    }
);

// Multer file type found in the Express namespace
type NextApiRequestWithFiles = NextApiRequest & {
    files: Express.Multer.File[];
};

/**
 * @description Handles the uploading of the file into the cloudinary
 */
handler.use(
    upload.array("files")
).post(
    async(req: NextApiRequestWithFiles, res: NextApiResponse) => {
        try {
            // Checks if there is no file to be uploaded
            if (!req.files) {
                throw {
                    code: 400,
                    message: "you must upload a file"
                };
            }

            // Checks if there is only 1 file
            if (req.files.length !== 1) {
                throw {
                    code: 400,
                    message: "you can only upload one file"
                };
            }
            // Gets the first file
            const file = req.files[0];
            // Gets the path of the file
            const { path } = file;
            // Gets the url of the file to be uploaded
            const { url } = await uploadFile(path);

            // Sends back status and the url
            res.status(200).json(
                {
                    status: 200,
                    data: {
                        url
                    }
                }
            );
            // Catches error and throw the error message and code
        } catch(error: any) {
            const { code = 500, message = "unknown error occured" } = error;
            res.status(code).json(
                {
                    status: code,
                    data: {
                        message
                    }
                }
            );
        }
    }
);

export const config = {
    api: {
        // disable body parsing consume as a stream
        bodyParser: false
    }
};

// export the handling of the endpoint!
export default handler;