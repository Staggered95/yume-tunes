import express from 'express';
import songController from '../controllers/songController.js';
const router = express.Router();

// Specific routes first
router.get('/all', songController.getAllSongs);
router.get('/search', songController.getSearchResults); // Good!
router.get('/anime', songController.getSongsByAnime);
router.get('/artist', songController.getSongsByArtist);
router.get('/genre', songController.getSongsByGenre);

// Parameterized routes (IDs) MUST go at the very bottom
// router.get('/:id', songController.getSongById); 

export default router;