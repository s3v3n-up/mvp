import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { uploadFile } from '@/lib/actions/File';

const upload = multer(
    {
        storage: multer.diskStorage(
            {
                destination: '/tmp',
                filename(req, file, callback) {
                    // you can replace Date.now() with UUID or NanoID
                    callback(null, `${ Date.now() }.${ file.mimetype.substring(6) }`);
                }
            }
        )
    }
);

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

type NextApiRequestWithFiles = NextApiRequest & {
    // Multer file type found in the Express namespace
    files: Express.Multer.File[];
};

handler.use(
    upload.array('files')
).post(
    async(req: NextApiRequestWithFiles, res: NextApiResponse) => {
        try {
            if (!req.files) {
                throw {
                    code: 400,
                    message: 'you must upload a file'
                };
            }

            if (req.files.length !== 1) {
                throw {
                    code: 400,
                    message: 'you can only upload one file'
                };
            }
            const file = req.files[0];
            const { path } = file;
            const { url } = await uploadFile(path);

            res.status(200).json(
                {
                    status: 200,
                    data: {
                        url
                    }
                }
            );
        } catch(error: any) {
            const { code = 500, message = 'unknown error occured' } = error;
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