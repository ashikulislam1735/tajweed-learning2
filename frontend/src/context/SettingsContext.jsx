import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const defaults = {
  siteName: 'Tajweed Learning Centre',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  mapEmbedUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
};

const SettingsContext = createContext(defaults);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    api.settings().then((s) => setSettings({ ...defaults, ...s })).catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
