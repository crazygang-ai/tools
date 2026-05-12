import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { THEME_STORAGE_KEY, ThemeContext, type Theme } from './themeContext';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = resolved;
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    theme === 'system' ? getSystemTheme() : theme,
  );

  // setTheme is the single write path. Updating React state, the DOM and
  // localStorage all happen here so we don't need an effect that calls
  // setState (which is what react-hooks/set-state-in-effect warns about).
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const nextResolved = next === 'system' ? getSystemTheme() : next;
    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
    if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  // When the user has chosen "system", react to OS-level theme changes.
  // applyTheme is a DOM side effect, not a React state update, so this
  // effect is "syncing with an external system" — exactly what useEffect
  // is meant for.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const next = getSystemTheme();
      setResolvedTheme(next);
      applyTheme(next);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
