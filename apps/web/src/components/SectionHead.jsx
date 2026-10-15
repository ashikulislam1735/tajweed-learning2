export default function SectionHead({ label, title, sub }) {
  return (
    <header className="section-head">
      {label && <span className="section-label">{label}</span>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  );
}
