import { Router } from 'express';
import { getUserStats, loginUser, signupUser, verifyEmail, verify2FA, getAuthUser } from '../controllers/user.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signupUser);
router.post('/verify-email', verifyEmail);
router.post('/verify-2fa', verify2FA);
router.post('/activate-2fa', verify2FA);
router.post('/login', loginUser);
router.get('/me', requireAuth, getAuthUser);
router.get('/:address', getUserStats);

export default router;
