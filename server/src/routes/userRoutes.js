import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import userController from '../controllers/userController.js';
import telemetryController from '../controllers/telemetryController.js';

import upload from '../middleware/upload.js';
import bannerUpload from '../middleware/bannerUpload.js'; 

const router = express.Router();

router.use(verifyToken);
router.get('/likedsongs', userController.getLikedSongs);
router.get('/likedsongs/minimal', userController.getLikedSongsMinimalData);
router.get('/', userController.getUserDetails);
router.post('/telemetry', telemetryController.logListenEvent);
router.get('/home-data', userController.getUserHomeData);
router.get('/history', userController.getListeningHistory);

router.post('/upload-avatar', upload.single('user_image'), userController.uploadAvatar);

router.post('/upload-banner', bannerUpload.single('banner_image'), userController.uploadBanner);

router.put('/update', userController.updateProfile);
router.post('/likedsongs/:id', userController.toggleLikeSong);

export default router;