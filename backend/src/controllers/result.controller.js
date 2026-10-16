import { Quiz } from '../models/Quiz.js';
import { QuizResult } from '../models/QuizResult.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { toCsv } from '../utils/csv.js';

async function load(quizId) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  const results = await QuizResult.find({ quizId }).sort({ createdAt: -1 });
  return { quiz, results };
}

export const list = asyncHandler(async (req, res) => {
  res.json(await load(req.params.quizId));
});

export const exportCsv = asyncHandler(async (req, res) => {
  const { quiz, results } = await load(req.params.quizId);
  const rows = results.map((r) => [
    r.studentName,
    r.studentClass,
    r.score,
    r.totalQuestions,
    (r.totalQuestions ? Math.round((r.score / r.totalQuestions) * 100) : 0) + '%',
    r.timeTakenSeconds,
    r.createdAt.toISOString(),
  ]);
  const csv = toCsv(['নাম', 'ক্লাস/রোল', 'স্কোর', 'মোট প্রশ্ন', 'শতাংশ', 'সময় (সেকেন্ড)', 'তারিখ'], rows);
  res.set({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="quiz_results_${quiz._id}.csv"`,
  });
  res.send(csv);
});
