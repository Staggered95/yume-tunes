import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Use your exact absolute path
const bannerDir = '/home/Shubham/YumeTunes/public/images/banners';

// Ensure directory exists
if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, bannerDir),
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(4).toString('hex');
        cb(null, `banner-${hash}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed for banners!'), false);
    }
};

const bannerUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for high-res banners
});

export default bannerUpload;