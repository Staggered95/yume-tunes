import { query } from '../config/db.js';

const getPublicHomeData = async (req, res) => {
    // Trending logic: Maybe songs with the most likes, or most listens globally
    const trendingQuery = `
        SELECT s.id, s.title, s.cover_path, s.file_path, ar.name AS artist
        FROM songs s
        JOIN artists ar ON s.artist_id = ar.id
        -- Example logic: order by highest ID for now, or join with likes table later
        ORDER BY s.id DESC 
        LIMIT 10
    `;

    // This Season logic: You could filter by a specific anime season or year
    const seasonQuery = `
        SELECT s.id, s.title, s.cover_path, s.file_path, ar.name AS artist
        FROM songs s
        JOIN artists ar ON s.artist_id = ar.id
        -- Example logic: maybe OP/ED only, or a specific anime
        WHERE s.song_type IN ('OP', 'ED')
        ORDER BY RANDOM() -- Just randomizing for now until you have a 'release_date' column
        LIMIT 10
    `;

    try {
        const [trending, season] = await Promise.all([
            query(trendingQuery),
            query(seasonQuery)
        ]);

        res.status(200).json({ 
            success: true, 
            data: {
                trending: trending.rows,
                thisSeason: season.rows
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getPublicHomeData };