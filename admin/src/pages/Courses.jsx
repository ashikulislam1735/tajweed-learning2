import { useState } from 'react';
import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import Modal from '../components/Modal.jsx';
import { PageHead, Notice, Field, Loading, ErrorState } from '../components/ui.jsx';

const empty = { title: '', levelNo: 1, fee: '', duration: '', description: '', displayOrder: 0 };

export default function Courses() {
  const { data, loading, error, reload } = useLoad(api.courses.list, []);
  const [notice, show] = useNotice();
  const [editing, setEditing] = useState(null);

  async function remove(c) {
    if (!window.confirm(`"${c.title}" কোর্সটি মুছে ফেলতে চান?`)) return;
    try {
      await api.courses.remove(c._id);
      show('কোর্স মুছে ফেলা হয়েছে।');
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title="কোর্সসমূহ">
        <button className="btn btn-primary" onClick={() => setEditing({ ...empty })}>+ নতুন কোর্স</button>
      </PageHead>
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>লেভেল</th><th>কোর্স</th><th>ফি</th><th>মেয়াদ</th><th>ক্রম</th><th>একশন</th></tr></thead>
            <tbody>
              {data.length ? data.map((c) => (
                <tr key={c._id}>
                  <td>{c.levelNo}</td><td>{c.title}</td><td>{c.fee}</td><td>{c.duration}</td><td>{c.displayOrder}</td>
                  <td className="nowrap">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditing(c)}>এডিট</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => remove(c)}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6">এখনো কোনো কোর্স যোগ করা হয়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <CourseForm course={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); show('সংরক্ষণ করা হয়েছে।'); reload(); }} />
      )}
    </>
  );
}

function CourseForm({ course, onClose, onSaved }) {
  const [f, setF] = useState({ ...empty, ...course });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { title: f.title, levelNo: Number(f.levelNo), fee: f.fee, duration: f.duration, description: f.description, displayOrder: Number(f.displayOrder) };
    try {
      if (course._id) await api.courses.update(course._id, body);
      else await api.courses.create(body);
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={course._id ? 'কোর্স এডিট করুন' : 'নতুন কোর্স'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="কোর্সের নাম *"><input name="title" value={f.title} onChange={set} required maxLength={150} /></Field>
        <div className="form-row">
          <Field label="লেভেল নম্বর"><input name="levelNo" type="number" value={f.levelNo} onChange={set} /></Field>
          <Field label="ক্রম নম্বর"><input name="displayOrder" type="number" value={f.displayOrder} onChange={set} /></Field>
        </div>
        <div className="form-row">
          <Field label="ফি"><input name="fee" value={f.fee} onChange={set} placeholder="৫০০ টাকা/মাস" /></Field>
          <Field label="মেয়াদ"><input name="duration" value={f.duration} onChange={set} placeholder="৩ মাস" /></Field>
        </div>
        <Field label="বর্ণনা"><textarea name="description" rows={4} value={f.description} onChange={set} /></Field>
        <div className="modal-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>বাতিল</button>
        </div>
      </form>
    </Modal>
  );
}
