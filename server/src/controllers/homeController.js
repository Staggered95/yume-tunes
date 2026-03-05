import { query } from '../config/db.js';

const getPublicHomeData = async (req, res) => {
    // 1. Trending Songs
    const trendingQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.file_path, s.lyrics, ar.name AS artist,
            COUNT(lh.id) as recent_plays
        FROM songs s 
        JOIN artists ar ON s.artist_id = ar.id
        -- LEFT JOIN ensures we still get songs even if they have 0 plays
        LEFT JOIN listening_history lh 
            ON s.id = lh.song_id 
            AND lh.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY s.id, s.title, s.cover_path, s.file_path, s.lyrics, ar.name
        ORDER BY recent_plays DESC, s.id DESC 
        LIMIT 10
    `;

    // 2. This Season
    const seasonQuery = `
        SELECT s.id, s.title, s.cover_path, s.file_path, s.lyrics, ar.name AS artist
        FROM songs s JOIN artists ar ON s.artist_id = ar.id
        WHERE s.song_type IN ('OP', 'ED') ORDER BY RANDOM() LIMIT 10
    `;

    // 3. Quotes (Active Only)
    const quotesQuery = `SELECT quote_text, author, anime, quote_type FROM quotes WHERE is_active = true`;

    // 4. Hero Banners (Active Only, ordered by display_order)
    const bannersQuery = `SELECT id, title, subtitle, image_path, target_url FROM hero_banners WHERE is_active = true ORDER BY display_order ASC`;

    try {
        // Run all 4 queries simultaneously!
        const [trending, season, quotes, banners] = await Promise.all([
            query(trendingQuery),
            query(seasonQuery),
            query(quotesQuery),
            query(bannersQuery)
        ]);

        // Send one beautiful, consolidated payload
        res.status(200).json({ 
            success: true, 
            data: {
                trending: trending.rows,
                thisSeason: season.rows,
                quotes: quotes.rows,
                banners: banners.rows
            }
        });
    } catch (err) {
        console.error("Home Data Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getPublicHomeData };