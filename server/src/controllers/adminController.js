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


// get all songs for song manager
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

// add new song
const addSong = async (req, res) => {
    const { title, artist_name, anime_title, song_type, duration_seconds, genre } = req.body;
    
    try {
        let audioPath = `/audio/${req.files['audio_file'][0].filename}`;
        let coverPath = null;

        if (req.files && req.files['cover_image']) {
    const localImagePath = req.files['cover_image'][0].path;
    
    const folderName = process.env.NODE_ENV === 'production' ? 'covers' : 'dev_covers';

    const result = await cloudinary.uploader.upload(localImagePath, { 
    folder: folderName,
    public_id: req.files['cover_image'][0].originalname.split('.')[0].replace(/\s+/g, '_'),
    
    format: 'webp',
    transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
    ]
});
    
    coverPath = result.secure_url;
    await deleteMedia(localImagePath); 
}

        // START TRANSACTION
        await query('BEGIN');

        const artistQuery = `
            INSERT INTO artists (name) VALUES ($1) 
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
        `;
        const artistRes = await query(artistQuery, [artist_name]);
        const artistId = artistRes.rows[0].id;

        let animeId = null;
        if (anime_title && anime_title.trim() !== "") {
            const animeQuery = `
                INSERT INTO animes (title, artist_id) VALUES ($1, $2) 
                ON CONFLICT (title) DO UPDATE SET title = EXCLUDED.title RETURNING id
            `;
            const animeRes = await query(animeQuery, [anime_title, artistId]);
            animeId = animeRes.rows[0].id;
        }

        const songQuery = `
            INSERT INTO songs (title, artist_id, anime_id, file_path, cover_path, song_type, duration_seconds) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `;
        const songRes = await query(songQuery, [title, artistId, animeId, audioPath, coverPath, song_type, duration_seconds || null]);
        const songId = songRes.rows[0].id;

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
        res.status(201).json({ success: true, message: 'Song added successfully' });

    } catch (err) {
        // IF ANYTHING FAILS, UNDO EVERYTHING
        await query('ROLLBACK');
        console.error("Error adding song:", err);
        res.status(500).json({ success: false, message: 'Server error saving song' });
    }
};

// update in a song
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
            await deleteMedia(currentSong.file_path); 
        }
        
        if (req.files && req.files['cover_image']) {
    const localImagePath = req.files['cover_image'][0].path;
    
    const folderName = process.env.NODE_ENV === 'production' ? 'covers' : 'dev_covers';

    const result = await cloudinary.uploader.upload(localImagePath, { 
        folder: folderName,
        public_id: req.files['cover_image'][0].originalname.split('.')[0].replace(/\s+/g, '_')
    });
    
    coverPath = result.secure_url;
    
    await deleteMedia(localImagePath); 
}

        // START TRANSACTION
        await query('BEGIN');

        const artistQuery = `
            INSERT INTO artists (name) VALUES ($1) 
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
        `;
        const artistRes = await query(artistQuery, [artist_name]);
        const artistId = artistRes.rows[0].id;

        let animeId = null;
        if (anime_title && anime_title.trim() !== "") {
            const animeQuery = `
                INSERT INTO animes (title, artist_id) VALUES ($1, $2) 
                ON CONFLICT (title) DO UPDATE SET title = EXCLUDED.title RETURNING id
            `;
            const animeRes = await query(animeQuery, [anime_title, artistId]);
            animeId = animeRes.rows[0].id;
        }

        const updateQuery = `
            UPDATE songs 
            SET title = $1, artist_id = $2, anime_id = $3, file_path = $4, cover_path = $5, song_type = $6, duration_seconds=$7
            WHERE id = $8
        `;
        await query(updateQuery, [title, artistId, animeId, audioPath, coverPath, song_type, duration_seconds || null, songId]);

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

// delete a song
const deleteSong = async (req, res) => {
    const songId = req.params.id;

    try {
        const currentSongRes = await query(`SELECT file_path, cover_path FROM songs WHERE id = $1`, [songId]);
        
        if (currentSongRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        
        const { file_path, cover_path } = currentSongRes.rows[0];

        await query(`DELETE FROM songs WHERE id = $1`, [songId]);

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

const autoGenerateLyrics = async (req, res) => {
    const { title, artist } = req.query;

    if (!title || !artist) {
        return res.status(400).json({ success: false, message: 'Title and artist are required' });
    }

    try {
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

const updateUserRole = async (req, res) => {
    const targetUserId = req.params.id;
    const { newRole } = req.body;

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


const getAllArtists = async (req, res) => {
    try {
        const result = await query(`SELECT id, name FROM artists ORDER BY name ASC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching artists:", err);
        res.status(500).json({ success: false, message: 'Server error fetching artists' });
    }
};

const getAllAnimes = async (req, res) => {
    try {
        const result = await query(`SELECT id, title AS name FROM animes ORDER BY title ASC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching animes:", err);
        res.status(500).json({ success: false, message: 'Server error fetching animes' });
    }
};

const deleteArtist = async (req, res) => {
    const artistId = req.params.id;
    try {
        await query(`DELETE FROM artists WHERE id = $1`, [artistId]);
        res.status(200).json({ success: true, message: 'Artist deleted successfully' });
    } catch (err) {
        // Postgres Error 23503 means "Foreign Key Violation" (Songs are still attached!)
        if (err.code === '23503') {
            return res.status(400).json({ success: false, message: 'Cannot delete: This artist still has songs linked to them.' });
        }
        console.error("Error deleting artist:", err);
        res.status(500).json({ success: false, message: 'Server error deleting artist' });
    }
};

const deleteAnime = async (req, res) => {
    const animeId = req.params.id;
    try {
        await query(`DELETE FROM animes WHERE id = $1`, [animeId]);
        res.status(200).json({ success: true, message: 'Anime deleted successfully' });
    } catch (err) {
        // Postgres Error 23503 means "Foreign Key Violation"
        if (err.code === '23503') {
            return res.status(400).json({ success: false, message: 'Cannot delete: This anime still has songs linked to it.' });
        }
        console.error("Error deleting anime:", err);
        res.status(500).json({ success: false, message: 'Server error deleting anime' });
    }
};

const updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body; 

    try {
        await query(`UPDATE artists SET name = $1 WHERE id = $2`, [name, id]);
        res.status(200).json({ success: true, message: 'Artist updated successfully' });
    } catch (err) {
        console.error("Error updating artist:", err);
        res.status(500).json({ success: false, message: 'Server error updating artist' });
    }
};

const updateAnime = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body; 

    try {
        await query(`UPDATE animes SET title = $1 WHERE id = $2`, [name, id]);
        res.status(200).json({ success: true, message: 'Anime updated successfully' });
    } catch (err) {
        console.error("Error updating anime:", err);
        res.status(500).json({ success: false, message: 'Server error updating anime' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
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



export default { getAllSongs, addSong, updateSong, deleteSong, updateLyrics, autoGenerateLyrics, getAllUsers, updateUserRole, getDashboardStats, getAllArtists, getAllAnimes, deleteArtist, deleteAnime, updateArtist, updateAnime };
