import { query } from '../config/db.js';

const createResponse = (rows, page, limit) => ({
    success: true,
    data: rows,
    pagination: {
        currentPage: page,
        limit: limit,
        hasMore: rows.length === limit
    }
});

const getArtists = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `
        SELECT ar.id, ar.name,
               COUNT(s.id) AS track_count,
               (SELECT cover_path FROM songs WHERE artist_id = ar.id LIMIT 1) AS profile_pic
        FROM artists ar
        LEFT JOIN songs s ON s.artist_id = ar.id
        GROUP BY ar.id, ar.name
        ORDER BY ar.name ASC
        LIMIT $1 OFFSET $2
    `;
            
    try {
        const result = await query(text, [limit, offset]);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        console.error("❌ Error fetching Artists:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const getArtistDetails = async (req, res) => {
    const artistName = req.params.name; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const animeText = `
        SELECT DISTINCT a.title, a.id, 
        (SELECT cover_path FROM songs WHERE anime_id = a.id LIMIT 1) as anime_cover
        FROM animes a
        JOIN songs s ON s.anime_id = a.id
        JOIN artists ar ON s.artist_id = ar.id 
        WHERE ar.name ILIKE $1
        ORDER BY a.title ASC 
        LIMIT $2 OFFSET $3; 
    `;

    try {
        const animeResult = await query(animeText, [artistName, limit, offset]);
        
        res.status(200).json({
            success: true,
            data: {
                featuredAnimes: animeResult.rows
            },
            pagination: {
                currentPage: page,
                limit: limit,
                hasMore: animeResult.rows.length === limit
            }
        });
    } catch (err) {
        console.error("❌ Error fetching Artist details:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export default { getArtists, getArtistDetails };