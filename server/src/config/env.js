import 'dotenv/config';

const get = (name, fallback = '') => process.env[name] ?? fallback;

export const env = {
  nodeEnv: get('NODE_ENV', 'development'),
  port: Number(get('PORT', '5000')),
  mongoUri: get('MONGODB_URI'),
  jwtSecret: get('JWT_SECRET'),
  clientOrigins: get('CLIENT_ORIGINS', 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  cloudinary: {
    cloudName: get('CLOUDINARY_CLOUD_NAME'),
    apiKey: get('CLOUDINARY_API_KEY'),
    apiSecret: get('CLOUDINARY_API_SECRET'),
  },
  admin: {
    username: get('ADMIN_USERNAME', 'admin'),
    password: get('ADMIN_PASSWORD'),
  },
};

// সার্ভার চালু হওয়ার আগেই জরুরি সেটিং আছে কিনা দেখে নেওয়া
export function assertEnv() {
  const missing = [];
  if (!env.mongoUri) missing.push('MONGODB_URI');
  if (!env.jwtSecret) missing.push('JWT_SECRET');
  if (missing.length) {
    throw new Error(`এই সেটিংগুলো .env ফাইলে নেই: ${missing.join(', ')}`);
  }
  if (env.jwtSecret.length < 16) {
    throw new Error('JWT_SECRET কমপক্ষে ১৬ অক্ষরের হতে হবে (৩২+ হলে ভালো)।');
  }
}
