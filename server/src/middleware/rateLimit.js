import rateLimit from 'express-rate-limit';

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

// পাসওয়ার্ড অনুমান ঠেকাতে
export const loginLimiter = make(15, 10, 'অনেকবার চেষ্টা করেছেন, ১৫ মিনিট পরে আবার চেষ্টা করুন।');
// স্প্যাম ঠেকাতে (ভর্তি ফর্ম, রিভিউ, কুইজ জমা)
export const formLimiter = make(60, 30, 'অনেক বেশি অনুরোধ হয়েছে, কিছুক্ষণ পরে চেষ্টা করুন।');
