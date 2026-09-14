import { Router } from 'express';
import { getUserPortfolio } from '../controllers/portfolio.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/:address', requireAuth, getUserPortfolio);

export default router;
