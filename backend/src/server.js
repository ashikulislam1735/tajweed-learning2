import app from './app.js';
import { env, assertEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { cloudinaryReady } from './config/cloudinary.js';

async function start() {
  assertEnv();
  await connectDB();
  if (!cloudinaryReady) console.warn('সতর্কতা: Cloudinary সেটআপ নেই, ছবি আপলোড কাজ করবে না।');
  app.listen(env.port, () => console.log(`সার্ভার চালু: http://localhost:${env.port}`));
}

start().catch((err) => {
  console.error('সার্ভার চালু করা যায়নি:', err.message);
  process.exit(1);
});
