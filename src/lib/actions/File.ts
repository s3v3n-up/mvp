// import cloudinary
import cloudinary from '@/lib/resources/cloudinary';

// Get the uploader in the cloudinary
const { uploader } = cloudinary;

/**
 * @description function that handles file to be uploaded in the cloudinary
 * @params accepts a string which is the path of the file
 */
export async function uploadFile(path: string) {
    try {
        const response = await uploader.upload(path,
            { 
                unique_filename: true 
            });
        if (!response) {
            throw new Error("upload to cloudinary failed")
        }
        return response;
    } catch(e) {
        throw e
    }
}