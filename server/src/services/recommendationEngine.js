import { query } from '../config/db.js'; 

export const generateRecommendations = async () => {
    console.log("⚙️ Starting Recommendation Engine...");

    try {
        const activeUsersRes = await query(`SELECT DISTINCT user_id FROM listening_history`);
        const users = activeUsersRes.rows;

        for (const user of users) {
            const userId = user.user_id;
            console.log(`Processing recommendations for User: ${userId}`);

            const topArtistsRes = await query(`
                SELECT s.artist_id, COUNT(lh.id) as positive_listens
                FROM listening_history lh
                JOIN songs s ON lh.song_id = s.id
                WHERE lh.user_id = $1 
                  AND lh.was_skipped = false 
                  AND (lh.listened_seconds::float / NULLIF(lh.duration_seconds, 0)) > 0.5
                GROUP BY s.artist_id
                ORDER BY positive_listens DESC
                LIMIT 3
            `, [userId]);

            if (topArtistsRes.rows.length === 0) continue; 

            const topArtistIds = topArtistsRes.rows.map(row => row.artist_id);

            const recommendationsRes = await query(`
                SELECT id as song_id
                FROM songs
                WHERE artist_id = ANY($1::int[])
                  AND id NOT IN (
                      -- Exclude songs they have already listened to
                      SELECT song_id FROM listening_history WHERE user_id = $2
                  )
                LIMIT 10
            `, [topArtistIds, userId]);

            const newSongsToRecommend = recommendationsRes.rows;

            if (newSongsToRecommend.length > 0) {
                await query(`DELETE FROM user_recommendations WHERE user_id = $1`, [userId]);

                for (const rec of newSongsToRecommend) {
                    await query(`
                        INSERT INTO user_recommendations (user_id, song_id, affinity_score) 
                        VALUES ($1, $2, $3)
                    `, [userId, rec.song_id, 10]); 
                }
            }
        }

        console.log("✅ Recommendation Engine run complete!");

    } catch (err) {
        console.error("❌ Recommendation Engine Failed: ", err);
    }
};

