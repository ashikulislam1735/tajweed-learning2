import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, downloadFile } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import Modal from '../components/Modal.jsx';
import { PageHead, Notice, Field, Loading, ErrorState } from '../components/ui.jsx';

const empty = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' };

export default function Questions() {
  const { id } = useParams();
  const { data, loading, error, reload } = useLoad(() => api.questions.list(id), [id]);
  const [notice, show] = useNotice();
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  async function remove(q) {
    if (!window.confirm('প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await api.questions.remove(q._id);
      show('প্রশ্ন মুছে ফেলা হয়েছে।');
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title={`প্রশ্নসমূহ${data ? ` — ${data.quiz.title}` : ''}`}>
        <button className="btn btn-outline" onClick={() => setBulkOpen(true)}>CSV থেকে বাল্ক আপলোড</button>
        <button className="btn btn-primary" onClick={() => setEditing({ ...empty })}>+ প্রশ্ন যোগ করুন</button>
      </PageHead>
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>ছবি</th><th>প্রশ্ন</th><th>A</th><th>B</th><th>C</th><th>D</th><th>সঠিক</th><th>একশন</th></tr></thead>
            <tbody>
              {data.questions.length ? data.questions.map((q) => (
                <tr key={q._id}>
                  <td>{q.imageUrl ? <img className="thumb" src={q.imageUrl} alt="" /> : '—'}</td>
                  <td className="msg-cell">{q.questionText}</td>
                  <td>{q.optionA}</td><td>{q.optionB}</td><td>{q.optionC}</td><td>{q.optionD}</td>
                  <td><b>{q.correctOption}</b></td>
                  <td className="nowrap">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditing(q)}>এডিট</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => remove(q)}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="8">এখনো কোনো প্রশ্ন যোগ করা হয়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/quizzes" className="btn btn-outline">← কুইজ তালিকায় ফিরুন</Link>

      {editing && <QuestionForm quizId={id} question={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); show('সংরক্ষণ করা হয়েছে।'); reload(); }} />}
      {bulkOpen && <BulkForm quizId={id} onClose={() => setBulkOpen(false)} onDone={(r) => { setBulkOpen(false); show(`${r.added} টি প্রশ্ন যোগ হয়েছে${r.skipped ? `, ${r.skipped} টি সারি বাদ গেছে (তথ্য অসম্পূর্ণ)` : ''}।`); reload(); }} />}
    </>
  );
}

function QuestionForm({ quizId, question, onClose, onSaved }) {
  const [f, setF] = useState({ ...empty, ...question });
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData();
    Object.keys(empty).forEach((k) => fd.append(k, f[k] ?? ''));
    if (image) fd.append('image', image);
    if (removeImage) fd.append('removeImage', 'true');
    try {
      if (question._id) await api.questions.update(question._id, fd);
      else await api.questions.create(quizId, fd);
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={question._id ? 'প্রশ্ন এডিট করুন' : 'নতুন প্রশ্ন'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="প্রশ্ন *"><textarea name="questionText" rows={3} value={f.questionText} onChange={set} required /></Field>
        <Field label="প্রশ্নের ছবি (ঐচ্ছিক)" hint="JPG/PNG/WEBP, সর্বোচ্চ ২ MB">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files[0] || null)} />
          {question.imageUrl && !image && (
            <>
              <img className="thumb thumb-lg" src={question.imageUrl} alt="বর্তমান ছবি" />
              <label className="check"><input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} /> ছবিটি মুছে ফেলুন</label>
            </>
          )}
        </Field>
        <div className="form-row">
          <Field label="অপশন A *"><input name="optionA" value={f.optionA} onChange={set} required maxLength={500} /></Field>
          <Field label="অপশন B *"><input name="optionB" value={f.optionB} onChange={set} required maxLength={500} /></Field>
        </div>
        <div className="form-row">
          <Field label="অপশন C *"><input name="optionC" value={f.optionC} onChange={set} required maxLength={500} /></Field>
          <Field label="অপশন D *"><input name="optionD" value={f.optionD} onChange={set} required maxLength={500} /></Field>
        </div>
        <Field label="সঠিক উত্তর *">
          <select name="correctOption" value={f.correctOption} onChange={set}>
            {['A', 'B', 'C', 'D'].map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <div className="modal-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>বাতিল</button>
        </div>
      </form>
    </Modal>
  );
}

function BulkForm({ quizId, onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      onDone(await api.questions.bulk(quizId, fd));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title="CSV থেকে বাল্ক আপলোড" onClose={onClose}>
      <ol className="steps">
        <li>নিচের বাটনে টেমপ্লেট ডাউনলোড করে এক্সেলে খুলুন।</li>
        <li>প্রতি সারিতে একটা প্রশ্ন লিখুন: প্রশ্ন, অপশন A, B, C, D, সঠিক উত্তর (A/B/C/D)।</li>
        <li>এক্সেল থেকে <b>File → Save As → CSV UTF-8 (Comma delimited)</b> বেছে সেভ করুন। শুধু "CSV" বেছে নিলে বাংলা অক্ষর নষ্ট হতে পারে।</li>
        <li>সেই .csv ফাইল এখানে আপলোড করুন।</li>
      </ol>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => downloadFile('/admin/question-template', 'quiz_questions_template.csv').catch((e) => setError(e.message))}>নমুনা টেমপ্লেট ডাউনলোড</button>
      <form onSubmit={submit} style={{ marginTop: 18 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="CSV ফাইল *"><input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0] || null)} required /></Field>
        <div className="modal-actions">
          <button className="btn btn-primary" disabled={busy || !file}>{busy ? 'আপলোড হচ্ছে...' : 'আপলোড করুন'}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>বাতিল</button>
        </div>
      </form>
    </Modal>
  );
}
