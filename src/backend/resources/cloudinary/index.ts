/* eslint-disable camelcase */
// import latest version of cloudinary as cloudinary
import { v2 as cloudinary } from "cloudinary";

// configure cloudinary using env variables
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

// export cloudinary after configuration
export default cloudinary;