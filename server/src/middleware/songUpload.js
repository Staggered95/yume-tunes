import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';


const baseDir = fs.existsSync('/public') 
    ? '/public' 
    : '/home/Shubham/YumeTunes/public';

const audioDir = path.join(baseDir, 'audio');
const coverDir = path.join(baseDir, 'images/covers');

[audioDir, coverDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'audio_file') {
            cb(null, audioDir); 
        } else if (file.fieldname === 'cover_image') {
            cb(null, coverDir); 
        }
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(4).toString('hex');
        const filename = `${file.fieldname}-${hash}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

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
    limits: { fileSize: 50 * 1024 * 1024 } 
});

export default songUpload;