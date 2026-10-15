import { Course } from '../models/Course.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { pick } from '../utils/pick.js';

const FIELDS = ['title', 'levelNo', 'fee', 'duration', 'description', 'displayOrder'];

export const list = asyncHandler(async (_req, res) => {
  res.json(await Course.find().sort({ displayOrder: 1, createdAt: 1 }));
});

export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (!data.title) throw new HttpError(400, 'কোর্সের নাম দিন।');
  res.status(201).json(await Course.create(data));
});

export const update = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.title === '') throw new HttpError(400, 'কোর্সের নাম খালি রাখা যাবে না।');
  const course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!course) throw new HttpError(404, 'কোর্স পাওয়া যায়নি।');
  res.json(course);
});

export const remove = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new HttpError(404, 'কোর্স পাওয়া যায়নি।');
  res.json({ message: 'কোর্স মুছে ফেলা হয়েছে।' });
});
