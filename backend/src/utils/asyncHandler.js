// async কন্ট্রোলারে এরর হলে সেটা অটো errorHandler এ পাঠায়
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
