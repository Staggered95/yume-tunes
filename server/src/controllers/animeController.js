import { query } from '../config/db.js';

// Helper function for consistent pagination responses
const createResponse = (rows, page, limit) => ({
    success: true,
    data: rows,
    pagination: {
        currentPage: page,
        limit: limit,
        hasMore: rows.length === limit 
    }
});

const getAllAnime = async (req, res) => {
    // 1. Grab pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // 2. Add LIMIT $1 and OFFSET $2 to the end
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
        ORDER BY a.title ASC
        LIMIT $1 OFFSET $2; 
    `;

    try {
        const result = await query(text, [limit, offset]);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getAllAnime };