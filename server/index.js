const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve static files (Crucial for Arch!)
// This makes http://localhost:5000/audio/song.mp3 work
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// 2. Database Connection
const pool = new Pool({
  user: 'Shubham',
  host: 'localhost',
  database: 'yume_db',
  password: 'Staggered@95',
  port: 5432,
});

// 3. API Route: Get All Songs
app.get('/api/songs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.title, 
        art.name AS artist, 
        ani.title AS anime, 
        s.genre, 
        s.duration_seconds, 
        s.file_path, 
        s.cover_path,
        s.lyrics
      FROM songs s
      JOIN artists art ON s.artist_id = art.id
      JOIN animes ani ON s.anime_id = ani.id
      WHERE s.id>50 AND s.id<100
      ORDER BY s.title ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🎧 YumeTunes Backend running on http://localhost:${PORT}`);
});
