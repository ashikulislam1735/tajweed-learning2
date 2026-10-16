import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { HttpError } from '../utils/httpError.js';

const { cloudName, apiKey, apiSecret } = env.cloudinary;
export const cloudinaryReady = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryReady) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

// মেমরিতে থাকা ছবি (buffer) Cloudinary তে আপলোড করে
export function uploadImage(buffer, folder) {
  if (!cloudinaryReady) {
    throw new HttpError(503, 'ছবি আপলোডের জন্য Cloudinary সেটআপ করা নেই। .env ফাইলে CLOUDINARY_* মান বসান।');
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `tajweed/${folder}`, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id }))
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (!cloudinaryReady || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('ছবি মুছতে সমস্যা:', err.message);
  }
}
