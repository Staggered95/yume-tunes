import { query } from '../config/db.js';

const getArtists = async (req, res) => {
    // Added LIMIT 1 to the subquery to prevent "more than one row returned" errors
    const text = `
        SELECT ar.id, ar.name,
               COUNT(s.id) AS track_count,
               (SELECT cover_path FROM songs WHERE artist_id = ar.id LIMIT 1) AS profile_pic
        FROM artists ar
        LEFT JOIN songs s ON s.artist_id = ar.id
        GROUP BY ar.id, ar.name
        ORDER BY ar.name ASC
    `;
            
    try {
        const result = await query(text);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("❌ Error fetching Artists:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const getArtistDetails = async (req, res) => {
    // 1. This comes from your route: /artist/:name
    const artistName = req.params.name; 

    const animeText = `
        SELECT DISTINCT a.title, a.id, 
        (SELECT cover_path FROM songs WHERE anime_id = a.id LIMIT 1) as anime_cover
        FROM animes a
        JOIN songs s ON s.anime_id = a.id
        JOIN artists ar ON s.artist_id = ar.id 
        WHERE ar.name ILIKE $1; 
    `;

    try {
        // Use the string name here instead of an ID
        const animeResult = await query(animeText, [artistName]);
        
        res.status(200).json({
            success: true,
            data: {
                featuredAnimes: animeResult.rows
            }
        });
    } catch (err) {
        console.error("❌ Error fetching Artist details:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export default { getArtists, getArtistDetails };