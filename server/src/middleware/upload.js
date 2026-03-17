import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const folderName = process.env.NODE_ENV === 'production' ? 'users' : 'dev_users';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName, 
        format: 'webp', 
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    },
});

const fileFilter = (req, file, cb) => {
    console.log("MIME TYPE:", file.mimetype);
    console.log("ORIGINAL NAME:", file.originalname);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 
    }
});

export default upload;