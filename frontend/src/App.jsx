import { Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import Teachers from './pages/Teachers.jsx';
import QuizList from './pages/QuizList.jsx';
import QuizTake from './pages/QuizTake.jsx';
import Admission from './pages/Admission.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <SettingsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizTake />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </SettingsProvider>
  );
}
