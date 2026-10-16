import { Link, useParams } from 'react-router-dom';
import { api, downloadFile } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import { PageHead, Notice, Loading, ErrorState } from '../components/ui.jsx';

export default function Results() {
  const { id } = useParams();
  const { data, loading, error, reload } = useLoad(() => api.results.list(id), [id]);
  const [notice, show] = useNotice();

  const exportCsv = () =>
    downloadFile(`/admin/quizzes/${id}/results/export`, `quiz_results_${id}.csv`).catch((e) => show(e.message, 'error'));

  return (
    <>
      <PageHead title={`ফলাফল${data ? ` — ${data.quiz.title}` : ''}`}>
        <button className="btn btn-outline" onClick={exportCsv}>CSV এক্সপোর্ট করুন</button>
      </PageHead>
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>নাম</th><th>ক্লাস/রোল</th><th>স্কোর</th><th>শতাংশ</th><th>সময় নিয়েছে</th><th>তারিখ</th></tr></thead>
            <tbody>
              {data.results.length ? data.results.map((r) => {
                const pct = r.totalQuestions ? Math.round((r.score / r.totalQuestions) * 100) : 0;
                return (
                  <tr key={r._id}>
                    <td>{r.studentName}</td><td>{r.studentClass}</td>
                    <td>{r.score}/{r.totalQuestions}</td><td>{pct}%</td>
                    <td>{Math.floor(r.timeTakenSeconds / 60)} মি {r.timeTakenSeconds % 60} সে</td>
                    <td>{new Date(r.createdAt).toLocaleString('bn-BD')}</td>
                  </tr>
                );
              }) : <tr><td colSpan="6">এখনো কেউ এই কুইজ দেয়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/quizzes" className="btn btn-outline">← কুইজ তালিকায় ফিরুন</Link>
    </>
  );
}
