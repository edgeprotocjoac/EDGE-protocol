import { Router } from 'express';
import { getUserStats, loginUser } from '../controllers/user.controller';

const router = Router();

router.post('/login', loginUser);
router.get('/:address', getUserStats);

export default router;
