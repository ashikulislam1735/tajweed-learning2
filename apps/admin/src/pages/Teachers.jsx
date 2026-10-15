import { useState } from 'react';
import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import Modal from '../components/Modal.jsx';
import { PageHead, Notice, Field, Loading, ErrorState } from '../components/ui.jsx';

const empty = { name: '', designation: '', qualification: '', experience: '', bio: '', displayOrder: 0 };

export default function Teachers() {
  const { data, loading, error, reload } = useLoad(api.teachers.list, []);
  const [notice, show] = useNotice();
  const [editing, setEditing] = useState(null); // null = বন্ধ, {} = নতুন, {_id,...} = এডিট

  async function remove(t) {
    if (!window.confirm(`"${t.name}" কে মুছে ফেলতে চান?`)) return;
    try {
      await api.teachers.remove(t._id);
      show('শিক্ষক মুছে ফেলা হয়েছে।');
      reload();
    } catch (err) {
      show(err.message, 'error');
    }
  }

  return (
    <>
      <PageHead title="শিক্ষকবৃন্দ">
        <button className="btn btn-primary" onClick={() => setEditing({ ...empty })}>+ নতুন শিক্ষক</button>
      </PageHead>
      <Notice notice={notice} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>ছবি</th><th>নাম</th><th>পদবি</th><th>ক্রম</th><th>একশন</th></tr></thead>
            <tbody>
              {data.length ? data.map((t) => (
                <tr key={t._id}>
                  <td>{t.photoUrl ? <img className="thumb" src={t.photoUrl} alt="" /> : '—'}</td>
                  <td>{t.name}</td><td>{t.designation}</td><td>{t.displayOrder}</td>
                  <td className="nowrap">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditing(t)}>এডিট</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => remove(t)}>ডিলিট</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5">এখনো কোনো শিক্ষক যোগ করা হয়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <TeacherForm
          teacher={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); show('সংরক্ষণ করা হয়েছে।'); reload(); }}
        />
      )}
    </>
  );
}

function TeacherForm({ teacher, onClose, onSaved }) {
  const [f, setF] = useState({ ...empty, ...teacher });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData();
    ['name', 'designation', 'qualification', 'experience', 'bio', 'displayOrder'].forEach((k) => fd.append(k, f[k] ?? ''));
    if (photo) fd.append('photo', photo);
    try {
      if (teacher._id) await api.teachers.update(teacher._id, fd);
      else await api.teachers.create(fd);
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={teacher._id ? 'শিক্ষক এডিট করুন' : 'নতুন শিক্ষক'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="নাম *"><input name="name" value={f.name} onChange={set} required maxLength={150} /></Field>
        <div className="form-row">
          <Field label="পদবি"><input name="designation" value={f.designation} onChange={set} placeholder="যেমন: প্রধান শিক্ষক" /></Field>
          <Field label="ক্রম নম্বর"><input name="displayOrder" type="number" value={f.displayOrder} onChange={set} /></Field>
        </div>
        <Field label="যোগ্যতা"><input name="qualification" value={f.qualification} onChange={set} placeholder="যেমন: কারী, ইসলামিক স্টাডিজে অনার্স" /></Field>
        <Field label="অভিজ্ঞতা"><input name="experience" value={f.experience} onChange={set} placeholder="যেমন: ৮ বছর" /></Field>
        <Field label="সংক্ষিপ্ত বায়ো"><textarea name="bio" rows={4} value={f.bio} onChange={set} /></Field>
        <Field label="ছবি" hint="JPG/PNG/WEBP, সর্বোচ্চ ২ MB। নতুন ছবি না দিলে আগেরটাই থাকবে।">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files[0] || null)} />
          {teacher.photoUrl && !photo && <img className="thumb thumb-lg" src={teacher.photoUrl} alt="বর্তমান ছবি" />}
        </Field>
        <div className="modal-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>বাতিল</button>
        </div>
      </form>
    </Modal>
  );
}
