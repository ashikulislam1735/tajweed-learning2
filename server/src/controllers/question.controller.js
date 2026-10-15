import { parse } from 'csv-parse/sync';
import { Quiz } from '../models/Quiz.js';
import { Question } from '../models/Question.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { pick } from '../utils/pick.js';
import { toCsv } from '../utils/csv.js';

const FIELDS = ['questionText', 'optionA', 'optionB', 'optionC', 'optionD', 'correctOption'];

async function findQuizOr404(id) {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new HttpError(404, 'কুইজ পাওয়া যায়নি।');
  return quiz;
}

export const listForQuiz = asyncHandler(async (req, res) => {
  const quiz = await findQuizOr404(req.params.quizId);
  const questions = await Question.find({ quizId: quiz._id }).sort({ _id: 1 });
  res.json({ quiz, questions });
});

export const create = asyncHandler(async (req, res) => {
  const quiz = await findQuizOr404(req.params.quizId);
  const data = pick(req.body, FIELDS);
  data.quizId = quiz._id;
  if (req.file) {
    const { url, publicId } = await uploadImage(req.file.buffer, 'questions');
    data.imageUrl = url;
    data.imagePublicId = publicId;
  }
  res.status(201).json(await Question.create(data));
});

export const update = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) throw new HttpError(404, 'প্রশ্ন পাওয়া যায়নি।');
  Object.assign(question, pick(req.body, FIELDS));

  if (req.file) {
    const oldId = question.imagePublicId;
    const { url, publicId } = await uploadImage(req.file.buffer, 'questions');
    question.imageUrl = url;
    question.imagePublicId = publicId;
    await deleteImage(oldId);
  } else if (req.body.removeImage === 'true') {
    await deleteImage(question.imagePublicId);
    question.imageUrl = '';
    question.imagePublicId = '';
  }
  await question.save();
  res.json(question);
});

export const remove = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) throw new HttpError(404, 'প্রশ্ন পাওয়া যায়নি।');
  await deleteImage(question.imagePublicId);
  res.json({ message: 'প্রশ্ন মুছে ফেলা হয়েছে।' });
});

// CSV থেকে একসাথে অনেক প্রশ্ন: প্রশ্ন, A, B, C, D, সঠিক উত্তর
export const bulkUpload = asyncHandler(async (req, res) => {
  const quiz = await findQuizOr404(req.params.quizId);
  if (!req.file) throw new HttpError(400, 'একটা .csv ফাইল দিন।');

  let rows;
  try {
    rows = parse(req.file.buffer, { bom: true, skip_empty_lines: true, relax_column_count: true, from_line: 2 });
  } catch {
    throw new HttpError(400, 'CSV ফাইলটা পড়া যায়নি। ফরম্যাট ঠিক আছে কিনা দেখুন।');
  }

  const docs = [];
  let skipped = 0;
  for (const r of rows) {
    const [questionText, a, b, c, d, correct] = r.map((x) => String(x ?? '').trim());
    const correctOption = (correct || '').toUpperCase();
    if (!questionText || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correctOption)) {
      skipped += 1;
      continue;
    }
    docs.push({ quizId: quiz._id, questionText, optionA: a, optionB: b, optionC: c, optionD: d, correctOption });
  }
  if (docs.length) await Question.insertMany(docs);
  res.json({ added: docs.length, skipped });
});

export const template = asyncHandler(async (_req, res) => {
  const csv = toCsv(
    ['প্রশ্ন', 'অপশন A', 'অপশন B', 'অপশন C', 'অপশন D', 'সঠিক উত্তর (A/B/C/D)'],
    [
      ['এটা কোন হরফ? ا', 'আলিফ', 'বা', 'তা', 'ছা', 'A'],
      ['ইখফার হরফ কয়টি?', '৫', '১০', '১৫', '২০', 'C'],
    ]
  );
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="quiz_questions_template.csv"' });
  res.send(csv);
});
