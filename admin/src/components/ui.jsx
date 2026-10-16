// ছোট ছোট ব্যবহারযোগ্য UI অংশ
export function PageHead({ title, children }) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="topbar-actions">{children}</div>
    </div>
  );
}

export function Notice({ notice }) {
  if (!notice) return null;
  return <div className={`alert alert-${notice.type}`} role="status">{notice.text}</div>;
}

export function Field({ label, children, hint }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

export function Loading() {
  return <p className="state">লোড হচ্ছে...</p>;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      {message} {onRetry && <button className="btn btn-sm btn-outline" onClick={onRetry}>আবার চেষ্টা করুন</button>}
    </div>
  );
}

const statusLabels = { pending: 'অপেক্ষমাণ', approved: 'অনুমোদিত', rejected: 'বাতিল' };
export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{statusLabels[status] || status}</span>;
}

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
