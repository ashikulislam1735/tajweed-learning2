import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import Modal from '../components/Modal.jsx';
import { PageHead, Notice, Field, Loading, ErrorState } from '../components/ui.jsx';

const empty = { title: '', description: '', timeLimitMinutes: 10, isActive: true };

export default function Quizzes() {
  const { data, loading, error, reload } = useLoad(api.quizzes.list, []);
  const [notice, show] = useNotice();
  const [editing, setEditing] = useState(null);

  async function act(fn, okText) {
    try {
      await fn();
      if (okText) show(okText);
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title="কুইজ ম্যানেজমেন্ট">
        <button className="btn btn-primary" onClick={() => setEditing({ ...empty })}>+ নতুন কুইজ</button>
      </PageHead>
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>কুইজের নাম</th><th>সময়সীমা</th><th>প্রশ্ন</th><th>অংশগ্রহণ</th><th>স্ট্যাটাস</th><th>একশন</th></tr></thead>
            <tbody>
              {data.length ? data.map((q) => (
                <tr key={q._id}>
                  <td>{q.title}</td>
                  <td>{q.timeLimitMinutes} মিনিট</td>
                  <td>{q.questionCount}</td>
                  <td><Link to={`/quizzes/${q._id}/results`}>{q.attemptCount} জন</Link></td>
                  <td>
                    <button className={`badge badge-btn ${q.isActive ? 'badge-approved' : 'badge-pending'}`} onClick={() => act(() => api.quizzes.toggle(q._id))} title="ক্লিক করে বদলান">
                      {q.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </button>
                  </td>
                  <td className="nowrap">
                    <Link to={`/quizzes/${q._id}/questions`} className="btn btn-sm btn-outline">প্রশ্নসমূহ</Link>{' '}
                    <button className="btn btn-sm btn-outline" onClick={() => setEditing(q)}>এডিট</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => window.confirm('এই কুইজ ও এর সব প্রশ্ন/ফলাফল মুছে ফেলতে চান?') && act(() => api.quizzes.remove(q._id), 'কুইজ মুছে ফেলা হয়েছে।')}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6">এখনো কোনো কুইজ তৈরি করা হয়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {editing && <QuizForm quiz={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); show('সংরক্ষণ করা হয়েছে।'); reload(); }} />}
    </>
  );
}

function QuizForm({ quiz, onClose, onSaved }) {
  const [f, setF] = useState({ ...empty, ...quiz });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { title: f.title, description: f.description, timeLimitMinutes: Number(f.timeLimitMinutes), isActive: f.isActive };
    try {
      if (quiz._id) await api.quizzes.update(quiz._id, body);
      else await api.quizzes.create(body);
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={quiz._id ? 'কুইজ এডিট করুন' : 'নতুন কুইজ'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="কুইজের নাম *"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required maxLength={200} /></Field>
        <Field label="বর্ণনা"><textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="সময়সীমা (মিনিট)"><input type="number" min="1" max="180" value={f.timeLimitMinutes} onChange={(e) => setF({ ...f, timeLimitMinutes: e.target.value })} /></Field>
        <label className="check"><input type="checkbox" checked={f.isActive} onChange={(e) => setF({ ...f, isActive: e.target.checked })} /> কুইজটি সক্রিয় (ছাত্ররা দেখতে পাবে)</label>
        <div className="modal-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>বাতিল</button>
        </div>
      </form>
    </Modal>
  );
}
