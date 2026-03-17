import express from 'express';
import songController from '../controllers/songController.js';
const router = express.Router();

router.get('/all', songController.getAllSongs);
router.get('/search', songController.getSearchResults); 
router.get('/artist/:name', songController.getSongsByArtist);
router.get('/genre', songController.getSongsByGenre);
router.get('/anime/:title', songController.getSongsByAnime);



export default router;