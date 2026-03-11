// middleware/upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 1. Configure Cloudinary (Pulls from your .env)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. The Dynamic Folder Switch
// If on EC2, use 'users'. If on local Arch/Docker, use 'dev_users'.
const folderName = process.env.NODE_ENV === 'production' ? 'users' : 'dev_users';

// 3. Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName, 
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
});

// 4. File Filter (Security precaution)
const fileFilter = (req, file, cb) => {
    console.log("MIME TYPE:", file.mimetype);
    console.log("ORIGINAL NAME:", file.originalname);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

// 5. Initialize Multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit max
    }
});

export default upload;