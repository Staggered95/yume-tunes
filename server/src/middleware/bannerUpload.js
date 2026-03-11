// middleware/bannerUpload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 1. Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. The Dynamic Folder Switch
// EC2 gets 'banners', Local Arch/Docker gets 'dev_banners'
const folderName = process.env.NODE_ENV === 'production' ? 'banners' : 'dev_banners';

// 3. Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName, 
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
});

// 4. File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed for banners!'), false);
    }
};

// 5. Initialize Multer
const bannerUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default bannerUpload;