import { useEffect, useState } from 'react';

// সংখ্যা ০ থেকে লক্ষ্যে গুনে ওঠে (একবারই চলে, reduced-motion হলে সরাসরি দেখায়)
export default function CountUp({ to = 0, suffix = '', duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}
