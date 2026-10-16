# ফিচার তালিকা ও MySQL → MongoDB ম্যাপ

## ওয়েবসাইট (frontend)
- হোম: হিরো, ছাত্র সংখ্যা (সেটিংসের শুরুর মান + অনুমোদিত ভর্তি), মাখরাজ হরফ, নামাজের সময় (Aladhan), ৩ কোর্স, ৪ শিক্ষক, ৩ রিভিউ
- কোর্সসমূহ, শিক্ষকবৃন্দ
- ভর্তি ফর্ম (ডাটাবেজে সেভ + WhatsApp এ পাঠানো)
- যোগাযোগ (ঠিকানা, ম্যাপ, রিভিউ জমা)
- কুইজ: তালিকা → নাম দিয়ে শুরু → একটা একটা প্রশ্ন → টাইমার → ফলাফল → PDF

## এডমিন প্যানেল (admin)
- লগইন, পাসওয়ার্ড পরিবর্তন
- ড্যাশবোর্ড
- শিক্ষক / কোর্স: যোগ, এডিট, ডিলিট (শিক্ষকের ছবিসহ)
- ভর্তি আবেদন: অনুমোদন, বাতিল, ডিলিট
- রিভিউ: অনুমোদন, ডিলিট
- কুইজ: তৈরি, এডিট, সক্রিয়/নিষ্ক্রিয়, ডিলিট
- প্রশ্ন: একটা একটা করে (ছবিসহ) বা CSV থেকে বাল্ক
- ফলাফল দেখা ও CSV এক্সপোর্ট
- সেটিংস (ফোন, WhatsApp, ইমেইল, ঠিকানা, ম্যাপ, সোশ্যাল লিংক, ছাত্র সংখ্যার শুরুর মান)

## পুরনো PHP থেকে যা বদলেছে
| বিষয় | আগে (PHP) | এখন (MERN) |
|---|---|---|
| ডাটাবেজ | MySQL, ৯টা টেবিল | MongoDB, ৯টা কালেকশন |
| লগইন | PHP সেশন | JWT টোকেন (৭ দিন) |
| ডিলিট/অনুমোদন | সাধারণ লিংক (GET) | DELETE/PATCH রিকোয়েস্ট, লগইন টোকেন লাগে |
| ছবি | সার্ভারের uploads ফোল্ডার | Cloudinary |
| কুইজের সময় | শুধু ব্রাউজারে | সার্ভারও যাচাই করে (টোকেনে শুরুর সময়) |
| ডিফল্ট এডমিন | admin / admin123 কোডে লেখা | আপনার নিজের পাসওয়ার্ড (.env থেকে, seed এর সময়) |
| ছাত্র সংখ্যার ১২০০ | কোডে বসানো | সেটিংসে বদলানো যায় |

## কালেকশন
| MongoDB | আগের MySQL টেবিল |
|---|---|
| admins | admins |
| teachers | teachers |
| courses | courses |
| admissions | admissions |
| reviews | reviews |
| quizzes | quizzes |
| questions | questions (quizId দিয়ে যুক্ত) |
| quizresults | quiz_results |
| settings | settings (একটাই ডকুমেন্ট) |

## API এক নজরে (/api/v1)
- সবার জন্য: `GET /public/home|settings|courses|teachers|reviews|quizzes`, `POST /public/admissions|reviews`, `POST /public/quizzes/:id/start|submit`
- এডমিন লগইন: `POST /auth/login`, `GET /auth/me`, `PUT /auth/password`
- এডমিন (Bearer টোকেন লাগে): `/admin/dashboard|teachers|courses|admissions|reviews|quizzes|questions|settings` — সব `backend/src/routes/admin.routes.js` এ দেখুন
