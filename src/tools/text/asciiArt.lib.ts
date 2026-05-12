import figlet from 'figlet';
import Standard from 'figlet/importable-fonts/Standard.js';
import Slant from 'figlet/importable-fonts/Slant.js';
import Big from 'figlet/importable-fonts/Big.js';
import Ghost from 'figlet/importable-fonts/Ghost.js';
import AnsiShadow from 'figlet/importable-fonts/ANSI Shadow.js';
import Doom from 'figlet/importable-fonts/Doom.js';
import ThreeDAscii from 'figlet/importable-fonts/3D-ASCII.js';
import Small from 'figlet/importable-fonts/Small.js';

// Curated subset — keeping the bundle ~100KB instead of pulling in all 600+
// figlet fonts. Order here is the order shown in the dropdown.
export const FONTS = [
  'Standard',
  'Slant',
  'Big',
  'Small',
  'Ghost',
  'Doom',
  'ANSI Shadow',
  '3D-ASCII',
] as const;
export type Font = (typeof FONTS)[number];

let registered = false;
function registerFonts() {
  if (registered) return;
  figlet.parseFont('Standard', Standard);
  figlet.parseFont('Slant', Slant);
  figlet.parseFont('Big', Big);
  figlet.parseFont('Small', Small);
  figlet.parseFont('Ghost', Ghost);
  figlet.parseFont('Doom', Doom);
  figlet.parseFont('ANSI Shadow', AnsiShadow);
  figlet.parseFont('3D-ASCII', ThreeDAscii);
  registered = true;
}

/**
 * Render text into ASCII art. Empty input returns an empty string. Errors
 * (unknown font, internal figlet failure) are swallowed so the UI can show
 * a stable empty state instead of crashing.
 */
export function render(text: string, font: Font): string {
  if (!text) return '';
  registerFonts();
  try {
    // figlet's `Fonts` type is a closed string union of every built-in
    // font, declared inside a namespace. Under `verbatimModuleSyntax`
    // it can't be re-exported as a type. Our `font` is already a string
    // at runtime — pass it as a string through a single-arg overload
    // by widening to the same shape figlet's options accept.
    return figlet.textSync(text, { font } as Parameters<typeof figlet.textSync>[1]);
  } catch {
    return '';
  }
}

export type Theme = 'light' | 'dark' | 'transparent';

interface CanvasOpts {
  theme?: Theme;
  fontSize?: number;
  padding?: number;
}

const THEME_COLORS: Record<Exclude<Theme, 'transparent'>, { bg: string; fg: string }> = {
  light: { bg: '#ffffff', fg: '#0a0a0a' },
  dark: { bg: '#0a0a0a', fg: '#e5e5e5' },
};

/**
 * Rasterise an ASCII art block to a canvas. Each line is drawn with
 * fillText against a monospace font; the canvas is sized exactly to the
 * widest line × line count plus padding, then upscaled by devicePixelRatio
 * so the export looks crisp on retina displays.
 *
 * Theme controls the background:
 *   - light:       white bg, black fg
 *   - dark:        near-black bg, light fg
 *   - transparent: no fillRect, fg defaults to black so the image still
 *                  reads on light surfaces (a screenshot host can darken
 *                  the surrounding chrome without affecting the glyphs).
 */
export function renderToCanvas(art: string, opts: CanvasOpts = {}): HTMLCanvasElement {
  const { theme = 'light', fontSize = 16, padding = 24 } = opts;
  const lineHeight = Math.round(fontSize * 1.1);
  const fontSpec = `${fontSize}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;

  const probe = document.createElement('canvas').getContext('2d');
  if (!probe) throw new Error('canvas 2d context unavailable');
  probe.font = fontSpec;
  // figlet output is monospace. Measuring a single 'M' is enough — and a
  // lot cheaper than measuring every line.
  const charWidth = probe.measureText('M').width;

  const lines = art.split('\n');
  const maxLen = lines.reduce((m, l) => (l.length > m ? l.length : m), 0);
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.ceil(maxLen * charWidth + padding * 2);
  const cssHeight = Math.ceil(lines.length * lineHeight + padding * 2);

  const canvas = document.createElement('canvas');
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  ctx.scale(dpr, dpr);

  let fg: string;
  if (theme === 'transparent') {
    fg = '#0a0a0a';
  } else {
    const c = THEME_COLORS[theme];
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    fg = c.fg;
  }
  ctx.fillStyle = fg;
  ctx.font = fontSpec;
  ctx.textBaseline = 'top';

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], padding, padding + i * lineHeight);
  }
  return canvas;
}

export function downloadPng(canvas: HTMLCanvasElement, filename = 'ascii-art.png'): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Copy the canvas as a PNG into the clipboard. Returns false if the
 * platform doesn't support image clipboard writes (Safari < 16, Firefox
 * without dom.events.asyncClipboard.clipboardItem). Caller can fall back
 * to download in that case.
 */
export async function copyPngToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false;
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}
