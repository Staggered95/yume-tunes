import express from 'express';
import genreController from '../controllers/genreController.js';
const router = express.Router();

router.get('/', genreController.getGenreList);

export default router;