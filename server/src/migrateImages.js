import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';

// 1. Configure Cloudinary (Replace with your keys!)
cloudinary.config({
  cloud_name: 'ddc6silap',
  api_key: '739452281298433',
  api_secret: 'o82xDSUOAwvKRz_XZapC_gzj3BQ'
});

// 2. Connect to Local Database
const pool = new Pool({
  user: 'Shubham',
  host: 'localhost',
  database: 'yume_db',
  password: 'Staggered@95',
  port: 5432,
});

async function migrateImages() {
  console.log("Starting Cloudinary Migration...");

  // Grab all songs that don't have a live image yet
  const { rows: songs } = await pool.query(
    "SELECT id, title, cover_path FROM songs WHERE cover_path IS NOT NULL AND live_image_path IS NULL"
  );

  for (const song of songs) {
    try {
      // Build the absolute path to the image on your Arch machine
      // Assuming your script runs from /server/src and files are in /public
      const absolutePath = path.resolve(`../../public${song.cover_path}`);

      // Check if file actually exists before uploading
      if (!fs.existsSync(absolutePath)) {
        console.log(`❌ Missing file for ${song.title}: ${absolutePath}`);
        continue;
      }

      console.log(`Uploading: ${song.title}...`);

      // Upload to Cloudinary into a specific folder
      const result = await cloudinary.uploader.upload(absolutePath, {
        folder: "covers",
        use_filename: true,
        unique_filename: false
      });

      // Save the secure Cloudinary URL back to the DB
      await pool.query(
        "UPDATE songs SET live_image_path = $1 WHERE id = $2",
        [result.secure_url, song.id]
      );

      console.log(`✅ Success: ${song.title}`);

    } catch (error) {
      console.error(`🚨 Failed to upload ${song.title}:`, error.message);
    }
  }

  console.log("Migration Complete!");
  process.exit();
}

migrateImages();
