import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import SectionHead from '../components/SectionHead.jsx';

export default function Admission() {
  usePageTitle('ভর্তি');
  const { whatsapp } = useSettings();
  const [params] = useSearchParams();
  const { data: courses } = useFetch(api.courses, []);

  const [form, setForm] = useState({ studentName: '', age: '', phone: '', courseInterested: params.get('course') || '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await api.submitAdmission(form);
      setStatus({ type: 'success', text: res.message });
      setForm({ studentName: '', age: '', phone: '', courseInterested: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  // ফর্মের তথ্য দিয়ে WhatsApp চ্যাট খোলে (মেসেজ আগে থেকে লেখা থাকে)
  function sendWhatsApp() {
    const text =
      `আসসালামু আলাইকুম, আমি ভর্তি সম্পর্কে জানতে চাই।\n\n` +
      `নাম: ${form.studentName || '-'}\nবয়স: ${form.age || '-'}\nফোন: ${form.phone || '-'}\n` +
      `আগ্রহী কোর্স: ${form.courseInterested || '-'}\nবার্তা: ${form.message || '-'}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHead label="ভর্তি ফর্ম" title="আজই ভর্তি হোন" sub="নিচের ফর্মটি পূরণ করুন — আমরা যত দ্রুত সম্ভব WhatsApp বা ফোনে যোগাযোগ করব।" />
        <div className="form-card">
          {status.text && <div className={`alert alert-${status.type}`} role="status">{status.text}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="studentName">ছাত্র/ছাত্রীর নাম *</label>
              <input id="studentName" name="studentName" value={form.studentName} onChange={set} required maxLength={150} />
            </div>
            <div className="form-group">
              <label htmlFor="age">বয়স</label>
              <input id="age" name="age" value={form.age} onChange={set} maxLength={20} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">ফোন / WhatsApp নম্বর *</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={set} required maxLength={50} />
            </div>
            <div className="form-group">
              <label htmlFor="courseInterested">আগ্রহী কোর্স</label>
              <select id="courseInterested" name="courseInterested" value={form.courseInterested} onChange={set}>
                <option value="">-- নির্বাচন করুন --</option>
                {(courses || []).map((c) => (
                  <option key={c._id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">বার্তা (ঐচ্ছিক)</label>
              <textarea id="message" name="message" rows={4} value={form.message} onChange={set} maxLength={1000} />
            </div>
            <div className="btn-row">
              <button type="submit" className="btn btn-gold" disabled={busy}>{busy ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}</button>
              {whatsapp && <button type="button" className="btn btn-wa" onClick={sendWhatsApp}>WhatsApp এ পাঠান</button>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
