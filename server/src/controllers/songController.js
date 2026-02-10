import { query } from '../config/db.js';

const getAllSongs = async (req, res) => {
    const text = `SELECT * FROM songs';`
    try {
        const result = await query(text);
        res.status(200).json({success: true, data: result.rows});
    } catch (err) {
        console.log("Error fetching the songs", err);
        res.status(500).json({success: false, error: err.message});
    }
};

const getSongsByAnime = async (req, res) => {
    const title = req.query.title;
    const text = `SELECT * FROM songs WHERE title ILIKE $1`;
    const values = [`%${title}%`];

    try {
        const result = await query(text, values);
        res.status(200).json({success: true, data: result.rows});
    } catch (err) {
        console.log("Error fetching songs by anime", err);
        res.status(500).json({success: false, error: err.message});
    }
}

const getSongsByArtist = async (req, res) => {
    const artist = req.query.artist;
    const text = `SELECT * FROM songs WHERE artist = $1`;
    const values = [artist];

    try {
        const result = await query(text, values);
        res.status(200).json({success: true, data: result.rows});
    } catch (err) {
        console.log("Error fetching songs by artist", err);
        res.status(500).json({success: false, error: err.message});
    }
}

const getSongsByGenre = async (req, res) => {
    //gives an array if multiple query (?genre=happy&genre=sad) otherwise single if one
    const genre = req.query.genre;
    const text = `SELECT * FROM songs WHERE genre = ANY($1)`;
    const values = Array.isArray(genre) ? genre : [genre];

    try {
        const result = await query(text, values);
        res.status(200).json({success: true, data: result.rows});
    } catch (err) {
        console.log("Error fetching songs by genre", err);
        res.status(500).json({success: false, error: err.message});
    }
}

export default {getAllSongs, getSongsByAnime, getSongsByArtist, getSongsByGenre};

