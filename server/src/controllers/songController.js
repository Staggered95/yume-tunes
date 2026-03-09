import { query } from '../config/db.js';

const BASE_SONG_QUERY = `
    SELECT 
        s.id, s.title, s.song_type, s.file_path, s.cover_path, s.lyrics,
        a.title AS anime,
        ar.name AS artist,
        COALESCE(json_agg(g.name) FILTER (WHERE g.name IS NOT NULL), '[]') AS genres
    FROM songs s
    JOIN animes a ON s.anime_id = a.id
    JOIN artists ar ON s.artist_id = ar.id
    LEFT JOIN song_genres sg ON s.id = sg.song_id
    LEFT JOIN genres g ON sg.genre_id = g.id
`;

const GROUP_BY_CLAUSE = `GROUP BY s.id, a.title, ar.name`;

// Helper function to keep our responses uniform!
const createResponse = (rows, page, limit) => ({
    success: true,
    data: rows,
    pagination: {
        currentPage: page,
        limit: limit,
        // If we got exactly the limit back, there's likely more data waiting!
        hasMore: rows.length === limit 
    }
});

const getAllSongs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `${BASE_SONG_QUERY} ${GROUP_BY_CLAUSE} ORDER BY s.id LIMIT $1 OFFSET $2`;
    
    try {
        const result = await query(text, [limit, offset]);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByAnime = async (req, res) => {
    const animeTitle = req.params.title; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `${BASE_SONG_QUERY} WHERE a.title ILIKE $1 ${GROUP_BY_CLAUSE} ORDER BY s.id LIMIT $2 OFFSET $3`;

    try {
        const result = await query(text, [animeTitle, limit, offset]); 
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByArtist = async (req, res) => {
    const artistName = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `${BASE_SONG_QUERY} WHERE ar.name ILIKE $1 ${GROUP_BY_CLAUSE} ORDER BY s.id LIMIT $2 OFFSET $3`;

    try {
        const result = await query(text, [artistName, limit, offset]);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByGenre = async (req, res) => {
    const genres = req.query.genre;
    const genreArray = Array.isArray(genres) ? genres : [genres];
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `
        ${BASE_SONG_QUERY} 
        WHERE g.name = ANY($1::text[]) 
        ${GROUP_BY_CLAUSE}
        ORDER BY s.id 
        LIMIT $2 OFFSET $3
    `;

    try {
        const result = await query(text, [genreArray, limit, offset]);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSearchResults = async (req, res) => {
    const { q, genre, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    let values = [];
    let conditions = [];

    if (q) {
        values.push(`%${q}%`);
        conditions.push(`(s.title ILIKE $${values.length} OR ar.name ILIKE $${values.length} OR a.title ILIKE $${values.length})`);
    }

    if (genre) {
        values.push(genre);
        conditions.push(`g.name = $${values.length}`);
    }

    if (type) {
        values.push(type);
        conditions.push(`s.song_type = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : "";

    // Safely add Limit and Offset to our dynamically growing values array!
    values.push(limit);
    const limitParam = `$${values.length}`; // e.g., $2 or $4 depending on filters
    
    values.push(offset);
    const offsetParam = `$${values.length}`; // e.g., $3 or $5

    const text = `
        ${BASE_SONG_QUERY}
        ${whereClause}
        ${GROUP_BY_CLAUSE}
        ORDER BY s.id ASC
        LIMIT ${limitParam} OFFSET ${offsetParam}
    `;

    try {
        const result = await query(text, values);
        res.status(200).json(createResponse(result.rows, page, limit));
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getAllSongs, getSongsByAnime, getSongsByArtist, getSongsByGenre, getSearchResults };