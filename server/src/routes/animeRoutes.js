import express from 'express';
import animeController from "../controllers/animeController.js";
const router = express.Router();

router.get('/', animeController.getAllAnime);

export default router;