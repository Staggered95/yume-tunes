import express from 'express';
import adminController from '../controllers/adminController.js';
import contentController from '../controllers/contentController.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizeRoles from '../middleware/authorizeRoles.js';
import songUpload from '../middleware/songUpload.js';
import bannerUpload from '../middleware/bannerUpload.js';

const router = express.Router();

// 1. The First Bouncer: Must be logged in
router.use(verifyToken);

// Reusable Role Definitions
const adminAndMod = authorizeRoles('admin', 'moderator');
const adminOnly = authorizeRoles('admin');

// File Upload Configurations
const uploadFields = songUpload.fields([
    { name: 'audio_file', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
]);

// ==========================================
// USER MANAGEMENT (Strictly Admin Only)
// ==========================================
router.get('/users', adminOnly, adminController.getAllUsers);
router.put('/users/:id/role', adminOnly, adminController.updateUserRole);

// ==========================================
// ANALYTICS
// ==========================================
router.get('/analytics/dashboard', adminAndMod, adminController.getDashboardStats);

// ==========================================
// SONG MANAGEMENT
// ==========================================
router.get('/songs', adminAndMod, adminController.getAllSongs);
// Notice: Auth middleware runs BEFORE Multer!
router.post('/songs', adminAndMod, uploadFields, adminController.addSong);
router.put('/songs/:id', adminAndMod, uploadFields, adminController.updateSong);
router.put('/songs/:id/lyrics', adminAndMod, adminController.updateLyrics);
router.get('/songs/auto-lyrics', adminAndMod, adminController.autoGenerateLyrics);
// Destructive action: Admin only
router.delete('/songs/:id', adminOnly, adminController.deleteSong);

// ==========================================
// ANIME & ARTISTS MANAGEMENT
// ==========================================
router.get('/artists', verifyToken, adminAndMod, adminController.getAllArtists);
router.delete('/artists/:id', verifyToken, adminOnly, adminController.deleteArtist);
router.put('/artists/:id', verifyToken, adminOnly, adminController.updateArtist);
router.get('/animes', verifyToken, adminAndMod, adminController.getAllAnimes);
router.delete('/animes/:id', verifyToken, adminOnly, adminController.deleteAnime);
router.put('/animes/:id', verifyToken, adminOnly, adminController.updateAnime);

// ==========================================
// QUOTES MANAGEMENT
// ==========================================
router.get('/quotes', adminAndMod, contentController.getQuotes);
router.post('/quotes', adminAndMod, contentController.addQuote);
router.put('/quotes/:id', adminAndMod, contentController.editQuote);
router.put('/quotes/:id/toggle', adminAndMod, contentController.toggleQuoteStatus);
// Destructive action: Admin only
router.delete('/quotes/:id', adminOnly, contentController.deleteQuote);


// ==========================================
// BANNERS MANAGEMENT
// ==========================================
router.get('/banners', adminAndMod, contentController.getBanners);
// Auth middleware runs BEFORE bannerUpload!
router.post('/banners', adminAndMod, bannerUpload.single('banner_image'), contentController.addBanner);
router.put('/banners/:id/toggle', adminAndMod, contentController.toggleBannerStatus);
// Destructive action: Admin only
router.delete('/banners/:id', adminOnly, contentController.deleteBanner);

export default router;