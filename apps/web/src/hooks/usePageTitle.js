import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';

export function usePageTitle(title) {
  const { siteName } = useSettings();
  useEffect(() => {
    document.title = title ? `${title} — ${siteName}` : siteName;
  }, [title, siteName]);
}
