import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// HE BOT SHIELD: Max 3 requests per hour per IP address
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // limit each IP to 3 requests per windowMs
    message: { success: false, message: 'You have reached the maximum number of messages. Please try again later.' },
    standardHeaders: true, 
    legacyHeaders: false,
});

// Apply the limiter ONLY to the contact endpoint
router.post('/', contactLimiter, submitContactForm);

export default router;