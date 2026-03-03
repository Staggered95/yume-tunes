// middleware/upload.js
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';


// 1. Ensure the destination directory exists
const uploadDir = path.join('/home/Shubham/YumeTunes/public/images/users');
if (!fs.existsSync(uploadDir)) {
    // recursively create if missing
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure where and how to save the files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Drop it right into your required folder
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // We generate a secure random hex to prevent users from uploading
        // files with the same name and overwriting each other.
        const hash = crypto.randomBytes(8).toString('hex');
        
        // Example output: avatar-12345abcdef-167890123.jpg
        const filename = `${file.fieldname}-${hash}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

// 3. File Filter (Security precaution: Ensure they are actually images)
const fileFilter = (req, file, cb) => {
    console.log("MIME TYPE:", file.mimetype);
    console.log("ORIGINAL NAME:", file.originalname);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

// 4. Initialize Multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit max to save server space
    }
});

export default upload;