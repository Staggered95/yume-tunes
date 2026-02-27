import { query } from '../config/db.js';


const toggleLikeSong = async (req, res) => {
    const userID = req.user.id;
    const songID = req.params.id;

    try {
        const checkPresence = await query("SELECT * FROM liked_songs WHERE user_id=$1 AND song_id=$2", [userID, songID]);
        const addSong = "INSERT INTO liked_songs(user_id, song_id) VALUES($1, $2)";
        const removeSong = "DELETE FROM liked_songs WHERE user_id=$1 AND song_id=$2";

        let status = checkPresence.rows.length > 0 ? "Removed from likes" : "Added to likes";
        let text = checkPresence.rows.length > 0 ? removeSong : addSong;

        const result = await query(text, [userID, songID]);
        res.status(201).json({ success: true, message: status });
    } catch (err) {
        console.log("Error handling the liked song", err);
        res.status(501).json({ success: false, error: err });
    }
}

const getLikedSongs = async (req, res) => {
    const userID = req.user.id;
    const text = `SELECT s.id, s.duration_seconds, s.cover_path, s.title, ar.name AS artist FROM songs s
                  JOIN liked_songs ls ON s.id = ls.song_id
                  JOIN artists ar ON s.artist_id = ar.id  
                  WHERE ls.user_id = $1
                  ORDER BY ls.liked_at DESC`
    
    try {
        const result = await query(text, [userID]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.log("Error fetching the liked song", err);
        res.status(500).json({ success: false, error: err });
    }
}

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
    const text = `SELECT first_name, last_name, username, email, created_at
                  FROM users WHERE id=$1`;

    try {
        const result = await query(text, [userID]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.log("Error fetching the user details", err);
        res.status(500).json({ success: false, error: err });
    }
}

export default { toggleLikeSong, getLikedSongs, getLikedSongsMinimalData, getUserDetails };