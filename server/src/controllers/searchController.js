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

const getGlobalSearch = async (req, res) => {
    const { q, genre, type } = req.query;
    
    if (!q) {
        return res.status(200).json({ 
            success: true, 
            data: { songs: [], artists: [], animes: [] } 
        });
    }

    try {
        let songValues = [];
        let songConditions = [];

        songValues.push(`%${q}%`);
        
        songConditions.push(`s.title ILIKE $${songValues.length}`);

        if (genre) {
            songValues.push(genre);
            songConditions.push(`g.name = $${songValues.length}`);
        }

        if (type) {
            songValues.push(type);
            songConditions.push(`s.song_type = $${songValues.length}`);
        }

        const songWhereClause = `WHERE ${songConditions.join(' AND ')}`;
        const songsQueryStr = `
            ${BASE_SONG_QUERY}
            ${songWhereClause}
            ${GROUP_BY_CLAUSE}
            ORDER BY s.id ASC
            LIMIT 20
        `;

        const artistsQueryStr = `
            SELECT ar.id, ar.name, MAX(s.cover_path) as image
            FROM artists ar
            LEFT JOIN songs s ON s.artist_id = ar.id
            WHERE ar.name ILIKE $1
            GROUP BY ar.id, ar.name
            LIMIT 8
        `;

        const animesQueryStr = `
            SELECT a.id, a.title as name, MAX(s.cover_path) as image
            FROM animes a
            LEFT JOIN songs s ON s.anime_id = a.id
            WHERE a.title ILIKE $1
            GROUP BY a.id, a.title
            LIMIT 8
        `;

        const [songsResult, artistsResult, animesResult] = await Promise.all([
            query(songsQueryStr, songValues),
            query(artistsQueryStr, [`%${q}%`]),
            query(animesQueryStr, [`%${q}%`])
        ]);

        res.status(200).json({ 
            success: true, 
            data: {
                songs: songsResult.rows,
                artists: artistsResult.rows,
                animes: animesResult.rows
            } 
        });

    } catch (err) {
        console.error("Global Search error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getGlobalSearch };