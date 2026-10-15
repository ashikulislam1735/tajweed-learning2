import { useEffect, useState } from 'react';

// fetcher ফাংশন একবার চালিয়ে { data, loading, error } দেয়
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fetcher()
      .then((data) => alive && setState({ data, loading: false, error: '' }))
      .catch((err) => alive && setState({ data: null, loading: false, error: err.message }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
