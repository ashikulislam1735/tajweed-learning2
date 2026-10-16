// ব্যাকএন্ডের সাথে কথা বলার সব কোড এই এক ফাইলে
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('সার্ভারে সংযোগ করা যায়নি। ইন্টারনেট বা সার্ভার চালু আছে কিনা দেখুন।');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'কিছু একটা সমস্যা হয়েছে।');
  return data;
}

export const api = {
  settings: () => request('/public/settings'),
  home: () => request('/public/home'),
  courses: () => request('/public/courses'),
  teachers: () => request('/public/teachers'),
  submitReview: (body) => request('/public/reviews', { method: 'POST', body }),
  submitAdmission: (body) => request('/public/admissions', { method: 'POST', body }),
  quizzes: () => request('/public/quizzes'),
  startQuiz: (id, body) => request(`/public/quizzes/${id}/start`, { method: 'POST', body }),
  submitQuiz: (id, body) => request(`/public/quizzes/${id}/submit`, { method: 'POST', body }),
};
