import cloudinary from '@/lib/resources/cloudinary';

const { uploader } = cloudinary;

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