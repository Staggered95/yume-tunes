import { query } from '../config/db.js';
import { deleteMedia } from '../utils/mediaManager.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Helper function to safely delete files from the server
const deletePhysicalFile = (relativePath) => {
    if (!relativePath) return;
    try {
        // Use the exact base path where Multer saves the files
        const basePath = '/home/Shubham/YumeTunes/public';
        const absolutePath = path.join(basePath, relativePath);
        

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log("Successfully deleted:", absolutePath);
        } else {
            console.log("File not found on disk, skipping deletion.");
        }
    } catch (err) {
        console.error("Could not delete old file:", err);
    }
};

// === 1. GET ALL SONGS (For the SongManager Table) ===
const getAllSongs = async (req, res) => {
    try {
        const text = `
            SELECT s.id, s.title, s.file_path, s.cover_path, s.song_type, s.lyrics, ar.name AS artist, a.title AS anime 
            FROM songs s
            JOIN artists ar ON s.artist_id = ar.id
            LEFT JOIN animes a ON s.anime_id = a.id
            ORDER BY s.id DESC
        `;
        const result = await query(text);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching all songs:", err);
        res.status(500).json({ success: false, message: 'Server error fetching songs' });
    }
};

// === 2. ADD A NEW SONG ===
const addSong = async (req, res) => {
    // These come from the formData.append() in your React component
    const { title, artist_name, anime_title, song_type, duration_seconds, genre } = req.body;
    
    try {
        let audioPath = `/audio/${req.files['audio_file'][0].filename}`;
        let coverPath = null;

        // The Hybrid Upload Logic for Images!
        if (req.files && req.files['cover_image']) {
    const localImagePath = req.files['cover_image'][0].path;
    
    // The environment switch happens HERE instead of in Multer!
    const folderName = process.env.NODE_ENV === 'production' ? 'covers' : 'dev_covers';

    const result = await cloudinary.uploader.upload(localImagePath, { 
        folder: folderName,
        public_id: req.files['cover_image'][0].originalname.split('.')[0].replace(/\s+/g, '_')
    });
    
    coverPath = result.secure_url;
    
    // Nuke the temporary image off the disk!
    await deleteMedia(localImagePath); 
}

        // START TRANSACTION
        await query('BEGIN');

        // 1. Get or Create ARTIST
        const artistQuery = `
            INSERT INTO artists (name) VALUES ($1) 
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
        `;
        const artistRes = await query(artistQuery, [artist_name]);
        const artistId = artistRes.rows[0].id;

        // 2. Get or Create ANIME (Only if provided)
        let animeId = null;
        if (anime_title && anime_title.trim() !== "") {
            const animeQuery = `
                INSERT INTO animes (title, artist_id) VALUES ($1, $2) 
                ON CONFLICT (title) DO UPDATE SET title = EXCLUDED.title RETURNING id
            `;
            const animeRes = await query(animeQuery, [anime_title, artistId]);
            animeId = animeRes.rows[0].id;
        }

        // 3. Insert SONG
        const songQuery = `
            INSERT INTO songs (title, artist_id, anime_id, file_path, cover_path, song_type, duration_seconds) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `;
        // Make sure to capture the songId so we can link the genre!
        const songRes = await query(songQuery, [title, artistId, animeId, audioPath, coverPath, song_type, duration_seconds || null]);
        const songId = songRes.rows[0].id;

        if (genre && genre.trim() !== "") {
            // Insert the genre into the 'genres' table
            const genreQuery = `
                INSERT INTO genres (name) VALUES ($1) 
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
            `;
            const genreRes = await query(genreQuery, [genre.trim()]);
            const genreId = genreRes.rows[0].id;

            // Link the song and the genre in the 'song_genres' table!
            await query(`INSERT INTO song_genres (song_id, genre_id) VALUES ($1, $2)`, [songId, genreId]);
        }

        // COMMIT TRANSACTION
        await query('COMMIT');
        res.status(201).json({ success: true, message: 'Song added successfully' });

    } catch (err) {
        // IF ANYTHING FAILS, UNDO EVERYTHING
        await query('ROLLBACK');
        console.error("Error adding song:", err);
        res.status(500).json({ success: false, message: 'Server error saving song' });
    }
};

// === 3. UPDATE AN EXISTING SONG ===
const updateSong = async (req, res) => {
    const songId = req.params.id;
    const { title, artist_name, anime_title, song_type, duration_seconds, genre } = req.body;

    try {
        // 1. Fetch the current song to get existing file paths
        const currentSongRes = await query(`SELECT file_path, cover_path FROM songs WHERE id = $1`, [songId]);
        if (currentSongRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        const currentSong = currentSongRes.rows[0];

        // 2. Determine new file paths (use new ones if uploaded, otherwise keep old ones)
        let audioPath = currentSong.file_path;
        let coverPath = currentSong.cover_path;

        if (req.files && req.files['audio_file']) {
            audioPath = `/audio/${req.files['audio_file'][0].filename}`;
            await deleteMedia(currentSong.file_path); // Smart delete old MP3
        }
        
        if (req.files && req.files['cover_image']) {
    const localImagePath = req.files['cover_image'][0].path;
    
    // The environment switch happens HERE instead of in Multer!
    const folderName = process.env.NODE_ENV === 'production' ? 'covers' : 'dev_covers';

    const result = await cloudinary.uploader.upload(localImagePath, { 
        folder: folderName,
        public_id: req.files['cover_image'][0].originalname.split('.')[0].replace(/\s+/g, '_')
    });
    
    coverPath = result.secure_url;
    
    // Nuke the temporary image off the disk!
    await deleteMedia(localImagePath); 
}

        // START TRANSACTION
        await query('BEGIN');

        // 3. Get or Create ARTIST
        const artistQuery = `
            INSERT INTO artists (name) VALUES ($1) 
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
        `;
        const artistRes = await query(artistQuery, [artist_name]);
        const artistId = artistRes.rows[0].id;

        // 4. Get or Create ANIME
        let animeId = null;
        if (anime_title && anime_title.trim() !== "") {
            const animeQuery = `
                INSERT INTO animes (title, artist_id) VALUES ($1, $2) 
                ON CONFLICT (title) DO UPDATE SET title = EXCLUDED.title RETURNING id
            `;
            const animeRes = await query(animeQuery, [anime_title, artistId]);
            animeId = animeRes.rows[0].id;
        }

        // 5. Update the SONG row
        const updateQuery = `
            UPDATE songs 
            SET title = $1, artist_id = $2, anime_id = $3, file_path = $4, cover_path = $5, song_type = $6, duration_seconds=$7
            WHERE id = $8
        `;
        await query(updateQuery, [title, artistId, animeId, audioPath, coverPath, song_type, duration_seconds, songId]);

        await query(`DELETE FROM song_genres WHERE song_id = $1`, [songId]);
        if (genre && genre.trim() !== "") {
            const genreQuery = `
                INSERT INTO genres (name) VALUES ($1) 
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
            `;
            const genreRes = await query(genreQuery, [genre.trim()]);
            const genreId = genreRes.rows[0].id;

            await query(`INSERT INTO song_genres (song_id, genre_id) VALUES ($1, $2)`, [songId, genreId]);
        }

        // COMMIT TRANSACTION
        await query('COMMIT');
        res.status(200).json({ success: true, message: 'Song updated successfully' });

    } catch (err) {
        await query('ROLLBACK');
        console.error("Error updating song:", err);
        res.status(500).json({ success: false, message: 'Server error updating song' });
    }
};

// === 4. DELETE A SONG ===
const deleteSong = async (req, res) => {
    const songId = req.params.id;

    try {
        const currentSongRes = await query(`SELECT file_path, cover_path FROM songs WHERE id = $1`, [songId]);
        
        if (currentSongRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        
        const { file_path, cover_path } = currentSongRes.rows[0];

        // 1. Delete from DB (Cascades everywhere)
        await query(`DELETE FROM songs WHERE id = $1`, [songId]);

        // 2. Clean up physical/cloud files concurrently!
        await Promise.all([
            deleteMedia(file_path),
            deleteMedia(cover_path)
        ]);

        res.status(200).json({ success: true, message: 'Song and associated files deleted' });

    } catch (err) {
        console.error("Error deleting song:", err);
        res.status(500).json({ success: false, message: 'Server error deleting song' });
    }
};

// === 5. UPDATE TIMED LYRICS ===
const updateLyrics = async (req, res) => {
    const songId = req.params.id;
    const { lyrics } = req.body;

    try {
        const updateQuery = `UPDATE songs SET lyrics = $1 WHERE id = $2`;
        await query(updateQuery, [lyrics, songId]);
        
        res.status(200).json({ success: true, message: 'Lyrics updated successfully' });
    } catch (err) {
        console.error("Error updating lyrics:", err);
        res.status(500).json({ success: false, message: 'Server error updating lyrics' });
    }
};

// === 6. AUTO-GENERATE LYRICS VIA LRCLIB ===
const autoGenerateLyrics = async (req, res) => {
    // We grab these straight from the URL now!
    const { title, artist } = req.query;

    if (!title || !artist) {
        return res.status(400).json({ success: false, message: 'Title and artist are required' });
    }

    try {
        // Fetch directly from LRCLIB using the provided data
        const searchUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`;
        
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'YumeTunes/1.0 (Admin Panel)' 
            }
        });
        
        const data = await response.json();

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: 'No lyrics found on LRCLIB for this track.' });
        }

        const bestMatch = data[0];
        const lyricsToReturn = bestMatch.syncedLyrics || bestMatch.plainLyrics;

        if (!lyricsToReturn) {
            return res.status(404).json({ success: false, message: 'Track found, but no lyrics available.' });
        }

        res.status(200).json({ success: true, lyrics: lyricsToReturn });

    } catch (err) {
        console.error("Error fetching from LRCLIB:", err);
        res.status(500).json({ success: false, message: 'Server error fetching auto-lyrics' });
    }
};


//user management
const getAllUsers = async (req, res) => {
    try {
        // We do NOT select passwords here! Just the safe data.
        const result = await query(`
            SELECT id, username, email, user_image, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: 'Server error fetching users' });
    }
};

// === 8. UPDATE USER ROLE ===
const updateUserRole = async (req, res) => {
    const targetUserId = req.params.id;
    const { newRole } = req.body;

    // Optional but highly recommended: Prevent the admin from accidentally demoting themselves!
    // If you have the logged-in user's ID attached to req.user via your verifyToken middleware:
    if (req.user && req.user.id === parseInt(targetUserId)) {
        return res.status(400).json({ success: false, message: "You cannot change your own role." });
    }

    try {
        await query(`UPDATE users SET role = $1 WHERE id = $2`, [newRole, targetUserId]);
        res.status(200).json({ success: true, message: 'User role updated successfully' });
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ success: false, message: 'Server error updating role' });
    }
};

// === 9. GET ANALYTICS DASHBOARD STATS ===
const getDashboardStats = async (req, res) => {
    try {
        // Run all aggregation queries simultaneously for speed
        const [usersRes, songsRes, quotesRes, topSongsRes] = await Promise.all([
            query(`SELECT COUNT(*) FROM users`),
            query(`SELECT COUNT(*) FROM songs`),
            query(`SELECT COUNT(*) FROM quotes WHERE is_active = true`),
            query(`
                SELECT s.id, s.title, ar.name as artist, COUNT(lh.id) as play_count
                FROM listening_history lh
                JOIN songs s ON lh.song_id = s.id
                JOIN artists ar ON s.artist_id = ar.id
                GROUP BY s.id, s.title, ar.name
                ORDER BY play_count DESC
                LIMIT 5
            `)
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers: parseInt(usersRes.rows[0].count),
                totalSongs: parseInt(songsRes.rows[0].count),
                activeQuotes: parseInt(quotesRes.rows[0].count),
                topSongs: topSongsRes.rows
            }
        });
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ success: false, message: 'Server error fetching analytics' });
    }
};



export default { getAllSongs, addSong, updateSong, deleteSong, updateLyrics, autoGenerateLyrics, getAllUsers, updateUserRole, getDashboardStats };
