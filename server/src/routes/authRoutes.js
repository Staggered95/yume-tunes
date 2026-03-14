import express from 'express';
import authController from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:id/:token', authController.resetPassword);

export default router;