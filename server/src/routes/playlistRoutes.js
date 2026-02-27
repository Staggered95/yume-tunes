import express from 'express';
import playlistController from '../controllers/playlistController.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

router.use(verifyToken);

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.post('/:playlistId/songs', playlistController.addToPlaylist);
router.delete('/:playlistId/songs/:songId', playlistController.deleteFromPlaylist);
router.delete('/:id', playlistController.deletePlaylist);

export default router;