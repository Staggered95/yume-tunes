import express from 'express';
import authController from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, (req, res) => {
    // Because verifyToken ran first, req.user is guaranteed to exist here
    res.status(200).json({ 
        success: true, 
        message: "You made it past the Bouncer!", 
        user_id: req.user.id 
    });
});

export default router;