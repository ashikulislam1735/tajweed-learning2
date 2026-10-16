import { Router } from 'express';
import publicRoutes from './public.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use('/public', publicRoutes); // ওয়েবসাইটের জন্য
router.use('/auth', authRoutes); // এডমিন লগইন
router.use('/admin', requireAdmin, adminRoutes); // এডমিন প্যানেল (লগইন লাগবে)

export default router;
