import express from 'express';
import homeController from '../controllers/homeController.js';
const router = express.Router();

router.get('/data', homeController.getPublicHomeData);

export default router;