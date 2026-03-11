import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// 1. The Bulletproof Path Check
// If '/public' exists at the root, we are 100% inside Docker.
// Otherwise, we are running bare-metal on your Arch laptop.
const baseDir = fs.existsSync('/public') 
    ? '/public' 
    : '/home/Shubham/YumeTunes/public';

const audioDir = path.join(baseDir, 'audio');
// This cover directory is purely temporary now! 
const coverDir = path.join(baseDir, 'images/covers');

// Ensure directories exist
[audioDir, coverDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 2. Configure Disk Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'audio_file') {
            cb(null, audioDir); // MP3 stays here permanently for Nginx
        } else if (file.fieldname === 'cover_image') {
            cb(null, coverDir); // Image parks here for 1 second
        }
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(4).toString('hex');
        const filename = `${file.fieldname}-${hash}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

// 3. File Filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'audio_file' && file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else if (file.fieldname === 'cover_image' && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
};

const songUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export default songUpload;