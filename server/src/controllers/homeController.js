import { query } from '../config/db.js';

const getPublicHomeData = async (req, res) => {
    // 1. Trending Songs (Last 30 days)
    const trendingQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.file_path, s.lyrics, 
            ar.name AS artist, a.title AS anime,
            COUNT(lh.id) as recent_plays
        FROM songs s 
        JOIN artists ar ON s.artist_id = ar.id
        JOIN animes a ON s.anime_id = a.id
        LEFT JOIN listening_history lh 
            ON s.id = lh.song_id 
            AND lh.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY s.id, s.title, s.cover_path, s.file_path, s.lyrics, ar.name, a.title
        ORDER BY recent_plays DESC, s.id DESC 
        LIMIT 10
    `;

    // 2. This Season (Randomized OPs/EDs)
    const seasonQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.file_path, s.lyrics, 
            ar.name AS artist, a.title AS anime
        FROM songs s 
        JOIN artists ar ON s.artist_id = ar.id
        JOIN animes a ON s.anime_id = a.id
        WHERE s.song_type IN ('OP', 'ED') 
        ORDER BY RANDOM() 
        LIMIT 10
    `;

    // 3. Quotes (Optimized Mixed Pool)
    const quotesQuery = `
        (SELECT quote_text, author, anime, quote_type 
         FROM quotes WHERE quote_type = 'normal' AND is_active = true 
         ORDER BY RANDOM() LIMIT 10)
        UNION ALL
        (SELECT quote_text, author, anime, quote_type 
         FROM quotes WHERE quote_type = 'special' AND is_active = true 
         ORDER BY RANDOM() LIMIT 10)
    `;

    // 4. Hero Banners
    const bannersQuery = `
        SELECT id, title, subtitle, image_path, target_url 
        FROM hero_banners 
        WHERE is_active = true 
        ORDER BY display_order ASC
    `;

    // 5. Recently Added (Newest to the Database)
    const latestQuery = `
        SELECT 
            s.id, s.title, s.cover_path, s.file_path, s.lyrics, 
            ar.name AS artist, a.title AS anime
        FROM songs s 
        JOIN artists ar ON s.artist_id = ar.id
        JOIN animes a ON s.anime_id = a.id
        ORDER BY s.id DESC 
        LIMIT 10
    `;

    try {
        // Fire all 5 queries concurrently!
        const [trending, season, quotes, banners, latest] = await Promise.all([
            query(trendingQuery),
            query(seasonQuery),
            query(quotesQuery),
            query(bannersQuery),
            query(latestQuery)
        ]);

        res.status(200).json({ 
            success: true, 
            data: {
                trending: trending.rows,
                thisSeason: season.rows,
                quotes: quotes.rows,
                banners: banners.rows,
                latest: latest.rows 
            }
        });
    } catch (err) {
        console.error("Home Data Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export default { getPublicHomeData };