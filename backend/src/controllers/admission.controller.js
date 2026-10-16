import { Admission } from '../models/Admission.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const list = asyncHandler(async (_req, res) => {
  res.json(await Admission.find().sort({ createdAt: -1 }));
});

export const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) throw new HttpError(400, 'স্ট্যাটাস সঠিক নয়।');
  const item = await Admission.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) throw new HttpError(404, 'আবেদন পাওয়া যায়নি।');
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Admission.findByIdAndDelete(req.params.id);
  if (!item) throw new HttpError(404, 'আবেদন পাওয়া যায়নি।');
  res.json({ message: 'আবেদন মুছে ফেলা হয়েছে।' });
});
