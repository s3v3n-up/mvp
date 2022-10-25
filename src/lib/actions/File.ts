// import cloudinary
import cloudinary from "@/lib/resources/cloudinary";

// Get the uploader in the cloudinary
const { uploader } = cloudinary;

/**
 * @description function that handles file to be uploaded in the cloudinary
 * @params accepts a string which is the path of the file
 */
export async function uploadFile(path: string) {
    try {

        // Stores the filename
        const response = await uploader.upload(path,
            {
                // eslint-disable-next-line camelcase
                unique_filename: true
            });

        // If there is no file then throws an error
        if (!response) {
            throw new Error("upload to cloudinary failed");
        }

        // returns the filename
        return response;

        // Catches and throw the error
    } catch(error: any) {
        throw new Error("Error uploading file", error);
    }
}