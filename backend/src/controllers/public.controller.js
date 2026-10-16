import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Setting } from '../models/Setting.js';
import { Course } from '../models/Course.js';
import { Teacher } from '../models/Teacher.js';
import { Review } from '../models/Review.js';
import { Admission } from '../models/Admission.js';
import { Quiz } from '../models/Quiz.js';
import { Question } from '../models/Question.js';
import { QuizResult } from '../models/QuizResult.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { pick } from '../utils/pick.js';

export const getSettings = asyncHandler(async (_req, res) => {
  const s = await Setting.getSite();
  const { _id, __v, key, createdAt, updatedAt, ...publicFields } = s.toObject();
  res.json(publicFields);
});

export const getHome = asyncHandler(async (_req, res) => {
  const [site, approved, courses, teachers, reviews] = await Promise.all([
    Setting.getSite(),
    Admission.countDocuments({ status: 'approved' }),
    Course.find().sort({ displayOrder: 1, createdAt: 1 }).limit(3),
    Teacher.find().sort({ displayOrder: 1, createdAt: 1 }).limit(4),
    Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(3),
  ]);
  const teacherTotal = await Teacher.countDocuments();
  const courseTotal = await Course.countDocuments();
  res.json({
    liveStudentCount: site.baseStudentCount + approved,
    teacherTotal,
    courseTotal,
    courses,
    teachers,
    reviews,
  });
});

export const listCourses = asyncHandler(async (_req, res) => {
  res.json(await Course.find().sort({ displayOrder: 1, createdAt: 1 }));
});

export const listTeachers = asyncHandler(async (_req, res) => {
  res.json(await Teacher.find().sort({ displayOrder: 1, createdAt: 1 }));
});

export const listApprovedReviews = asyncHandler(async (_req, res) => {
  res.json(await Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(30));
});

export const submitReview = asyncHandler(async (req, res) => {
  const data = pick(req.body, ['name', 'reviewText']);
  if (!data.name || !data.reviewText) throw new HttpError(400, 'নাম ও মতামত দুটোই দিন।');
  // isApproved=false: এডমিন অনুমোদন না করা পর্যন্ত সাইটে দেখাবে না
  await Review.create({ ...data, isApproved: false });
  res.status(201).json({ message: 'ধন্যবাদ! আপনার রিভিউ পর্যালোচনার পর প্রকাশ করা হবে।' });
});

export const submitAdmission = asyncHandler(async (req, res) => {
  const data = pick(req.body, ['studentName', 'age', 'phone', 'courseInterested', 'message']);
  if (!data.studentName || !data.phone) throw new HttpError(400, 'ছাত্র/ছাত্রীর নাম ও ফোন নম্বর দিন।');
  await Admission.create(data);
  res.status(201).json({ message: 'আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।' });
});

// ---------------- কুইজ ----------------

export const listQuizzes = asyncHandler(async (_req, res) => {
  const quizzes = await Quiz.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  const counts = await Question.aggregate([
    { $match: { quizId: { $in: quizzes.map((q) => q._id) } } },
    { $group: { _id: '$quizId', n: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.n]));
  // প্রশ্ন নেই এমন কুইজ দেখাবো না
  const result = quizzes
    .map((q) => ({ ...q, questionCount: countMap.get(String(q._id)) || 0 }))
    .filter((q) => q.questionCount > 0);
  res.json(result);
});

// শুরু করলে একটা সাইন-করা টোকেন পাওয়া যায়, তাতে শুরুর সময় লেখা থাকে।
// জমা দেওয়ার সময় সার্ভার সেই সময় যাচাই করে, তাই ব্রাউজার ঘুরিয়ে সময় বাড়ানো যায় না।
export const startQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, isActive: true });
  if (!quiz) throw new HttpError(404, 'কুইজটি পাওয়া যায়নি বা এখন সক্রিয় নেই।');

  const studentName = String(req.body.studentName || '').trim().slice(0, 150);
  const studentClass = String(req.body.studentClass || '').trim().slice(0, 100);
  if (!studentName) throw new HttpError(400, 'আপনার নাম দিন।');

  const questions = await Question.find({ quizId: quiz._id }).sort({ _id: 1 });
  if (!questions.length) throw new HttpError(404, 'এই কুইজে এখনো কোনো প্রশ্ন নেই।');

  const startedAt = Date.now();
  const limitSeconds = quiz.timeLimitMinutes * 60;
  const token = jwt.sign({ type: 'quiz', quizId: String(quiz._id), studentName, studentClass, startedAt }, env.jwtSecret, {
    expiresIn: limitSeconds + 300,
  });

  res.json({
    token,
    startedAt,
    expiresAt: startedAt + limitSeconds * 1000,
    quiz: { id: quiz._id, title: quiz.title, description: quiz.description, timeLimitMinutes: quiz.timeLimitMinutes },
    // সঠিক উত্তর (correctOption) ইচ্ছা করেই পাঠানো হচ্ছে না
    questions: questions.map((q) => ({
      id: q._id,
      text: q.questionText,
      imageUrl: q.imageUrl,
      options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
    })),
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(String(req.body.token || ''), env.jwtSecret);
  } catch {
    throw new HttpError(400, 'কুইজের সময় শেষ বা সেশন অকার্যকর। আবার শুরু করুন।');
  }
  if (payload.type !== 'quiz' || payload.quizId !== req.params.id) throw new HttpError(400, 'কুইজ সেশন মেলেনি।');

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new HttpError(404, 'কুইজটি পাওয়া যায়নি।');

  const elapsed = Math.round((Date.now() - payload.startedAt) / 1000);
  const limitSeconds = quiz.timeLimitMinutes * 60;
  if (elapsed > limitSeconds + 30) throw new HttpError(400, 'সময় শেষ হয়ে গেছে, উত্তর গ্রহণ করা যায়নি।');

  const answers = req.body.answers && typeof req.body.answers === 'object' ? req.body.answers : {};
  const questions = await Question.find({ quizId: quiz._id }).sort({ _id: 1 });

  let score = 0;
  const wrong = [];
  for (const q of questions) {
    const given = answers[String(q._id)];
    if (given === q.correctOption) {
      score += 1;
    } else {
      wrong.push({
        question: q.questionText,
        given: given && q[`option${given}`] ? q[`option${given}`] : 'উত্তর দেওয়া হয়নি',
        correct: q[`option${q.correctOption}`],
      });
    }
  }

  const total = questions.length;
  const timeTaken = Math.min(elapsed, limitSeconds);
  await QuizResult.create({
    quizId: quiz._id,
    studentName: payload.studentName,
    studentClass: payload.studentClass,
    score,
    totalQuestions: total,
    timeTakenSeconds: timeTaken,
  });

  res.json({
    studentName: payload.studentName,
    quizTitle: quiz.title,
    score,
    total,
    percentage: total ? Math.round((score / total) * 100) : 0,
    timeTakenSeconds: timeTaken,
    wrong,
  });
});
