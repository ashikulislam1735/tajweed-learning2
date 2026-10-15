import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Teachers from './pages/Teachers.jsx';
import Courses from './pages/Courses.jsx';
import Admissions from './pages/Admissions.jsx';
import Reviews from './pages/Reviews.jsx';
import Quizzes from './pages/Quizzes.jsx';
import Questions from './pages/Questions.jsx';
import Results from './pages/Results.jsx';
import Settings from './pages/Settings.jsx';

// লগইন না থাকলে সব এডমিন পেজ থেকে /login এ পাঠিয়ে দেয়
function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/:id/questions" element={<Questions />} />
        <Route path="/quizzes/:id/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
