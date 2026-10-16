# Tajweed Learning Centre — MERN প্ল্যাটফর্ম

পুরনো PHP + MySQL সাইটের নতুন রূপ: **React** (ওয়েবসাইট ও এডমিন) + **Node/Express** (API) + **MongoDB**।
ছবি রাখা হয় **Cloudinary** তে। ডিপ্লয়: **Vercel** (ফ্রন্টএন্ড), **Render** (ব্যাকএন্ড), **MongoDB Atlas** (ডাটাবেজ)।

```
tajweed-platform/
├── frontend/          → পাবলিক ওয়েবসাইট (React + Vite)        → Vercel
│   └── src/
│       ├── pages/         → পেজ (হোম, কোর্স, কুইজ, ভর্তি...)
│       ├── components/    → ছোট ছোট অংশ (হেডার, কার্ড...)
│       ├── services/      → ব্যাকএন্ডের সাথে কথা বলার কোড
│       └── design/        → রং, ফন্ট, স্টাইল (শুধু ডিজাইন)
├── admin/             → এডমিন প্যানেল (একই কাঠামো)               → Vercel (আলাদা প্রজেক্ট)
├── backend/           → API (Express + Mongoose)                → Render
│   └── src/
│       ├── models/        → MongoDB এর ডাটা কাঠামো
│       ├── routes/        → URL এর তালিকা
│       ├── controllers/   → প্রতিটা কাজের লজিক
│       ├── middleware/    → লগইন চেক, ছবি আপলোড, এরর
│       └── config/        → ডাটাবেজ, Cloudinary, .env
├── database/legacy/   → পুরনো MySQL ফাইল (শুধু রেফারেন্স)
├── docs/FEATURES.md   → ফিচার তালিকা, API, MySQL→MongoDB ম্যাপ
└── render.yaml        → Render এর ঐচ্ছিক কনফিগ
```

> **গুরুত্বপূর্ণ:** কোড লেখার এনভায়রনমেন্টে ইন্টারনেট না থাকায় আমি `npm install` ও রান করে পরীক্ষা করতে পারিনি।
> সব ফাইলের সিনট্যাক্স যাচাই করা হয়েছে, কিন্তু প্রথমবার চালালে ছোটখাটো সমস্যা আসতে পারে। এলে এরর মেসেজটা কপি করে আমাকে দিন।

## ধাপ ১: কম্পিউটারে যা লাগবে
1. **Node.js 18+** (nodejs.org থেকে LTS)
2. **MongoDB Atlas** ফ্রি একাউন্ট → একটা Free Cluster বানান → Database Access এ ইউজার+পাসওয়ার্ড তৈরি → Network Access এ `0.0.0.0/0` যোগ → Connect → Drivers থেকে কানেকশন স্ট্রিং কপি
3. **Cloudinary** ফ্রি একাউন্ট → Dashboard থেকে Cloud name, API Key, API Secret (ছবি আপলোড না চাইলে এটা পরে করলেও চলবে)

## ধাপ ২: ব্যাকএন্ড চালু
```bash
cd backend
npm install
cp .env.example .env      # Windows এ: copy .env.example .env
```
`.env` খুলে মান বসান (MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD, Cloudinary)। তারপর:
```bash
npm run seed    # প্রথম এডমিন + নমুনা কোর্স তৈরি (একবারই)
npm run dev     # সার্ভার চালু: http://localhost:5000
```
ব্রাউজারে `http://localhost:5000/api/health` খুললে `{"ok":true,...}` দেখা গেলে ঠিক আছে।

## ধাপ ৩: ওয়েবসাইট ও এডমিন চালু (দুটো আলাদা টার্মিনালে)
```bash
cd frontend && npm install && cp .env.example .env && npm run dev      # http://localhost:5173
cd admin && npm install && cp .env.example .env && npm run dev    # http://localhost:5174
```
এডমিনে `ADMIN_USERNAME` / `ADMIN_PASSWORD` দিয়ে লগইন করুন।

## ধাপ ৪: GitHub এ আপলোড
```bash
git init
git add .
git commit -m "প্রথম কমিট"
git branch -M main
git remote add origin https://github.com/<আপনার-ইউজারনেম>/<রিপো-নাম>.git
git push -u origin main
```
`.env` ফাইল `.gitignore` এ আছে, তাই গোপন তথ্য যাবে না। আপলোডের পর GitHub এ গিয়ে দেখে নিন `.env` নেই।

## ধাপ ৫: ডিপ্লয়
**১) Render (ব্যাকএন্ড):** New → Web Service → GitHub রিপো বেছে নিন
- Root Directory: `backend`, Build Command: `npm install`, Start Command: `npm start`
- Environment এ বসান: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `NODE_ENV=production`
- `CLIENT_ORIGINS` এখন ফাঁকা রাখুন (ধাপ ৪ এ বসাবেন)
- ডিপ্লয় শেষে URL পাবেন, যেমন `https://tajweed-backend.onrender.com`
- প্রথম এডমিন বানাতে Render এর Shell থেকে একবার `npm run seed` চালান (ADMIN_USERNAME ও ADMIN_PASSWORD Environment এ দিয়ে)

**২) Vercel (ওয়েবসাইট):** Add New → Project → একই রিপো → Root Directory: `frontend` → Environment: `VITE_API_URL=https://<render-url>/api/v1`

**৩) Vercel (এডমিন):** আবার Add New → Project → একই রিপো → Root Directory: `admin` → একই `VITE_API_URL`

**৪) CORS ঠিক করা:** Render এ `CLIENT_ORIGINS` এ Vercel এর দুই URL কমা দিয়ে বসান (শেষে `/` ছাড়া):
`https://tajweed-web.vercel.app,https://tajweed-admin.vercel.app` — তারপর Render রিডিপ্লয় করুন।

## মনে রাখবেন
- Render ফ্রি প্ল্যানে ১৫ মিনিট ব্যবহার না হলে সার্ভার ঘুমিয়ে পড়ে; প্রথম রিকোয়েস্টে ৩০-৬০ সেকেন্ড লাগতে পারে।
- বাল্ক আপলোডের CSV অবশ্যই **CSV UTF-8** ফরম্যাটে সেভ করবেন, নাহলে বাংলা ভেঙে যাবে।
- PDF এ বাংলা যুক্তাক্ষর (যেমন ক্ষ, ত্র) jsPDF এর সীমাবদ্ধতায় কখনো ঠিকমতো না-ও বসতে পারে। পুরনো সাইটেও একই ছিল।
- কুইজ জমা দেওয়ার টোকেন সার্ভারে "একবার ব্যবহার" হিসেবে আটকানো হয়নি। শেখার জন্য ঠিক আছে; বাস্তবে ব্যবহারের আগে এটা যোগ করা ভালো।
- এডমিন টোকেন ব্রাউজারের localStorage এ থাকে (সহজ রাখতে)। পরে httpOnly কুকিতে নেওয়া যায়।

## ডিজাইন বদলাতে চাইলে
- ওয়েবসাইট: `frontend/src/design/tokens.css` (রং, ফন্ট) → বাকি ফাইলগুলো ওই রং ব্যবহার করে
- এডমিন: `admin/src/design/tokens.css`
