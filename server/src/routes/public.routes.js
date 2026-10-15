import { Router } from 'express';
import * as pub from '../controllers/public.controller.js';
import { formLimiter } from '../middleware/rateLimit.js';

const router = Router();

// সবার জন্য খোলা (লগইন লাগে না)
router.get('/settings', pub.getSettings);
router.get('/home', pub.getHome);
router.get('/courses', pub.listCourses);
router.get('/teachers', pub.listTeachers);
router.get('/reviews', pub.listApprovedReviews);

router.post('/reviews', formLimiter, pub.submitReview);
router.post('/admissions', formLimiter, pub.submitAdmission);

router.get('/quizzes', pub.listQuizzes);
router.post('/quizzes/:id/start', formLimiter, pub.startQuiz);
router.post('/quizzes/:id/submit', formLimiter, pub.submitQuiz);

export default router;
