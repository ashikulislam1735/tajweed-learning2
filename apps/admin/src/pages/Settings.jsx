import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useLoad, useNotice } from '../hooks/useLoad.js';
import { PageHead, Notice, Field, Loading, ErrorState } from '../components/ui.jsx';

const keys = ['siteName', 'phone', 'whatsapp', 'email', 'address', 'mapEmbedUrl', 'facebookUrl', 'youtubeUrl', 'baseStudentCount'];

export default function Settings() {
  const { data, loading, error, reload } = useLoad(api.settings.get, []);
  const [notice, show] = useNotice();
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setF(Object.fromEntries(keys.map((k) => [k, data[k] ?? ''])));
  }, [data]);

  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.settings.update({ ...f, baseStudentCount: Number(f.baseStudentCount) || 0 });
      show('সেটিংস সংরক্ষিত হয়েছে।');
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  if (loading || (data && !f)) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <PageHead title="সাধারণ সেটিংস" />
      <Notice notice={notice} />
      <div className="card narrow-card">
        <form onSubmit={save}>
          <Field label="সাইটের নাম"><input name="siteName" value={f.siteName} onChange={set} /></Field>
          <div className="form-row">
            <Field label="ফোন নম্বর"><input name="phone" value={f.phone} onChange={set} /></Field>
            <Field label="WhatsApp নম্বর" hint="কান্ট্রি কোডসহ, + ছাড়া। যেমন: 8801XXXXXXXXX"><input name="whatsapp" value={f.whatsapp} onChange={set} /></Field>
          </div>
          <Field label="ইমেইল"><input name="email" value={f.email} onChange={set} /></Field>
          <Field label="ঠিকানা"><input name="address" value={f.address} onChange={set} /></Field>
          <Field label="Google Map Embed URL" hint='গুগল ম্যাপে লোকেশন খুঁজে Share → Embed a map থেকে src="..." এর ভিতরের লিংক'><input name="mapEmbedUrl" value={f.mapEmbedUrl} onChange={set} /></Field>
          <div className="form-row">
            <Field label="Facebook লিংক"><input name="facebookUrl" value={f.facebookUrl} onChange={set} /></Field>
            <Field label="YouTube লিংক"><input name="youtubeUrl" value={f.youtubeUrl} onChange={set} /></Field>
          </div>
          <Field label="হোমপেজের ছাত্র সংখ্যার শুরুর মান" hint="এর সাথে অনুমোদিত ভর্তি সংখ্যা যোগ হয়ে হোমপেজে দেখায়।"><input name="baseStudentCount" type="number" min="0" value={f.baseStudentCount} onChange={set} /></Field>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
        </form>
      </div>
      <PasswordCard show={show} />
    </>
  );
}

function PasswordCard({ show }) {
  const [f, setF] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.changePassword(f);
      show(res.message);
      setF({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card narrow-card">
      <h3>পাসওয়ার্ড পরিবর্তন করুন</h3>
      <form onSubmit={submit}>
        <Field label="বর্তমান পাসওয়ার্ড"><input type="password" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} required autoComplete="current-password" /></Field>
        <Field label="নতুন পাসওয়ার্ড" hint="কমপক্ষে ৮ অক্ষর"><input type="password" value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} required minLength={8} autoComplete="new-password" /></Field>
        <Field label="নতুন পাসওয়ার্ড আবার লিখুন"><input type="password" value={f.confirmPassword} onChange={(e) => setF({ ...f, confirmPassword: e.target.value })} required autoComplete="new-password" /></Field>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড বদলান'}</button>
      </form>
    </div>
  );
}
