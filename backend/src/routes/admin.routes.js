import { Router } from 'express';
import { imageUpload, csvUpload } from '../middleware/upload.js';
import * as dashboard from '../controllers/dashboard.controller.js';
import * as teachers from '../controllers/teacher.controller.js';
import * as courses from '../controllers/course.controller.js';
import * as admissions from '../controllers/admission.controller.js';
import * as reviews from '../controllers/review.controller.js';
import * as quizzes from '../controllers/quiz.controller.js';
import * as questions from '../controllers/question.controller.js';
import * as results from '../controllers/result.controller.js';
import * as settings from '../controllers/settings.controller.js';

// এই রাউটারটা routes/index.js এ requireAdmin গার্ডের পিছনে বসানো আছে
const router = Router();

router.get('/dashboard', dashboard.stats);

router.get('/teachers', teachers.list);
router.post('/teachers', imageUpload.single('photo'), teachers.create);
router.put('/teachers/:id', imageUpload.single('photo'), teachers.update);
router.delete('/teachers/:id', teachers.remove);

router.get('/courses', courses.list);
router.post('/courses', courses.create);
router.put('/courses/:id', courses.update);
router.delete('/courses/:id', courses.remove);

router.get('/admissions', admissions.list);
router.patch('/admissions/:id/status', admissions.setStatus);
router.delete('/admissions/:id', admissions.remove);

router.get('/reviews', reviews.list);
router.patch('/reviews/:id/approve', reviews.approve);
router.delete('/reviews/:id', reviews.remove);

router.get('/quizzes', quizzes.list);
router.get('/quizzes/:id', quizzes.getOne);
router.post('/quizzes', quizzes.create);
router.put('/quizzes/:id', quizzes.update);
router.patch('/quizzes/:id/toggle', quizzes.toggle);
router.delete('/quizzes/:id', quizzes.remove);

router.get('/question-template', questions.template);
router.get('/quizzes/:quizId/questions', questions.listForQuiz);
router.post('/quizzes/:quizId/questions', imageUpload.single('image'), questions.create);
router.post('/quizzes/:quizId/questions/bulk', csvUpload.single('file'), questions.bulkUpload);
router.put('/questions/:id', imageUpload.single('image'), questions.update);
router.delete('/questions/:id', questions.remove);

router.get('/quizzes/:quizId/results', results.list);
router.get('/quizzes/:quizId/results/export', results.exportCsv);

router.get('/settings', settings.get);
router.put('/settings', settings.update);

export default router;
