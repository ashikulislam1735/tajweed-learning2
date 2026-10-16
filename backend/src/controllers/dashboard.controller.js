import { Teacher } from '../models/Teacher.js';
import { Course } from '../models/Course.js';
import { Admission } from '../models/Admission.js';
import { Review } from '../models/Review.js';
import { Quiz } from '../models/Quiz.js';
import { QuizResult } from '../models/QuizResult.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (_req, res) => {
  const [teachers, courses, admissionsTotal, admissionsPending, reviewsPending, quizzes, quizAttempts, recentAdmissions] =
    await Promise.all([
      Teacher.countDocuments(),
      Course.countDocuments(),
      Admission.countDocuments(),
      Admission.countDocuments({ status: 'pending' }),
      Review.countDocuments({ isApproved: false }),
      Quiz.countDocuments(),
      QuizResult.countDocuments(),
      Admission.find().sort({ createdAt: -1 }).limit(5),
    ]);
  res.json({ teachers, courses, admissionsTotal, admissionsPending, reviewsPending, quizzes, quizAttempts, recentAdmissions });
});
