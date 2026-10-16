import { useState } from 'react';

const letters = [
  { id: 'alif', ar: 'ا', name: 'আলিফ', info: 'মাখরাজ: গলার সর্বনিম্ন অংশ (জওফ) থেকে উচ্চারিত হয়, স্বরবিহীন টান।' },
  { id: 'ba', ar: 'ب', name: 'বা', info: 'মাখরাজ: দুই ঠোঁট একসাথে মিলিয়ে উচ্চারিত হয়।' },
  { id: 'ta', ar: 'ت', name: 'তা', info: 'মাখরাজ: জিহ্বার আগার সাথে উপরের দুই সামনের দাঁতের গোড়া মিলিয়ে উচ্চারিত হয়।' },
  { id: 'tha', ar: 'ث', name: 'ছা', info: 'মাখরাজ: জিহ্বার আগা উপরের সামনের দাঁতের ডগায় ঠেকিয়ে উচ্চারিত হয়।' },
];

export default function MakhrajCard() {
  const [active, setActive] = useState(null);
  const current = letters.find((l) => l.id === active);

  return (
    <div className="makhraj-card">
      <h2>মাখরাজ দেখে নিন</h2>
      <p className="hint">হরফে ক্লিক করে দেখুন কোথা থেকে উচ্চারিত হয়</p>
      <div className="letters-row">
        {letters.map((l) => (
          <button
            key={l.id}
            className={`letter-btn ${active === l.id ? 'active' : ''}`}
            onClick={() => setActive(l.id)}
            aria-pressed={active === l.id}
            aria-label={l.name}
          >
            {l.ar}
          </button>
        ))}
      </div>
      <div className="letter-info" aria-live="polite">
        {current ? (
          <>
            <b>
              {current.name} ({current.ar})
            </b>{' '}
            — {current.info}
          </>
        ) : (
          'যেকোনো হরফে ক্লিক করুন...'
        )}
      </div>
    </div>
  );
}
