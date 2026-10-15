import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

// এডমিন রুটগুলো এই গার্ডের ভিতর দিয়ে যায়: Authorization: Bearer <token>
export function requireAdmin(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'লগইন করুন।'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type !== 'admin') throw new Error('wrong token type');
    req.admin = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(new HttpError(401, 'সেশন শেষ হয়ে গেছে, আবার লগইন করুন।'));
  }
}
