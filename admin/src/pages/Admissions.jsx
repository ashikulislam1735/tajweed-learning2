import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import { PageHead, Notice, Loading, ErrorState, StatusBadge, fmtDate } from '../components/ui.jsx';

export default function Admissions() {
  const { data, loading, error, reload } = useLoad(api.admissions.list, []);
  const [notice, show] = useNotice();

  async function setStatus(a, status) {
    try {
      await api.admissions.setStatus(a._id, status);
      show('স্ট্যাটাস আপডেট হয়েছে।');
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  async function remove(a) {
    if (!window.confirm(`"${a.studentName}" এর আবেদন মুছে ফেলতে চান?`)) return;
    try {
      await api.admissions.remove(a._id);
      show('আবেদন মুছে ফেলা হয়েছে।');
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title="ভর্তি আবেদনসমূহ" />
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>নাম</th><th>বয়স</th><th>ফোন</th><th>কোর্স</th><th>বার্তা</th><th>স্ট্যাটাস</th><th>তারিখ</th><th>একশন</th></tr></thead>
            <tbody>
              {data.length ? data.map((a) => (
                <tr key={a._id}>
                  <td>{a.studentName}</td>
                  <td>{a.age}</td>
                  <td><a href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">{a.phone}</a></td>
                  <td>{a.courseInterested}</td>
                  <td className="msg-cell">{a.message}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{fmtDate(a.createdAt)}</td>
                  <td className="nowrap">
                    <button className="btn btn-sm btn-outline" onClick={() => setStatus(a, 'approved')} disabled={a.status === 'approved'}>অনুমোদন</button>{' '}
                    <button className="btn btn-sm btn-outline" onClick={() => setStatus(a, 'rejected')} disabled={a.status === 'rejected'}>বাতিল</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => remove(a)}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="8">এখনো কোনো আবেদন আসেনি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
