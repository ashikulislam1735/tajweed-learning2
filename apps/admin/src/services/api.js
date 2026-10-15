// ব্যাকএন্ডের সাথে কথা বলার সব কোড এক জায়গায়। টোকেন লোকাল স্টোরেজে থাকে।
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'tajweed_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', json, form, blob = false } = {}) {
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: json ? JSON.stringify(json) : form });
  } catch {
    throw new Error('সার্ভারে সংযোগ করা যায়নি। সার্ভার চালু আছে কিনা দেখুন।');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // লগইন করা অবস্থায় 401 মানে সেশন শেষ → অ্যাপকে জানাই
    if (res.status === 401 && token && path !== '/auth/login') window.dispatchEvent(new Event('auth:expired'));
    throw new Error(data.message || 'কিছু একটা সমস্যা হয়েছে।');
  }
  return blob ? res.blob() : res.json();
}

// এক্সপোর্ট/টেমপ্লেট ফাইল (লগইন টোকেন লাগে বলে সাধারণ লিংক দিয়ে হয় না)
export async function downloadFile(path, filename) {
  const blob = await request(path, { blob: true });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const crud = (base) => ({
  list: () => request(base),
  remove: (id) => request(`${base}/${id}`, { method: 'DELETE' }),
});

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', json: { username, password } }),
  me: () => request('/auth/me'),
  changePassword: (json) => request('/auth/password', { method: 'PUT', json }),
  dashboard: () => request('/admin/dashboard'),

  teachers: {
    ...crud('/admin/teachers'),
    create: (form) => request('/admin/teachers', { method: 'POST', form }),
    update: (id, form) => request(`/admin/teachers/${id}`, { method: 'PUT', form }),
  },
  courses: {
    ...crud('/admin/courses'),
    create: (json) => request('/admin/courses', { method: 'POST', json }),
    update: (id, json) => request(`/admin/courses/${id}`, { method: 'PUT', json }),
  },
  admissions: {
    ...crud('/admin/admissions'),
    setStatus: (id, status) => request(`/admin/admissions/${id}/status`, { method: 'PATCH', json: { status } }),
  },
  reviews: {
    ...crud('/admin/reviews'),
    approve: (id) => request(`/admin/reviews/${id}/approve`, { method: 'PATCH' }),
  },
  quizzes: {
    ...crud('/admin/quizzes'),
    create: (json) => request('/admin/quizzes', { method: 'POST', json }),
    update: (id, json) => request(`/admin/quizzes/${id}`, { method: 'PUT', json }),
    toggle: (id) => request(`/admin/quizzes/${id}/toggle`, { method: 'PATCH' }),
  },
  questions: {
    list: (quizId) => request(`/admin/quizzes/${quizId}/questions`),
    create: (quizId, form) => request(`/admin/quizzes/${quizId}/questions`, { method: 'POST', form }),
    update: (id, form) => request(`/admin/questions/${id}`, { method: 'PUT', form }),
    remove: (id) => request(`/admin/questions/${id}`, { method: 'DELETE' }),
    bulk: (quizId, form) => request(`/admin/quizzes/${quizId}/questions/bulk`, { method: 'POST', form }),
  },
  results: {
    list: (quizId) => request(`/admin/quizzes/${quizId}/results`),
  },
  settings: {
    get: () => request('/admin/settings'),
    update: (json) => request('/admin/settings', { method: 'PUT', json }),
  },
};
