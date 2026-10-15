import multer from 'multer';
import { HttpError } from '../utils/httpError.js';

const memory = multer.memoryStorage();

// ছবি: সর্বোচ্চ ২ MB, শুধু jpg/png/webp
export const imageUpload = multer({
  storage: memory,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new HttpError(400, 'শুধু JPG, PNG বা WEBP ছবি দেওয়া যাবে।'), ok);
  },
});

// CSV: সর্বোচ্চ ১ MB
export const csvUpload = multer({
  storage: memory,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.originalname.toLowerCase().endsWith('.csv');
    cb(ok ? null : new HttpError(400, 'শুধু .csv ফাইল দেওয়া যাবে।'), ok);
  },
});
