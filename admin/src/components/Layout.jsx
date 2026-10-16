import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  { to: '/', label: 'ড্যাশবোর্ড', end: true },
  { to: '/teachers', label: 'শিক্ষকবৃন্দ' },
  { to: '/courses', label: 'কোর্সসমূহ' },
  { to: '/admissions', label: 'ভর্তি আবেদন' },
  { to: '/reviews', label: 'রিভিউ' },
  { to: '/quizzes', label: 'কুইজ' },
  { to: '/settings', label: 'সেটিংস' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-wrap">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">ت Tajweed Admin</div>
        <nav onClick={() => setOpen(false)}>
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={logout}>লগআউট{admin ? ` (${admin.username})` : ''}</button>
      </aside>
      <div className="main-col">
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="মেনু">☰ মেনু</button>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
