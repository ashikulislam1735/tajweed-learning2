// চালানোর নিয়ম:  npm run seed
// কাজ: প্রথম এডমিন, ডিফল্ট সেটিংস, নমুনা কোর্স তৈরি (আগে থেকে থাকলে ছুঁবে না)
import mongoose from 'mongoose';
import { env, assertEnv } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { Admin } from '../src/models/Admin.js';
import { Setting } from '../src/models/Setting.js';
import { Course } from '../src/models/Course.js';

const sampleCourses = [
  { title: 'নূরানী কোর্স', levelNo: 1, fee: '৫০০ টাকা/মাস', duration: '৩ মাস', description: 'আরবি হরফ চেনা ও প্রাথমিক পড়া শেখার কোর্স।', displayOrder: 1 },
  { title: 'তাজভীদ কোর্স', levelNo: 2, fee: '৭০০ টাকা/মাস', duration: '৬ মাস', description: 'তাজভীদের নিয়মসহ শুদ্ধভাবে কুরআন পড়া শেখানো হয়।', displayOrder: 2 },
  { title: 'হিফজ কোর্স', levelNo: 3, fee: '১০০০ টাকা/মাস', duration: 'নিরবচ্ছিন্ন', description: 'সম্পূর্ণ কুরআন মুখস্থ করানোর কোর্স।', displayOrder: 3 },
  { title: 'প্রাপ্তবয়স্কদের কোর্স', levelNo: 4, fee: '৬০০ টাকা/মাস', duration: '৪ মাস', description: 'যারা বড় বয়সে শুদ্ধ করে কুরআন পড়া শিখতে চান তাদের জন্য।', displayOrder: 4 },
];

async function run() {
  assertEnv();
  await connectDB();

  if (!(await Admin.countDocuments())) {
    const { username, password } = env.admin;
    if (!password || password.length < 8) {
      throw new Error('.env ফাইলে ADMIN_PASSWORD (কমপক্ষে ৮ অক্ষর) দিন, তারপর আবার চালান।');
    }
    await Admin.create({ username, passwordHash: await Admin.hash(password) });
    console.log(`এডমিন তৈরি হয়েছে: ${username}`);
  } else {
    console.log('এডমিন আগে থেকেই আছে, ছোঁয়া হয়নি।');
  }

  await Setting.getSite();
  console.log('সেটিংস প্রস্তুত।');

  if (!(await Course.countDocuments())) {
    await Course.insertMany(sampleCourses);
    console.log('৪টা নমুনা কোর্স যোগ হয়েছে।');
  }
}

run()
  .catch((err) => {
    console.error('সিড ব্যর্থ:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
