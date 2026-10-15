import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', loginLimiter, auth.login);
router.get('/me', requireAdmin, auth.me);
router.put('/password', requireAdmin, auth.changePassword);

export default router;
