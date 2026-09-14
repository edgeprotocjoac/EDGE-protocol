import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/:userId', requireAuth, NotificationController.getNotifications);
router.post('/:id/read', requireAuth, NotificationController.markAsRead);

export default router;
