import express from 'express';
import songController from '../controllers/songController.js';
const router = express.Router();

// Specific routes first
router.get('/all', songController.getAllSongs);
router.get('/search', songController.getSearchResults); // Good!
router.get('/artist/:name', songController.getSongsByArtist);
router.get('/genre', songController.getSongsByGenre);
router.get('/anime/:title', songController.getSongsByAnime);


// Parameterized routes (IDs) MUST go at the very bottom
// router.get('/:id', songController.getSongById); 

export default router;