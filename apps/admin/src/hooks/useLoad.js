import { useCallback, useEffect, useState } from 'react';

// ডেটা আনে এবং `reload()` দেয় — সেভ/ডিলিটের পর তালিকা নতুন করে আনতে কাজে লাগে
export function useLoad(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    return fetcher()
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((err) => setState({ data: null, loading: false, error: err.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

// "সংরক্ষিত হয়েছে" ধরনের বার্তা কিছুক্ষণ দেখানোর জন্য
export function useNotice() {
  const [notice, setNotice] = useState(null);
  const show = useCallback((text, type = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  }, []);
  return [notice, show];
}
