import { Review } from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

// অপেক্ষমাণ রিভিউ আগে, তারপর নতুন থেকে পুরনো
export const list = asyncHandler(async (_req, res) => {
  res.json(await Review.find().sort({ isApproved: 1, createdAt: -1 }));
});

export const approve = asyncHandler(async (req, res) => {
  const item = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!item) throw new HttpError(404, 'রিভিউ পাওয়া যায়নি।');
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Review.findByIdAndDelete(req.params.id);
  if (!item) throw new HttpError(404, 'রিভিউ পাওয়া যায়নি।');
  res.json({ message: 'রিভিউ মুছে ফেলা হয়েছে।' });
});
