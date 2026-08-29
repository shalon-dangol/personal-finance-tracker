import express from 'express';
const router = express.Router();
import { getSummary } from '../features/analytics/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);
router.get('/summary', getSummary);

export default router;
