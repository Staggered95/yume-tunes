import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

// The new unified endpoint
router.get('/', searchController.getGlobalSearch);

export default router;