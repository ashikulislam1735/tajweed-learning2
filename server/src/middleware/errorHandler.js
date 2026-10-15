import multer from 'multer';

export function notFound(req, res) {
  res.status(404).json({ message: `পথটি পাওয়া যায়নি: ${req.method} ${req.originalUrl}` });
}

// সব এরর এখানে এসে একই ছাঁচে JSON হয়ে ফেরত যায়: { message }
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'ফাইলের সাইজ অনেক বড়।' : 'ফাইল আপলোডে সমস্যা হয়েছে।';
    return res.status(400).json({ message: msg });
  }
  if (err.name === 'CastError') return res.status(404).json({ message: 'আইটেমটি পাওয়া যায়নি।' });
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first?.message || 'তথ্য সঠিক নয়।' });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'এই তথ্য আগে থেকেই আছে।' });

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'সার্ভারে সমস্যা হয়েছে।' : err.message });
}
