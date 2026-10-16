import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import { PageHead, Notice, Loading, ErrorState, fmtDate } from '../components/ui.jsx';

export default function Reviews() {
  const { data, loading, error, reload } = useLoad(api.reviews.list, []);
  const [notice, show] = useNotice();

  async function act(fn, okText) {
    try {
      await fn();
      show(okText);
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title="রিভিউ ম্যানেজমেন্ট" />
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>নাম</th><th>মতামত</th><th>স্ট্যাটাস</th><th>তারিখ</th><th>একশন</th></tr></thead>
            <tbody>
              {data.length ? data.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td className="msg-cell wide">{r.reviewText}</td>
                  <td><span className={`badge ${r.isApproved ? 'badge-approved' : 'badge-pending'}`}>{r.isApproved ? 'প্রকাশিত' : 'অপেক্ষমাণ'}</span></td>
                  <td>{fmtDate(r.createdAt)}</td>
                  <td className="nowrap">
                    {!r.isApproved && <><button className="btn btn-sm btn-outline" onClick={() => act(() => api.reviews.approve(r._id), 'রিভিউ প্রকাশ করা হয়েছে।')}>অনুমোদন</button>{' '}</>}
                    <button className="btn btn-sm btn-danger" onClick={() => window.confirm('রিভিউটি মুছে ফেলতে চান?') && act(() => api.reviews.remove(r._id), 'রিভিউ মুছে ফেলা হয়েছে।')}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5">এখনো কোনো রিভিউ আসেনি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
