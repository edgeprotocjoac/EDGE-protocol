import { Router } from 'express';
import { createOrder, cancelOrder, getMarketOrders } from '../controllers/order.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, createOrder);
router.delete('/:id', requireAuth, cancelOrder);
router.get('/:marketId', getMarketOrders);

export default router;
