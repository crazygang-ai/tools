/**
 * Pure data / helpers for the Code Snapshot tool.
 *
 * The React component imports these; tests import from here directly
 * so they never need a DOM or shiki runtime.
 */

/** Languages exposed in v1. Values match shiki's bundledLanguages keys. */
export const LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'python',
  'go',
  'rust',
  'java',
  'cpp',
  'sql',
  'bash',
  'json',
  'yaml',
  'markdown',
  'html',
  'css',
] as const;
export type Language = (typeof LANGUAGES)[number];

/**
 * Themes exposed in v1. Values match shiki's bundledThemes keys.
 * We expose a light/dark mix so the tool doesn't feel opinionated.
 */
export const THEMES = [
  'github-dark',
  'github-light',
  'one-dark-pro',
  'dracula',
  'night-owl',
  'nord',
  'solarized-light',
  'vitesse-light',
] as const;
export type Theme = (typeof THEMES)[number];

export interface BackgroundPreset {
  id: string;
  label: string;
  /** Any valid CSS background value (color, gradient, ...). */
  css: string;
}

/**
 * Background presets. Pure CSS — no images, no remote assets — so the
 * Service Worker can cache the whole tool offline without surprises.
 */
export const BACKGROUNDS: readonly BackgroundPreset[] = [
  { id: 'sunset', label: 'Sunset', css: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
  { id: 'ocean', label: 'Ocean', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'mint', label: 'Mint', css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'peach', label: 'Peach', css: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { id: 'slate', label: 'Slate', css: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
  { id: 'plain-gray', label: 'Gray', css: '#abb8c3' },
  { id: 'plain-white', label: 'White', css: '#ffffff' },
  { id: 'plain-dark', label: 'Dark', css: '#0b0b0d' },
] as const;

export interface FontPreset {
  id: string;
  label: string;
  /** A complete font-family stack ending with a generic fallback. */
  stack: string;
  /** True when the font ships with the app (woff2 from @fontsource/*). */
  bundled: boolean;
}

/**
 * Font presets. We bundle two web fonts (Fira Code, JetBrains Mono) and
 * lean on system monospace stacks for the rest. Keeping the list to ~5
 * entries means every export looks intentional — no analysis-paralysis.
 */
export const FONTS: readonly FontPreset[] = [
  {
    id: 'system',
    label: 'System Mono',
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
    bundled: false,
  },
  {
    id: 'menlo',
    label: 'Menlo',
    stack: 'Menlo, Monaco, "Courier New", monospace',
    bundled: false,
  },
  {
    id: 'consolas',
    label: 'Consolas',
    stack: 'Consolas, "Liberation Mono", "Courier New", monospace',
    bundled: false,
  },
  {
    id: 'fira-code',
    label: 'Fira Code',
    stack: '"Fira Code", ui-monospace, monospace',
    bundled: true,
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    stack: '"JetBrains Mono", ui-monospace, monospace',
    bundled: true,
  },
] as const;
export type FontId = (typeof FONTS)[number]['id'];

/**
 * Card shadow presets. Box-shadow values, applied to the code card.
 * Four steps cover the realistic styling space — a slider would be more
 * precise but visually overkill for a screenshot tool.
 */
export const SHADOW_PRESETS = [
  { id: 'none', label: 'None', css: 'none' },
  { id: 'soft', label: 'Soft', css: '0 8px 24px rgba(0,0,0,.25)' },
  { id: 'medium', label: 'Medium', css: '0 14px 44px rgba(0,0,0,.4)' },
  { id: 'strong', label: 'Strong', css: '0 20px 68px rgba(0,0,0,.55)' },
] as const;
export type ShadowId = (typeof SHADOW_PRESETS)[number]['id'];

/** Window chrome style. */
export const WINDOW_STYLES = [
  { id: 'mac', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'none', label: 'None' },
] as const;
export type WindowStyleId = (typeof WINDOW_STYLES)[number]['id'];

/** Pixel ratios for export. Maps directly to html-to-image's `pixelRatio`. */
export const PIXEL_RATIOS = [1, 2, 3] as const;
export type PixelRatio = (typeof PIXEL_RATIOS)[number];

/** Default example shown when the user opens the tool for the first time. */
export const DEFAULT_CODE = `// A lazy mountain in one line.
function lazy<T>(load: () => Promise<T>) {
  let p: Promise<T> | null = null;
  return () => (p ??= load());
}

const config = lazy(() => fetch('/config.json').then((r) => r.json()));
`;

/** macOS-style traffic-light colors. Exported so tests can assert on them. */
export const TRAFFIC_LIGHT_COLORS = {
  red: '#ff5f56',
  yellow: '#ffbd2e',
  green: '#27c93f',
} as const;

/**
 * Derive a safe filename for the exported PNG.
 * We strip characters that don't play nicely with OS filesystems and fall
 * back to `code-snapshot` if the input is all junk. The optional `ratio`
 * appends an `_@2x` style suffix so multiple exports at different DPRs
 * don't collide in the user's downloads folder.
 */
export function makeFilename(
  language: string,
  options: { ratio?: number; timestamp?: number } = {},
): string {
  const { ratio, timestamp = Date.now() } = options;
  const lang = language
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const stamp = new Date(timestamp)
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace(/T/, '_')
    .replace(/Z$/, '');
  const base = lang ? `code-${lang}` : 'code-snapshot';
  const suffix = ratio && ratio > 0 ? `_@${ratio}x` : '';
  return `${base}_${stamp}${suffix}.png`;
}

/** Map a UI padding slider value (px) to a safe range. */
export function clampPadding(px: number): number {
  if (!Number.isFinite(px)) return 32;
  return Math.min(128, Math.max(0, Math.round(px)));
}

/** Same shape for the corner-radius slider. */
export function clampCornerRadius(px: number): number {
  if (!Number.isFinite(px)) return 12;
  return Math.min(24, Math.max(0, Math.round(px)));
}

/**
 * Parse a line-highlight expression like `1,3-5,8` into a Set of 1-based
 * line numbers. Tolerant of:
 *   - whitespace around tokens (`1, 3-5 , 8`)
 *   - reversed ranges (`5-3` → 3,4,5)
 *   - duplicates (deduped naturally by the Set)
 *   - empty input (returns an empty Set)
 *   - junk tokens (silently ignored — better than throwing in a UI)
 *
 * Returns an empty Set for invalid input rather than throwing because
 * this powers a live preview where every keystroke calls it.
 */
export function parseLineRanges(input: string): Set<number> {
  const out = new Set<number>();
  if (!input) return out;
  for (const raw of input.split(',')) {
    const token = raw.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const a = parseInt(range[1], 10);
      const b = parseInt(range[2], 10);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let i = lo; i <= hi; i++) {
        if (i > 0) out.add(i);
      }
      continue;
    }
    if (/^\d+$/.test(token)) {
      const n = parseInt(token, 10);
      if (n > 0) out.add(n);
    }
    // Anything else: silently ignore.
  }
  return out;
}
