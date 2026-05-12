import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Per-tool state that persists across reloads.
 *
 * Stored under `localStorage["tools.state.<key>"]` as JSON. The hook is
 * intentionally simple — no codecs, no debounce, no size cap — because
 * localStorage already gives us synchronous reads, atomic writes, and
 * a generous (~5MB) quota. If JSON.stringify or .parse throws (cyclic
 * value, quota exceeded, disabled storage in private mode), we fall back
 * to in-memory state so the tool keeps working.
 *
 * Usage:
 *   const [text, setText] = useLocalState('regex.text', '');
 *
 * Naming convention: `<tool>.<field>` so collisions are obvious in devtools.
 */
const STORAGE_PREFIX = 'tools.state.';

function read<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage disabled — silently degrade to in-memory.
  }
}

export function useLocalState<T>(key: string, defaultValue: T): [T, (next: T) => void] {
  // Lazy initializer so we only hit localStorage once on mount.
  const [value, setValue] = useState<T>(() => read(key, defaultValue));

  // Persist on every change. Skip the very first render so we don't
  // immediately re-write the value we just read.
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    write(key, value);
  }, [key, value]);

  const set = useCallback((next: T) => setValue(next), []);
  return [value, set];
}
