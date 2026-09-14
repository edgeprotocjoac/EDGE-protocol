import { Router } from 'express';
import { getUserStats, loginUser, signupUser, verifyEmail, getAuthUser } from '../controllers/user.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signupUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/me', requireAuth, getAuthUser);
router.get('/:address', getUserStats);

export default router;
