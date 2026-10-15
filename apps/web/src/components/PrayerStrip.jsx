import { useEffect, useState } from 'react';

const names = [
  ['Fajr', 'ফজর'],
  ['Dhuhr', 'যোহর'],
  ['Asr', 'আসর'],
  ['Maghrib', 'মাগরিব'],
  ['Isha', 'এশা'],
];

// আজকের নামাজের সময় (Aladhan পাবলিক API)। অন্য শহরের জন্য city বদলান।
const CITY = 'Dhaka';
const COUNTRY = 'Bangladesh';

export default function PrayerStrip() {
  const [times, setTimes] = useState(null);

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${CITY}&country=${COUNTRY}&method=1`)
      .then((r) => r.json())
      .then((d) => setTimes(d.data.timings))
      .catch(() => setTimes(null));
  }, []);

  return (
    <section className="prayer-strip" aria-label={`আজকের নামাজের সময়, ${CITY}`}>
      <div className="container prayer-row">
        {names.map(([key, label]) => (
          <div className="prayer-item" key={key}>
            <div className="prayer-name">{label}</div>
            <div className="prayer-time">{times ? times[key] : '--:--'}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
