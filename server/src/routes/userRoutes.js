import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import userController from '../controllers/userController.js';
const router = express.Router();

router.use(verifyToken);
router.get('/likedsongs', userController.getLikedSongs);
router.get('/likedsongs/minimal', userController.getLikedSongsMinimalData);
router.get('/', userController.getUserDetails);
router.post('/likedsongs/:id', userController.toggleLikeSong);


export default router;