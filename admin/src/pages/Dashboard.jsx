import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useLoad } from '../hooks/useLoad.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHead, Loading, ErrorState, StatusBadge, fmtDate } from '../components/ui.jsx';

export default function Dashboard() {
  const { admin } = useAuth();
  const { data, loading, error, reload } = useLoad(api.dashboard, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const cards = [
    ['শিক্ষক', data.teachers],
    ['কোর্স', data.courses],
    ['মোট ভর্তি আবেদন', data.admissionsTotal],
    ['অপেক্ষমাণ আবেদন', data.admissionsPending, 'warn'],
    ['কুইজ', data.quizzes],
    ['কুইজ অংশগ্রহণ', data.quizAttempts],
    ['অপেক্ষমাণ রিভিউ', data.reviewsPending, 'warn'],
  ];

  return (
    <>
      <PageHead title="ড্যাশবোর্ড">{admin && <span className="muted">স্বাগতম, {admin.username}</span>}</PageHead>
      <div className="stat-grid">
        {cards.map(([label, num, tone]) => (
          <div className="stat-card" key={label}>
            <div className={`num ${tone === 'warn' && num > 0 ? 'warn' : ''}`}>{num}</div>
            <div className="label">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>সাম্প্রতিক ভর্তি আবেদন</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>নাম</th><th>ফোন</th><th>কোর্স</th><th>স্ট্যাটাস</th><th>তারিখ</th></tr></thead>
            <tbody>
              {data.recentAdmissions.length ? (
                data.recentAdmissions.map((a) => (
                  <tr key={a._id}>
                    <td>{a.studentName}</td><td>{a.phone}</td><td>{a.courseInterested}</td>
                    <td><StatusBadge status={a.status} /></td><td>{fmtDate(a.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">এখনো কোনো আবেদন আসেনি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Link to="/admissions" className="btn btn-outline btn-sm">সব আবেদন দেখুন</Link>
      </div>
    </>
  );
}
