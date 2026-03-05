import express from 'express';
import adminController from '../controllers/adminController.js';
import contentController from '../controllers/contentController.js';
import verifyToken from '../middleware/verifyToken.js';
import songUpload from '../middleware/songUpload.js';
import bannerUpload from '../middleware/bannerUpload.js';

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
router.get('/songs/auto-lyrics', adminController.autoGenerateLyrics);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);

// --- QUOTES ROUTES ---
router.get('/quotes', contentController.getQuotes);
router.post('/quotes', contentController.addQuote);
router.put('/quotes/:id/toggle', contentController.toggleQuoteStatus);
router.delete('/quotes/:id', contentController.deleteQuote);
router.put('/quotes/:id', contentController.editQuote);

// --- BANNERS ROUTES ---
// Notice how we use bannerUpload.single('banner_image') here!
router.get('/banners', contentController.getBanners);
router.post('/banners', bannerUpload.single('banner_image'), contentController.addBanner);
router.put('/banners/:id/toggle', contentController.toggleBannerStatus);
router.delete('/banners/:id', contentController.deleteBanner);

export default router;