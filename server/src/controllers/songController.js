import { query } from '../config/db.js';

// Helper: The Base SELECT logic we'll reuse to keep things DRY (Don't Repeat Yourself)
const BASE_SONG_QUERY = `
    SELECT 
        s.id, s.title, s.song_type, s.file_path, s.cover_path,
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

const getAllSongs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const text = `${BASE_SONG_QUERY} ${GROUP_BY_CLAUSE} ORDER BY s.id LIMIT $1 OFFSET $2`;
    
    try {
        const result = await query(text, [limit, offset]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByAnime = async (req, res) => {
    const animeTitle = req.query.title;
    const text = `${BASE_SONG_QUERY} WHERE a.title ILIKE $1 ${GROUP_BY_CLAUSE}`;

    try {
        const result = await query(text, [`%${animeTitle}%`]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByArtist = async (req, res) => {
    const artistName = req.query.artist;
    // We search the 'artists' table now, not 'songs'
    const text = `${BASE_SONG_QUERY} WHERE ar.name ILIKE $1 ${GROUP_BY_CLAUSE}`;

    try {
        const result = await query(text, [`%${artistName}%`]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSongsByGenre = async (req, res) => {
    const genres = req.query.genre;
    const genreArray = Array.isArray(genres) ? genres : [genres];

    // Using HAVING because we need to filter AFTER the aggregation (json_agg)
    // Or we can filter in the WHERE clause using the junction table
    const text = `
        ${BASE_SONG_QUERY} 
        WHERE g.name = ANY($1::text[]) 
        ${GROUP_BY_CLAUSE}
    `;

    try {
        const result = await query(text, [genreArray]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSearchResults = async (req, res) => {
    const { q, genre, type } = req.query;
    
    // We start with our base query and build the WHERE clause dynamically
    let values = [];
    let conditions = [];

    // 1. Text Search (Query)
    if (q) {
        values.push(`%${q}%`);
        conditions.push(`(s.title ILIKE $${values.length} OR ar.name ILIKE $${values.length} OR a.title ILIKE $${values.length})`);
    }

    // 2. Genre Filter
    if (genre) {
        values.push(genre);
        conditions.push(`g.name = $${values.length}`);
    }

    // 3. Song Type Filter (OP, ED, etc.)
    if (type) {
        values.push(type);
        conditions.push(`s.song_type = $${values.length}`);
    }

    // Combine conditions with AND
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : "";

    const text = `
        ${BASE_SONG_QUERY}
        ${whereClause}
        ${GROUP_BY_CLAUSE}
        ORDER BY s.id ASC
    `;

    try {
        const result = await query(text, values);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getAllSongs, getSongsByAnime, getSongsByArtist, getSongsByGenre, getSearchResults };