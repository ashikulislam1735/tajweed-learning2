import { useState } from 'react';
import { api } from '../services/api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import SectionHead from '../components/SectionHead.jsx';

export default function Contact() {
  usePageTitle('যোগাযোগ');
  const s = useSettings();
  const [form, setForm] = useState({ name: '', reviewText: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await api.submitReview(form);
      setStatus({ type: 'success', text: res.message });
      setForm({ name: '', reviewText: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHead label="যোগাযোগ" title="আমাদের সাথে যোগাযোগ করুন" />
        <div className="contact-grid">
          <div>
            {s.address && <p><b>ঠিকানা:</b> {s.address}</p>}
            {s.phone && <p><b>ফোন:</b> <a href={`tel:${s.phone}`}>{s.phone}</a></p>}
            {s.email && <p><b>ইমেইল:</b> <a href={`mailto:${s.email}`}>{s.email}</a></p>}
            {s.mapEmbedUrl && <iframe className="map-embed" src={s.mapEmbedUrl} title="আমাদের অবস্থান" loading="lazy" />}
          </div>

          <div className="form-card form-card-wide">
            <h3>আপনার অভিজ্ঞতা শেয়ার করুন</h3>
            {status.text && <div className={`alert alert-${status.type}`} role="status">{status.text}</div>}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="rname">আপনার নাম *</label>
                <input id="rname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={150} />
              </div>
              <div className="form-group">
                <label htmlFor="rtext">মতামত *</label>
                <textarea id="rtext" rows={4} value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} required maxLength={1000} />
              </div>
              <button type="submit" className="btn btn-gold" disabled={busy}>{busy ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
