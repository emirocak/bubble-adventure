import { useEffect, useState } from 'react';
import { getConfig, type Config } from '../config';

/**
 * Aktif config'i verir. Admin panelinden değiştirildiğinde otomatik güncellenir.
 */
export function useConfig(): Config {
  const [config, setConfig] = useState<Config>(() => getConfig());

  useEffect(() => {
    const update = () => setConfig(getConfig());
    window.addEventListener('bubble-config-updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('bubble-config-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return config;
}
