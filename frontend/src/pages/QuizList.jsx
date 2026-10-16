import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import SectionHead from '../components/SectionHead.jsx';
import { Loading, ErrorBox, Empty } from '../components/StateBox.jsx';

export default function QuizList() {
  usePageTitle('কুইজ');
  const { data, loading, error } = useFetch(api.quizzes, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHead label="কুইজ" title="নিজেকে যাচাই করুন" sub="যেকোনো কুইজে ক্লিক করে নিজের নাম ও ক্লাস দিয়ে শুরু করুন। প্রতিটি কুইজের একটা নির্দিষ্ট সময়সীমা আছে।" />
        {loading && <Loading />}
        {error && <ErrorBox message={error} />}
        {data && (
          <div className="quiz-grid">
            {data.length ? (
              data.map((q) => (
                <article className="quiz-card" key={q._id}>
                  <span className="time-badge">⏱ {q.timeLimitMinutes} মিনিট</span>
                  <h3>{q.title}</h3>
                  {q.description && <p className="muted">{q.description}</p>}
                  <p className="muted small">{q.questionCount} টি প্রশ্ন</p>
                  <Link to={`/quiz/${q._id}`} className="btn btn-gold">কুইজ শুরু করুন</Link>
                </article>
              ))
            ) : (
              <Empty>এই মুহূর্তে কোনো কুইজ চালু নেই।</Empty>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
