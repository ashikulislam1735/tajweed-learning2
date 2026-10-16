import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(tokenStore.get());
  const [admin, setAdmin] = useState(null);

  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setAdmin(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.login(username, password);
    tokenStore.set(res.token);
    setToken(res.token);
    setAdmin(res.admin);
  }, []);

  // সেশন শেষ হলে (সার্ভার 401 দিলে) অটো লগআউট
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  // পেজ রিফ্রেশ করলে টোকেন থাকলেও এডমিনের নাম আবার আনি
  useEffect(() => {
    if (token && !admin) {
      api.me().then((r) => setAdmin({ username: r.admin.username })).catch(() => {});
    }
  }, [token, admin]);

  return <AuthContext.Provider value={{ token, admin, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
