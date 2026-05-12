import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Soft cap on URL parameter length. Browsers can handle much more (Chrome
 * tops out around 32k for the full URL), but at this size:
 *  - "share this link" pasted into Slack/WeChat starts getting line-wrapped
 *    or silently truncated by some clients
 *  - the address bar becomes unreadable
 * Above the cap we drop URL persistence and keep the value in component
 * state only — the user can still work, the URL just doesn't track it.
 */
const MAX_PARAM_LENGTH = 2048;

export interface Codec<T> {
  parse: (raw: string) => T;
  serialize: (value: T) => string;
  /** Default value, used when the URL doesn't have the key. */
  defaultValue: T;
}

/**
 * Codecs MUST be stable across the lifetime of the component — either
 * defined at module top level (preferred) or wrapped in `useMemo`.
 * The hook captures the codec once on mount; later identity changes are
 * ignored at runtime and warned in dev so misuse is caught early.
 */
export const stringCodec = (defaultValue = ''): Codec<string> => ({
  parse: (raw) => raw,
  serialize: (v) => v,
  defaultValue,
});

export const enumCodec = <T extends string>(values: readonly T[], defaultValue: T): Codec<T> => ({
  parse: (raw) => (values.includes(raw as T) ? (raw as T) : defaultValue),
  serialize: (v) => v,
  defaultValue,
});

export const numberCodec = (defaultValue: number, min?: number, max?: number): Codec<number> => ({
  parse: (raw) => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return defaultValue;
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  },
  serialize: (v) => v.toString(),
  defaultValue,
});

export const boolCodec = (defaultValue = false): Codec<boolean> => ({
  parse: (raw) => raw === '1' || raw === 'true',
  serialize: (v) => (v ? '1' : '0'),
  defaultValue,
});

interface Options {
  /** Milliseconds to wait before pushing to URL after a change. Avoids one history entry per keystroke. Default 300. */
  debounceMs?: number;
  /**
   * If the serialized value exceeds this length, omit the key from the URL.
   * Defaults to MAX_PARAM_LENGTH (2KB).
   */
  maxLength?: number;
}

/**
 * Read-and-write hook for a single URL search-param-backed piece of state.
 *
 * Design notes:
 *  - Uses `replace` (not `push`) when updating the URL: typing in a textarea
 *    shouldn't blow up the back-button history.
 *  - Debounces URL writes so rapid typing doesn't churn `history.replaceState`.
 *  - Drops URL persistence above `maxLength` so a 50KB JSON paste doesn't
 *    explode the address bar — the value still lives in local state.
 *  - When the URL changes from outside (back button, link click), the local
 *    state re-syncs.
 *  - When the serialized value equals the default, the param is omitted —
 *    keeps URLs clean for unmodified state.
 *  - The codec is captured once on mount (via useState initializer). Later
 *    identity changes are ignored to avoid a "new codec object every render
 *    → effect re-fires → setParams → re-render → repeat" infinite loop when
 *    a caller forgets to lift the codec to module scope. In dev we warn so
 *    the misuse surfaces immediately.
 */
export function useUrlState<T>(
  key: string,
  codec: Codec<T>,
  options: Options = {},
): [T, (next: T) => void] {
  const { debounceMs = 300, maxLength = MAX_PARAM_LENGTH } = options;
  const [params, setParams] = useSearchParams();

  // Capture codec once. The initializer runs only on mount, so subsequent
  // renders that pass a fresh literal don't perturb anything internally.
  const [stableCodec] = useState(() => codec);

  if (import.meta.env.DEV && codec !== stableCodec) {
    console.warn(
      `[useUrlState] codec for key "${key}" changed identity between renders. ` +
        `Move it to module scope or wrap it in useMemo — the new codec will be ignored.`,
    );
  }

  const fromUrl = useMemo<T>(() => {
    const raw = params.get(key);
    return raw === null ? stableCodec.defaultValue : stableCodec.parse(raw);
  }, [params, key, stableCodec]);

  // Local mirror so typing feels instant while we debounce the URL write.
  const [local, setLocal] = useState<T>(fromUrl);

  // Track the last value we wrote, so when the URL changes from outside
  // (back button, programmatic link), we can detect "this is a new value
  // we didn't write" and pull it in. Compare serialized forms to keep the
  // check stable for value types like arrays/objects.
  const lastWritten = useRef<string>(stableCodec.serialize(fromUrl));

  useEffect(() => {
    const fromUrlSerialized = stableCodec.serialize(fromUrl);
    if (fromUrlSerialized !== lastWritten.current) {
      lastWritten.current = fromUrlSerialized;
      setLocal(fromUrl);
    }
  }, [fromUrl, stableCodec]);

  const setValue = useCallback(
    (next: T) => {
      setLocal(next);
      lastWritten.current = stableCodec.serialize(next);
    },
    [stableCodec],
  );

  // Debounced URL write.
  useEffect(() => {
    const handle = setTimeout(() => {
      const serialized = stableCodec.serialize(local);
      const isDefault = serialized === stableCodec.serialize(stableCodec.defaultValue);
      const tooLong = serialized.length > maxLength;
      setParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (isDefault || tooLong) nextParams.delete(key);
          else nextParams.set(key, serialized);
          return nextParams;
        },
        { replace: true },
      );
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [local, key, stableCodec, debounceMs, maxLength, setParams]);

  return [local, setValue];
}
