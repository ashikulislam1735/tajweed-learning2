import { Quiz } from '../models/Quiz.js';
import { Question } from '../models/Question.js';
import { QuizResult } from '../models/QuizResult.js';
import { deleteImage } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { pick } from '../utils/pick.js';

const FIELDS = ['title', 'description', 'timeLimitMinutes', 'isActive'];

export const list = asyncHandler(async (_req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
  const ids = quizzes.map((q) => q._id);
  const [qCounts, rCounts] = await Promise.all([
    Question.aggregate([{ $match: { quizId: { $in: ids } } }, { $group: { _id: '$quizId', n: { $sum: 1 } } }]),
    QuizResult.aggregate([{ $match: { quizId: { $in: ids } } }, { $group: { _id: '$quizId', n: { $sum: 1 } } }]),
  ]);
  const qMap = new Map(qCounts.map((c) => [String(c._id), c.n]));
  const rMap = new Map(rCounts.map((c) => [String(c._id), c.n]));
  res.json(
    quizzes.map((q) => ({
      ...q,
      questionCount: qMap.get(String(q._id)) || 0,
      attemptCount: rMap.get(String(q._id)) || 0,
    }))
  );
});

export const getOne = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  res.json(quiz);
});

export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (!data.title) throw new HttpError(400, 'কুইজের নাম দিন।');
  res.status(201).json(await Quiz.create(data));
});

export const update = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.title === '') throw new HttpError(400, 'কুইজের নাম খালি রাখা যাবে না।');
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  res.json(quiz);
});

export const toggle = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  quiz.isActive = !quiz.isActive;
  await quiz.save();
  res.json(quiz);
});

// কুইজ মুছলে তার সব প্রশ্ন, প্রশ্নের ছবি ও ফলাফলও মুছে যায়
export const remove = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  const questions = await Question.find({ quizId: quiz._id });
  await Promise.all(questions.map((q) => deleteImage(q.imagePublicId)));
  await Question.deleteMany({ quizId: quiz._id });
  await QuizResult.deleteMany({ quizId: quiz._id });
  res.json({ message: 'কুইজ ও এর সব প্রশ্ন/ফলাফল মুছে ফেলা হয়েছে।' });
});
