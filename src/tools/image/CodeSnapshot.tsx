import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFontEmbedCSS, toPng } from 'html-to-image';
import type { HighlighterCore } from 'shiki/core';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { copyBlob, downloadBlob } from '@/lib/copy';
import { useLocalState } from '@/lib/useLocalState';
import { cn } from '@/lib/cn';
import {
  BACKGROUNDS,
  clampCornerRadius,
  clampPadding,
  DEFAULT_CODE,
  FONTS,
  LANGUAGES,
  makeFilename,
  parseLineRanges,
  PIXEL_RATIOS,
  SHADOW_PRESETS,
  THEMES,
  TRAFFIC_LIGHT_COLORS,
  WINDOW_STYLES,
  type FontId,
  type Language,
  type PixelRatio,
  type ShadowId,
  type Theme,
  type WindowStyleId,
} from './codeSnapshot.lib';

/**
 * Lazy loaders for every language/theme in our allow-list. Keeping the
 * map explicit (rather than using the default `shiki` bundle) means the
 * bundler only pulls the grammars / themes we actually ship — the PWA
 * precache stays small.
 */
const LANG_LOADERS: Record<Language, () => Promise<unknown>> = {
  typescript: () => import('@shikijs/langs/typescript'),
  javascript: () => import('@shikijs/langs/javascript'),
  tsx: () => import('@shikijs/langs/tsx'),
  jsx: () => import('@shikijs/langs/jsx'),
  python: () => import('@shikijs/langs/python'),
  go: () => import('@shikijs/langs/go'),
  rust: () => import('@shikijs/langs/rust'),
  java: () => import('@shikijs/langs/java'),
  cpp: () => import('@shikijs/langs/cpp'),
  sql: () => import('@shikijs/langs/sql'),
  bash: () => import('@shikijs/langs/bash'),
  json: () => import('@shikijs/langs/json'),
  yaml: () => import('@shikijs/langs/yaml'),
  markdown: () => import('@shikijs/langs/markdown'),
  html: () => import('@shikijs/langs/html'),
  css: () => import('@shikijs/langs/css'),
};

const THEME_LOADERS: Record<Theme, () => Promise<unknown>> = {
  'github-dark': () => import('@shikijs/themes/github-dark'),
  'github-light': () => import('@shikijs/themes/github-light'),
  'one-dark-pro': () => import('@shikijs/themes/one-dark-pro'),
  dracula: () => import('@shikijs/themes/dracula'),
  'night-owl': () => import('@shikijs/themes/night-owl'),
  nord: () => import('@shikijs/themes/nord'),
  'solarized-light': () => import('@shikijs/themes/solarized-light'),
  'vitesse-light': () => import('@shikijs/themes/vitesse-light'),
};

/**
 * Loaders for bundled fonts. Importing the @fontsource latin/400 CSS
 * triggers Vite to inline the @font-face rule and emit the woff2 as
 * an asset chunk — both end up in the runtime cache, not the PWA
 * precache, so first load stays small.
 *
 * `system / menlo / consolas` need no loader (system fonts).
 */
const FONT_LOADERS: Partial<Record<FontId, () => Promise<unknown>>> = {
  'fira-code': () => import('@fontsource/fira-code/latin-400.css?inline'),
  'jetbrains-mono': () => import('@fontsource/jetbrains-mono/latin-400.css?inline'),
};

const loadedFonts = new Set<FontId>();
async function ensureFont(id: FontId): Promise<void> {
  if (loadedFonts.has(id)) return;
  const loader = FONT_LOADERS[id];
  if (!loader) {
    loadedFonts.add(id);
    return;
  }
  // Side-effect import — the @fontsource package's CSS calls @font-face,
  // which Vite injects into <head> as part of the chunk's setup.
  const mod = (await loader()) as { default?: string };
  if (typeof document !== 'undefined' && typeof mod.default === 'string') {
    // The `?inline` query gives us the raw CSS string; we inject it
    // ourselves so html-to-image's getFontEmbedCSS sees the rules.
    const style = document.createElement('style');
    style.dataset.codeSnapshotFont = id;
    style.textContent = mod.default;
    document.head.appendChild(style);
    // Wait until the browser actually has the font ready — otherwise
    // the first export captures a fallback face.
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  }
  loadedFonts.add(id);
}

/**
 * Singleton highlighter. Shiki's core init (WASM + engine) is expensive
 * so we build one on first use and then just `loadLanguage` / `loadTheme`
 * on demand for subsequent picks.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null;
async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/oniguruma'),
      ]);
      return createHighlighterCore({
        langs: [],
        themes: [],
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
      });
    })();
  }
  return highlighterPromise;
}

async function ensureLang(h: HighlighterCore, lang: Language) {
  if (h.getLoadedLanguages().includes(lang)) return;
  const mod = (await LANG_LOADERS[lang]()) as { default: unknown };
  await h.loadLanguage(mod.default as never);
}

async function ensureTheme(h: HighlighterCore, theme: Theme) {
  if (h.getLoadedThemes().includes(theme)) return;
  const mod = (await THEME_LOADERS[theme]()) as { default: unknown };
  await h.loadTheme(mod.default as never);
}

export default function CodeSnapshot() {
  const { t } = useTranslation();

  // Persisted tool state. Keys use the `code-snapshot.*` namespace.
  const [code, setCode] = useLocalState<string>('code-snapshot.code', DEFAULT_CODE);
  const [language, setLanguage] = useLocalState<Language>('code-snapshot.lang', 'typescript');
  const [theme, setTheme] = useLocalState<Theme>('code-snapshot.theme', 'github-dark');
  const [backgroundId, setBackgroundId] = useLocalState<string>(
    'code-snapshot.bg',
    BACKGROUNDS[0].id,
  );
  const [padding, setPadding] = useLocalState<number>('code-snapshot.padding', 64);
  const [fontId, setFontId] = useLocalState<FontId>('code-snapshot.font', 'system');
  const [shadowId, setShadowId] = useLocalState<ShadowId>('code-snapshot.shadow', 'strong');
  const [cornerRadius, setCornerRadius] = useLocalState<number>(
    'code-snapshot.corner',
    12,
  );
  const [windowStyle, setWindowStyle] = useLocalState<WindowStyleId>(
    'code-snapshot.windowStyle',
    'mac',
  );
  const [pixelRatio, setPixelRatio] = useLocalState<PixelRatio>('code-snapshot.ratio', 2);
  const [showLineNumbers, setShowLineNumbers] = useLocalState<boolean>(
    'code-snapshot.lineNumbers',
    false,
  );
  const [filename, setFilename] = useLocalState<string>('code-snapshot.filename', '');
  /** Free-form expression like `1,3-5,8`. Empty = no highlight. */
  const [highlightExpr, setHighlightExpr] = useLocalState<string>(
    'code-snapshot.highlight',
    '',
  );

  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  /**
   * Background color of the active shiki theme (e.g. `#fff` for GitHub Light,
   * `#24292e` for GitHub Dark). We use this for the card background so the
   * chrome matches the code area instead of being a hardcoded dark strip —
   * that looked broken under any light theme.
   */
  const [themeBg, setThemeBg] = useState<string>('#1e1e2e');
  const [busy, setBusy] = useState<null | 'export' | 'copy'>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const background = useMemo(
    () => BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0],
    [backgroundId],
  );
  const font = useMemo(() => FONTS.find((f) => f.id === fontId) ?? FONTS[0], [fontId]);
  const shadow = useMemo(
    () => SHADOW_PRESETS.find((s) => s.id === shadowId) ?? SHADOW_PRESETS[3],
    [shadowId],
  );
  /**
   * Re-parse the highlight expression on every change. The set is small
   * (typically <10 entries) and parseLineRanges is pure, so memoizing
   * just keeps the shiki effect from re-firing on unrelated re-renders.
   */
  const highlightSet = useMemo(() => parseLineRanges(highlightExpr), [highlightExpr]);
  const showWindow = windowStyle !== 'none';

  // Re-highlight whenever code / lang / theme / highlightSet changes. Shiki
  // calls are async so we guard against stale results with a cancellation
  // flag.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const h = await getHighlighter();
        await Promise.all([ensureLang(h, language), ensureTheme(h, theme)]);
        if (cancelled) return;
        const html = h.codeToHtml(code || ' ', {
          lang: language,
          theme,
          // Shiki gives every line a wrapper <span class="line"> with a
          // `line` field exposed to transformers; we tag the requested
          // ones with `data-highlighted` so CSS can style them.
          transformers:
            highlightSet.size > 0
              ? [
                  {
                    name: 'code-snapshot:highlight',
                    line(node, line) {
                      if (highlightSet.has(line)) {
                        node.properties = {
                          ...node.properties,
                          'data-highlighted': 'true',
                        };
                      }
                    },
                  },
                ]
              : undefined,
        });
        if (cancelled) return;
        // Pull the theme's own background so the card background can match it.
        const loaded = h.getTheme(theme);
        if (loaded?.bg) setThemeBg(loaded.bg);
        setHighlightedHtml(html);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, language, theme, highlightSet]);

  // Load (lazy) any selected bundled font so the preview shows it immediately.
  useEffect(() => {
    void ensureFont(fontId).catch(() => {
      // Falling back to the next stack entry is fine; surface nothing.
    });
  }, [fontId]);

  /**
   * Rasterize the preview node. We embed font CSS as data URLs so the PNG
   * uses the chosen font even when the SW intercepts woff2 requests.
   */
  async function rasterize(): Promise<Blob | null> {
    const node = captureRef.current;
    if (!node) return null;
    if (font.bundled) await ensureFont(fontId);
    const fontEmbedCSS = font.bundled ? await getFontEmbedCSS(node).catch(() => '') : '';
    const dataUrl = await toPng(node, {
      pixelRatio,
      cacheBust: true,
      backgroundColor: undefined,
      fontEmbedCSS,
    });
    return await (await fetch(dataUrl)).blob();
  }

  function flashToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  async function handleExport() {
    setBusy('export');
    try {
      const blob = await rasterize();
      if (!blob) return;
      downloadBlob(blob, makeFilename(language, { ratio: pixelRatio }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    setBusy('copy');
    try {
      const blob = await rasterize();
      if (!blob) return;
      const ok = await copyBlob(blob);
      if (ok) {
        flashToast(t('code-snapshot.copied', { ns: 'tools' }));
      } else {
        // Browser refused / unsupported — fall back to download so the
        // click still produces *something* for the user.
        downloadBlob(blob, makeFilename(language, { ratio: pixelRatio }));
        flashToast(t('code-snapshot.copyFallback', { ns: 'tools' }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Row 1: content controls */}
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <FieldHeader label={t('code-snapshot.language', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader label={t('code-snapshot.theme', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            {THEMES.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader label={t('code-snapshot.background', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={backgroundId}
            onChange={(e) => setBackgroundId(e.target.value)}
          >
            {BACKGROUNDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader
            label={`${t('code-snapshot.padding', { ns: 'tools' })} (${padding}px)`}
          />
          <input
            type="range"
            min={0}
            max={128}
            step={4}
            value={padding}
            onChange={(e) => setPadding(clampPadding(parseInt(e.target.value, 10)))}
            className="h-9 w-full"
          />
        </div>
      </div>

      {/* Row 2: appearance controls */}
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <FieldHeader label={t('code-snapshot.font', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={fontId}
            onChange={(e) => setFontId(e.target.value as FontId)}
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader label={t('code-snapshot.shadow', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={shadowId}
            onChange={(e) => setShadowId(e.target.value as ShadowId)}
          >
            {SHADOW_PRESETS.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`code-snapshot.shadows.${s.id}`, { ns: 'tools', defaultValue: s.label })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader
            label={`${t('code-snapshot.cornerRadius', { ns: 'tools' })} (${cornerRadius}px)`}
          />
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={cornerRadius}
            onChange={(e) => setCornerRadius(clampCornerRadius(parseInt(e.target.value, 10)))}
            className="h-9 w-full"
          />
        </div>
        <div>
          <FieldHeader label={t('code-snapshot.windowStyle', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={windowStyle}
            onChange={(e) => setWindowStyle(e.target.value as WindowStyleId)}
          >
            {WINDOW_STYLES.map((w) => (
              <option key={w.id} value={w.id}>
                {t(`code-snapshot.windowStyles.${w.id}`, { ns: 'tools', defaultValue: w.label })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: filename + highlight expression */}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <FieldHeader label={t('code-snapshot.filename', { ns: 'tools' })} />
          <input
            type="text"
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={t('code-snapshot.filenamePlaceholder', { ns: 'tools' })}
            spellCheck={false}
          />
        </div>
        <div>
          <FieldHeader label={t('code-snapshot.highlightLines', { ns: 'tools' })} />
          <input
            type="text"
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={highlightExpr}
            onChange={(e) => setHighlightExpr(e.target.value)}
            placeholder={t('code-snapshot.highlightPlaceholder', { ns: 'tools' })}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Row 4: toggle + export bar */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex select-none items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => setShowLineNumbers(e.target.checked)}
          />
          {t('code-snapshot.lineNumbers', { ns: 'tools' })}
        </label>
        <div className="ml-auto flex items-center gap-2">
          <FieldHeader
            asSpan
            className="mb-0"
            label={t('code-snapshot.pixelRatio', { ns: 'tools' })}
          />
          <select
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm"
            value={pixelRatio}
            onChange={(e) => setPixelRatio(Number(e.target.value) as PixelRatio)}
          >
            {PIXEL_RATIOS.map((r) => (
              <option key={r} value={r}>
                @{r}x
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleCopy} disabled={busy !== null || !highlightedHtml}>
            {busy === 'copy'
              ? t('code-snapshot.copying', { ns: 'tools' })
              : t('code-snapshot.copy', { ns: 'tools' })}
          </Button>
          <Button onClick={handleExport} disabled={busy !== null || !highlightedHtml}>
            {busy === 'export'
              ? t('code-snapshot.exporting', { ns: 'tools' })
              : t('code-snapshot.exportPng', { ns: 'tools' })}
          </Button>
        </div>
      </div>

      {/* Code input */}
      <div>
        <FieldHeader label={t('code-snapshot.code', { ns: 'tools' })} />
        <Textarea rows={8} value={code} onChange={(e) => setCode(e.target.value)} />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Preview — this is what gets rasterized. */}
      <div>
        <FieldHeader
          label={t('code-snapshot.preview', { ns: 'tools' })}
          action={
            toast ? (
              <span className="text-xs text-muted-fg" role="status">
                {toast}
              </span>
            ) : null
          }
        />
        <div className="overflow-auto rounded-xl border border-border bg-muted/40 p-4">
          <div
            ref={captureRef}
            className="mx-auto inline-block overflow-hidden"
            style={{
              background: background.css,
              padding: `${padding}px`,
              borderRadius: `${cornerRadius}px`,
            }}
          >
            {/* Carbon-style: traffic lights float on top of the code area,
                no separator. Sharing the theme background with the <pre>
                makes the chrome and the code feel like a single surface. */}
            <div
              className={cn('relative overflow-hidden', 'min-w-[320px] max-w-[880px]')}
              style={{
                boxShadow: shadow.css,
                backgroundColor: themeBg,
                borderRadius: `${cornerRadius}px`,
                fontFamily: font.stack,
              }}
            >
              {showWindow && (
                <WindowChrome style={windowStyle} filename={filename} background={themeBg} />
              )}
              <div
                className={cn(
                  '[&_pre]:!m-0 [&_pre]:!text-[14px] [&_pre]:!leading-[1.5]',
                  // Top padding makes room for the floating window chrome;
                  // mirrors Carbon's 48px when controls are present.
                  showWindow ? '[&_pre]:!pt-12' : '[&_pre]:!pt-5',
                  '[&_pre]:!pb-5 [&_pre]:!px-5',
                  // Force shiki's <pre> and <code> to honor our font choice
                  // — shiki's own inline style only sets colors, not family.
                  '[&_pre]:![font-family:inherit] [&_code]:![font-family:inherit]',
                  showLineNumbers && 'code-snapshot-line-numbers',
                  highlightSet.size > 0 && 'code-snapshot-highlight',
                )}
                // shiki output is trusted HTML with inline styles only.
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </div>
          </div>
        </div>
        {/* Line-number CSS injected only when the toggle is on. Uses
            shiki's `.line` wrapper class so we don't need plugins. */}
        {showLineNumbers && (
          <style>
            {`.code-snapshot-line-numbers pre code { counter-reset: ln; }
              .code-snapshot-line-numbers pre code .line { counter-increment: ln; }
              .code-snapshot-line-numbers pre code .line::before {
                content: counter(ln);
                display: inline-block;
                width: 2.25rem;
                margin-right: 1rem;
                text-align: right;
                opacity: .4;
                user-select: none;
              }
              .code-snapshot-line-numbers pre code .line[data-highlighted="true"]::before {
                opacity: .85;
              }`}
          </style>
        )}
        {/* Line-highlight CSS — extends the highlighted line edge-to-edge
            using a negative margin trick so it visually crosses the <pre>
            padding. Color uses currentColor mixed with the user's text
            color so it works against any theme. */}
        {highlightSet.size > 0 && (
          <style>
            {`.code-snapshot-highlight pre code .line[data-highlighted="true"] {
                display: inline-block;
                width: calc(100% + 2.5rem);
                margin: 0 -1.25rem;
                padding: 0 1.25rem;
                background-color: rgba(127, 127, 127, .18);
                box-shadow: inset 2px 0 0 0 rgba(127, 127, 127, .55);
              }`}
          </style>
        )}
      </div>
    </div>
  );
}

function WindowChrome({
  style,
  filename,
  background,
}: {
  style: WindowStyleId;
  filename: string;
  background: string;
}) {
  const trimmed = filename.trim();
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 flex h-12 items-center px-4"
      aria-hidden
    >
      {style === 'mac' ? <MacDots /> : <WindowsDots />}
      {trimmed && (
        <span
          className="absolute left-1/2 -translate-x-1/2 truncate font-medium opacity-70"
          style={{
            // Pick a readable text color based on luminance of the card.
            color: pickReadable(background),
            // Cap the title width so long names don't collide with the dots.
            maxWidth: 'calc(100% - 160px)',
            fontSize: '12px',
          }}
        >
          {trimmed}
        </span>
      )}
    </div>
  );
}

function MacDots() {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.red }}
      />
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.yellow }}
      />
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.green }}
      />
    </div>
  );
}

/**
 * Windows-style controls: minimize / maximize / close. Drawn with simple
 * unicode glyphs so we don't need icon assets — and html-to-image renders
 * them reliably across browsers.
 */
function WindowsDots() {
  // Glyphs from the BMP so any system font can render them.
  return (
    <div className="ml-auto flex items-center gap-3 text-xs opacity-60">
      <span aria-hidden>—</span>
      <span aria-hidden>▢</span>
      <span aria-hidden>×</span>
    </div>
  );
}

/**
 * Pick black or white for foreground based on the background's perceived
 * luminance. Accepts `#rrggbb` / `#rgb`; on anything else (gradients,
 * unknown formats) we conservatively return a translucent white.
 */
function pickReadable(bg: string): string {
  const m = bg.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return 'rgba(255,255,255,.85)';
  let hex = m[1];
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Rec. 601 luminance — fast and good enough for "is this background dark".
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? 'rgba(0,0,0,.65)' : 'rgba(255,255,255,.85)';
}
