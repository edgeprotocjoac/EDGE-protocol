import { Router } from 'express';
import {
  getProfileHandler,
  getProfileByWalletHandler,
  upsertProfileHandler,
  followHandler,
  unfollowHandler,
  checkFollowStatusHandler,
  getFollowersHandler,
  getFollowingHandler,
} from '../controllers/profileController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Profile endpoints
router.get('/wallet/:walletAddress', requireAuth, getProfileByWalletHandler);
router.get('/:handle', getProfileHandler);
router.post('/', requireAuth, upsertProfileHandler);

// Follow endpoints
router.post('/follow', requireAuth, followHandler);
router.delete('/follow', requireAuth, unfollowHandler);
router.get('/follow/status', requireAuth, checkFollowStatusHandler);
router.get('/:id/followers', getFollowersHandler);
router.get('/:id/following', getFollowingHandler);

export default router;
