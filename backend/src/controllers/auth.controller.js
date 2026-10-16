import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const login = asyncHandler(async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const admin = username ? await Admin.findOne({ username }) : null;

  if (!admin || !(await admin.checkPassword(password))) {
    throw new HttpError(401, 'ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে।');
  }
  const token = jwt.sign({ type: 'admin', username: admin.username }, env.jwtSecret, {
    subject: String(admin._id),
    expiresIn: '7d',
  });
  res.json({ token, admin: { id: admin._id, username: admin.username } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword = '', newPassword = '', confirmPassword = '' } = req.body;
  const admin = await Admin.findById(req.admin.id);
  if (!admin) throw new HttpError(401, 'এডমিন পাওয়া যায়নি।');

  if (!(await admin.checkPassword(currentPassword))) throw new HttpError(400, 'বর্তমান পাসওয়ার্ড ভুল।');
  if (newPassword.length < 8) throw new HttpError(400, 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
  if (newPassword !== confirmPassword) throw new HttpError(400, 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');

  admin.passwordHash = await Admin.hash(newPassword);
  await admin.save();
  res.json({ message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।' });
});
