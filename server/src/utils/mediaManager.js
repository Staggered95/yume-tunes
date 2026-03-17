import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

/**
 * Universally deletes a file whether it's on local disk or Cloudinary.
 * @param {string} fileString - The path or URL from the database
 */
export const deleteMedia = async (fileString) => {
    if (!fileString) return;

    try {
        if (fileString.startsWith('http')) {
            const urlParts = fileString.split('/upload/');
            if (urlParts.length > 1) {
                const pathAfterUpload = urlParts[1];
                const pathParts = pathAfterUpload.split('/');
                if (pathParts[0].match(/^v\d+$/)) {
                    pathParts.shift(); 
                }
                const cleanPath = pathParts.join('/');
                const publicId = cleanPath.substring(0, cleanPath.lastIndexOf('.'));

                await cloudinary.uploader.destroy(publicId);
                console.log("☁️ Successfully deleted from Cloudinary:", publicId);
            }
        } else {
            const baseDir = fs.existsSync('/public') 
                ? '/public' 
                : '/home/Shubham/YumeTunes/public';
                
            let absolutePath;

            if (fileString.startsWith(baseDir)) {
                absolutePath = fileString; 
            } else {
                absolutePath = path.join(baseDir, fileString);
            }

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log("📁 Successfully deleted from disk:", absolutePath);
            } else {
                console.log("File not found on disk, skipping:", absolutePath);
            }
        }
    } catch (err) {
        console.error("🚨 Could not delete media:", err);
    }
};