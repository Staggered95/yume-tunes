import express from 'express';
import adminController from '../controllers/adminController.js';
import verifyToken from '../middleware/verifyToken.js';
import songUpload from '../middleware/songUpload.js';

const router = express.Router();

// 1. Protect all admin routes (Only logged in users get past this line)
// NOTE: In the future, you should add an `isAdmin` middleware right after this!
router.use(verifyToken);

// 2. Tell Multer exactly what file inputs to expect from the React form
const uploadFields = songUpload.fields([
    { name: 'audio_file', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
]);

// 3. The Routes
// GET all songs (Feeds your SongManager.jsx table)
router.get('/songs', adminController.getAllSongs);

// POST a new song (Intercepted by Multer first!)
router.post('/songs', uploadFields, adminController.addSong);

// PUT (Update) an existing song (Also intercepted by Multer in case they change the cover)
router.put('/songs/:id', uploadFields, adminController.updateSong);

// DELETE a song
router.delete('/songs/:id', adminController.deleteSong);
router.put('/songs/:id/lyrics', adminController.updateLyrics);

export default router;