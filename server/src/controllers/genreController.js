import { query } from '../config/db.js';

const getGenreList = async (req, res) => {
    const text = `
        SELECT 
            g.name AS genre, 
            COUNT(sg.song_id) AS track_count
        FROM genres g
        LEFT JOIN song_genres sg ON g.id = sg.genre_id
        GROUP BY g.id, g.name
        ORDER BY track_count DESC;
    `;

    try {
        const result = await query(text);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("❌ Error fetching Genre List:", err);
        res.status(500).json({ success: false, error: "Database error" });
    }
};

export default { getGenreList };