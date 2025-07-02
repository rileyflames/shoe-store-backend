import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from 'multer-storage-cloudinary'


// Configure Cloudinary with
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})
// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'shoe-store', // folder name in Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation : [{width: 800, height: 800, crop: 'limit'}]
    }
})

const upload = multer({storage})

export default upload 