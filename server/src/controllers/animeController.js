import { query } from '../config/db.js';

const getAllAnime = async (req, res) => {
    const text = `
        SELECT 
            a.title,
            MIN(a.id) as id,
            COUNT(s.id) as track_count,
            (
                SELECT array_agg(cover_path)
                FROM (
                    SELECT cover_path 
                    FROM songs 
                    WHERE anime_id IN (
                        SELECT id FROM animes WHERE title = a.title
                    )
                    AND cover_path IS NOT NULL
                    LIMIT 4
                ) sub
            ) as collage_covers
        FROM animes a
        LEFT JOIN songs s ON s.anime_id = a.id
        GROUP BY a.title
        ORDER BY a.title ASC;
    `;

    try {
        const result = await query(text);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getAllAnime };