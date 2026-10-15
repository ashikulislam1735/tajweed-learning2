import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext.jsx';

const links = [
  { to: '/', label: 'হোম', end: true },
  { to: '/courses', label: 'কোর্সসমূহ' },
  { to: '/teachers', label: 'শিক্ষকবৃন্দ' },
  { to: '/quiz', label: 'কুইজ' },
  { to: '/admission', label: 'ভর্তি' },
  { to: '/contact', label: 'যোগাযোগ' },
];

export default function Layout({ children }) {
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // পেজ বদলালে মেনু বন্ধ আর উপরে স্ক্রল
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const wa = s.whatsapp ? `https://wa.me/${s.whatsapp}` : null;

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">ت</span>
            {s.siteName}
          </Link>
          <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="প্রধান মেনু">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            {wa && (
              <a className="wa-btn" href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="মেনু খুলুন বা বন্ধ করুন" aria-expanded={open}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>{s.siteName}</h4>
              <p>শুদ্ধ তিলাওয়াত শেখার মাধ্যমে কুরআনের সাথে সম্পর্ক গড়ে তোলার একটি প্রচেষ্টা।</p>
              {s.address && <p>{s.address}</p>}
            </div>
            <div>
              <h4>যোগাযোগ</h4>
              {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
              {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer">
                  WhatsApp করুন
                </a>
              )}
            </div>
            <div>
              <h4>লিংক</h4>
              <Link to="/courses">কোর্সসমূহ</Link>
              <Link to="/quiz">কুইজ</Link>
              {s.facebookUrl && (
                <a href={s.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {s.youtubeUrl && (
                <a href={s.youtubeUrl} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              )}
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} {s.siteName} — সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>

      {wa && (
        <a href={wa} className="wa-float" target="_blank" rel="noreferrer" aria-label="WhatsApp এ মেসেজ করুন">
          💬
        </a>
      )}
    </>
  );
}
