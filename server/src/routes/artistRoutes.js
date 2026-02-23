import express from 'express';
import artistController from '../controllers/artistController.js';
const router = express.Router();

router.get('/', artistController.getArtists);
router.get('/:name', artistController.getArtistDetails);

export default router;