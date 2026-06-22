import { useEffect, useState } from 'react';

export type TrveTheme = 'light' | 'wild';
export const TRVE_THEMES: TrveTheme[] = ['light', 'wild'];
const STORAGE_KEY = 'trve-landing-theme';

export function useTrveTheme(): [TrveTheme, (t: TrveTheme) => void] {
  const [theme, setTheme] = useState<TrveTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY) as TrveTheme | null;
    return stored && TRVE_THEMES.includes(stored) ? stored : 'light';
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);
  return [theme, setTheme];
}
