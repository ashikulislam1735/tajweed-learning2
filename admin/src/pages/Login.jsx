import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>এডমিন প্যানেল</h1>
        <p className="muted">Tajweed Learning Centre</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <div className="form-group">
          <label htmlFor="u">ইউজারনেম</label>
          <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus autoComplete="username" />
        </div>
        <div className="form-group">
          <label htmlFor="p">পাসওয়ার্ড</label>
          <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</button>
      </form>
    </div>
  );
}
