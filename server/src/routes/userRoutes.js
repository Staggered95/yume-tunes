import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import userController from '../controllers/userController.js';
const router = express.Router();

router.use(verifyToken);
router.get('/likedsongs', userController.getLikedSongs);
router.post('/likedsongs/:id', userController.toggleLikeSong);

export default router;