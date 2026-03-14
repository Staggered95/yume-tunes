import { query } from "../config/db.js";

const createPlaylist = async (req, res) => {
    // Pulls the ID from the verifyToken middleware
    const userID = req.user.id; 
    const { name, description } = req.body;
    
    const text = `INSERT INTO playlists(user_id, name, description)
                  VALUES($1, $2, $3)
                  RETURNING *`;

    const values = [userID, name, description];

    try {
        const result = await query(text, values);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) { // BUG FIX: added (err)
        console.error("Error creating Playlist", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

const getPlaylists = async (req, res) => {
    const userID = req.user.id;
    const text = `
        SELECT 
            p.*,
            (
                SELECT json_agg(s.cover_path)
                FROM (
                    SELECT songs.cover_path
                    FROM playlist_songs ps
                    JOIN songs ON ps.song_id = songs.id
                    WHERE ps.playlist_id = p.id
                    ORDER BY ps.added_at ASC 
                    LIMIT 4
                ) s
            ) AS auto_covers,
            (
                -- Grab the total count and cast it to a standard integer
                SELECT COUNT(*)::int
                FROM playlist_songs
                WHERE playlist_id = p.id
            ) AS song_count
        FROM playlists p
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
    `;
    const values = [userID];

    try {
        const result = await query(text, values);
        
        const formattedPlaylists = result.rows.map(playlist => ({
            ...playlist,
            auto_covers: playlist.auto_covers || [],
            // song_count will automatically be included here as a number!
        }));
        
        res.status(200).json({ success: true, data: formattedPlaylists });
    } catch (err) {
        console.error("Error fetching Playlists", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

// Replace getSongsFromPlaylist with this:
const getPlaylistById = async (req, res) => {
    const playlistID = req.params.id; // Make sure your route is router.get('/:id', ...)
    const userID = req.user.id;

    try {
        // 1. Fetch the Playlist Meta (with the dynamic auto_covers!)
        const metaText = `
            SELECT 
                p.*,
                (
                    SELECT json_agg(s.cover_path)
                    FROM (
                        SELECT songs.cover_path
                        FROM playlist_songs ps
                        JOIN songs ON ps.song_id = songs.id
                        WHERE ps.playlist_id = p.id
                        ORDER BY ps.added_at ASC
                        LIMIT 4
                    ) s
                ) AS auto_covers
            FROM playlists p
            WHERE p.id = $1 AND p.user_id = $2
        `;
        const metaResult = await query(metaText, [playlistID, userID]);

        if (metaResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Playlist not found or not authorized" });
        }

        const playlistMeta = metaResult.rows[0];
        playlistMeta.auto_covers = playlistMeta.auto_covers || [];

        // 2. Fetch the Songs (We JOIN artists here so your React UI can display the artist name!)
        const songsText = `
            SELECT s.*, ps.position_order, ps.added_at, ar.name AS artist
            FROM songs s
            JOIN playlist_songs ps ON s.id = ps.song_id
            JOIN artists ar ON s.artist_id = ar.id
            WHERE ps.playlist_id = $1
            ORDER BY ps.added_at ASC
        `;
        const songsResult = await query(songsText, [playlistID]);

        // 3. Return the exact JSON structure your React page is waiting for
        res.status(200).json({ 
            success: true, 
            data: {
                playlist: playlistMeta,
                songs: songsResult.rows
            } 
        });

    } catch (err) {
        console.error("Error fetching full playlist details:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

const addToPlaylist = async (req, res) => {
    const playlistID = req.params.playlistId; // from URL: /playlists/:playlistId/songs
    const { songID, positionOrder } = req.body; 
    const userID = req.user.id;

    try {
        const ownershipCheck = await query("SELECT id FROM playlists WHERE id=$1 AND user_id=$2", [playlistID, userID]);
        if (ownershipCheck.rows.length === 0) {
            return res.status(403).json({ success: false, error: "Not authorized to modify this playlist" });
        }

        const duplicateCheck = await query("SELECT * FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2", [playlistID, songID]);
        if (duplicateCheck.rows.length > 0) {
            return res.status(400).json({ success: false, error: "Song already in playlist" });
        }

        const text = `INSERT INTO playlist_songs(playlist_id, song_id, position_order)
                      VALUES($1, $2, $3)
                      RETURNING *;`;
        const result = await query(text, [playlistID, songID, positionOrder]);
        
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("Error inserting into Playlist", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

const deleteFromPlaylist = async (req, res) => {
    const playlistID = req.params.playlistId;
    const songID = req.params.songId; // e.g. /playlists/5/songs/12
    const userID = req.user.id;

    try {
        const ownershipCheck = await query("SELECT id FROM playlists WHERE id=$1 AND user_id=$2", [playlistID, userID]);
        if (ownershipCheck.rows.length === 0) {
            return res.status(403).json({ success: false, error: "Not authorized" });
        }

        const text = `DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2`;
        await query(text, [playlistID, songID]);
        
        res.status(200).json({ success: true, message: "Song removed" });
    } catch (err) {
        console.error("Error deleting from Playlist", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

const deletePlaylist = async (req, res) => {
    const playlistID = req.params.id;
    const userID = req.user.id;

    const text = `DELETE FROM playlists WHERE id=$1 AND user_id=$2 RETURNING id`;
    const values = [playlistID, userID];

    try {
        const result = await query(text, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Playlist not found or not authorized" });
        }

        res.status(200).json({ success: true, message: "Playlist deleted completely" });
    } catch (err) {
        console.error("Error deleting the Playlist", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

export default { createPlaylist, getPlaylists, getPlaylistById, addToPlaylist, deleteFromPlaylist, deletePlaylist };