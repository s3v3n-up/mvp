import cloudinary from '@/lib/resources/cloudinary';

const { uploader } = cloudinary;

export async function uploadFile(path: string) {
    console.log("Before Response")
    console.log("Path", path)
    try {
        const response = await uploader.upload(
            path,
            {
                unique_filename: true
            }
        );
    } catch(e) {
        console.log(e)
    }
    console.log("After Reponse", response)

    if (!response) {
        throw {
            code: 500,
            message: `failed to upload file with path: ${ path }`
        };
    }

    return {
        filename: response.public_id
    };
}