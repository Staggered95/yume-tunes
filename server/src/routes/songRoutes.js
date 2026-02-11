import express from 'express';
import songController from '../controllers/songController.js';
const router = express.Router();

router.get('/all', songController.getAllSongs);
router.get('/anime', songController.getSongsByAnime);
router.get('/artist', songController.getSongsByArtist);
router.get('/genre', songController.getSongsByGenre);

export default router;