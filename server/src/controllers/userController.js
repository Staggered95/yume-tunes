import { query } from '../config/db.js';
import { deleteMedia } from '../utils/mediaManager.js';


const toggleLikeSong = async (req, res) => {
    const userID = req.user.id;
    const songID = req.params.id;

    try {
        const checkPresence = await query("SELECT * FROM liked_songs WHERE user_id=$1 AND song_id=$2", [userID, songID]);
        const addSong = "INSERT INTO liked_songs(user_id, song_id) VALUES($1, $2)";
        const removeSong = "DELETE FROM liked_songs WHERE user_id=$1 AND song_id=$2";

        let status = checkPresence.rows.length > 0 ? "liked" : "disliked";
        let text = checkPresence.rows.length > 0 ? removeSong : addSong;

        const result = await query(text, [userID, songID]);
        res.status(201).json({ success: true, message: status });
    } catch (err) {
        console.log("Error handling the liked song", err);
        res.status(501).json({ success: false, error: err });
    }
}

const getLikedSongs = async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `
        SELECT 
            s.id, s.title, s.song_type, s.duration_seconds, s.file_path, s.cover_path,
            a.title AS anime,
            ar.name AS artist,
            ls.liked_at
        FROM liked_songs ls
        JOIN songs s ON ls.song_id = s.id
        JOIN animes a ON s.anime_id = a.id
        JOIN artists ar ON s.artist_id = ar.id
        WHERE ls.user_id = $1
        ORDER BY ls.liked_at DESC
        LIMIT $2 OFFSET $3;
    `;

    try {
        const result = await query(text, [userId, limit, offset]);
        
        res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: page,
                limit: limit,
                hasMore: result.rows.length === limit
            }
        });
    } catch (err) {
        console.error("Error fetching liked songs:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};


const getLikedSongsMinimalData = async (req, res) => {
    const userID = req.user.id;
    const text = `SELECT song_id AS id 
                  FROM liked_songs 
                  WHERE user_id = $1 
                  ORDER BY liked_at DESC
                `;

    try {
        const result = await query(text, [userID]);
        const flatIds = result.rows.map(row => row.id);
        res.status(200).json({ success: true, data: flatIds });
    } catch (err) {
        console.log("Error fetching the id of liked song", err);
        res.status(500).json({ success: false, error: err });
    }
}

const getUserDetails = async(req, res) => {
    const userID = req.user.id;
    const text = `SELECT first_name, last_name, username, email, created_at, user_image, banner_image, role
                  FROM users WHERE id=$1`;

    try {
        const result = await query(text, [userID]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.log("Error fetching the user details", err);
        res.status(500).json({ success: false, error: err });
    }
}

const getUserHomeData = async (req, res) => {
    const userId = req.user.id; 

    const continueQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.lyrics, s.file_path, 
            ar.name AS artist, a.title AS anime, 
            MAX(lh.created_at) as last_played
        FROM listening_history lh
        JOIN songs s ON lh.song_id = s.id
        JOIN artists ar ON s.artist_id = ar.id
        JOIN animes a ON s.anime_id = a.id
        WHERE lh.user_id = $1
        GROUP BY s.id, s.title, s.cover_path, s.lyrics, s.file_path, ar.name, a.title
        ORDER BY last_played DESC
        LIMIT 10
    `;

    const recommendQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.lyrics, s.file_path, 
            ar.name AS artist, a.title AS anime
        FROM user_recommendations ur
        JOIN songs s ON ur.song_id = s.id
        JOIN artists ar ON s.artist_id = ar.id
        JOIN animes a ON s.anime_id = a.id
        WHERE ur.user_id = $1
        ORDER BY ur.affinity_score DESC
        LIMIT 10
    `;

    try {
        const [continueRes, recommendRes] = await Promise.all([
            query(continueQuery, [userId]),
            query(recommendQuery, [userId])
        ]);

        res.status(200).json({ 
            success: true, 
            data: {
                continueListening: continueRes.rows,
                recommended: recommendRes.rows
            }
        });
    } catch (err) {
        console.error("Error fetching user home data:", err);
        res.status(500).json({ success: false, message: 'Server error fetching user data' });
    }
};

const getListeningHistory = async (req, res) => {
    const userID = req.user.id;
    
    const text = `
        SELECT 
            lh.id AS history_id,
            s.id AS song_id, 
            s.title, 
            s.cover_path,
            ar.name AS artist, 
            a.title AS anime, 
            lh.created_at
        FROM listening_history lh
        JOIN songs s ON lh.song_id = s.id
        JOIN artists ar ON s.artist_id = ar.id
        LEFT JOIN animes a ON s.anime_id = a.id
        WHERE lh.user_id = $1
        ORDER BY lh.created_at DESC
        LIMIT 50
    `;

    try {
        const result = await query(text, [userID]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching chronological history:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const userId = req.user.id; 
        
        const imagePath = req.file.path;

        const oldUserRes = await query(`SELECT user_image FROM users WHERE id = $1`, [userId]);
        const oldAvatar = oldUserRes.rows[0]?.user_image;

        const updateQuery = `UPDATE users SET user_image = $1 WHERE id = $2 RETURNING user_image`;
        await query(updateQuery, [imagePath, userId]);

        if (oldAvatar && oldAvatar !== imagePath) {
            await deleteMedia(oldAvatar);
        }

        return res.json({ 
            success: true, 
            imageUrl: imagePath 
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
};

const uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const userId = req.user.id;
        
        const bannerPath = req.file.path;

        const oldUserRes = await query(`SELECT banner_image FROM users WHERE id = $1`, [userId]);
        const oldBanner = oldUserRes.rows[0]?.banner_image;

        const updateQuery = `UPDATE users SET banner_image = $1 WHERE id = $2 RETURNING banner_image`;
        await query(updateQuery, [bannerPath, userId]);

        if (oldBanner && oldBanner !== bannerPath) {
            await deleteMedia(oldBanner);
        }

        return res.json({ 
            success: true, 
            imageUrl: bannerPath 
        });
    } catch (error) {
        console.error('Banner upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
        const userId = req.user.id;

        const updateQuery = `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *`;
        const result = await query(updateQuery, [first_name, last_name, userId]);

        return res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};

export default { toggleLikeSong, getLikedSongs, getLikedSongsMinimalData, getUserDetails, getUserHomeData, getListeningHistory, uploadAvatar, uploadBanner, updateProfile };