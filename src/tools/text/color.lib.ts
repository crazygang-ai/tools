export interface RGB { r: number; g: number; b: number; a: number }
export interface HSL { h: number; s: number; l: number; a: number }
export interface HSV { h: number; s: number; v: number; a: number }

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // hex
  let m = /^#?([0-9a-f]{3,8})$/i.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('') + 'ff';
    else if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    else if (h.length === 6) h += 'ff';
    if (h.length !== 8) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = parseInt(h.slice(6, 8), 16) / 255;
    return { r, g, b, a };
  }

  // rgb / rgba
  m = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length === 3 || parts.length === 4) {
      const [r, g, b, a = '1'] = parts;
      return {
        r: clamp(parseFloat(r), 0, 255),
        g: clamp(parseFloat(g), 0, 255),
        b: clamp(parseFloat(b), 0, 255),
        a: clamp(parseFloat(a), 0, 1),
      };
    }
  }

  // hsl / hsla
  m = /^hsla?\(([^)]+)\)$/i.exec(s);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length === 3 || parts.length === 4) {
      const h = parseFloat(parts[0]);
      const sat = parseFloat(parts[1].replace('%', '')) / 100;
      const l = parseFloat(parts[2].replace('%', '')) / 100;
      const a = parts[3] !== undefined ? clamp(parseFloat(parts[3]), 0, 1) : 1;
      return hslToRgb({ h, s: sat, l, a });
    }
  }

  return null;
}

export function rgbToHex({ r, g, b, a }: RGB): string {
  const h = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a < 1 ? base + h(a * 255) : base;
}

export function rgbToHsl({ r, g, b, a }: RGB): HSL {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60; break;
      case g1: h = ((b1 - r1) / d + 2) * 60; break;
      case b1: h = ((r1 - g1) / d + 4) * 60; break;
    }
  }
  return { h, s, l, a };
}

export function hslToRgb({ h, s, l, a }: HSL): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r: number, g: number, b: number;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
    a,
  };
}

export function rgbToHsv({ r, g, b, a }: RGB): HSV {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60; break;
      case g1: h = ((b1 - r1) / d + 2) * 60; break;
      case b1: h = ((r1 - g1) / d + 4) * 60; break;
    }
  }
  return { h, s, v, a };
}

export function fmtHex(c: RGB): string { return rgbToHex(c); }
export function fmtRgb(c: RGB): string {
  const r = Math.round(c.r), g = Math.round(c.g), b = Math.round(c.b);
  return c.a < 1 ? `rgba(${r}, ${g}, ${b}, ${+c.a.toFixed(3)})` : `rgb(${r}, ${g}, ${b})`;
}
export function fmtHsl(c: RGB): string {
  const h = rgbToHsl(c);
  const H = Math.round(h.h), S = Math.round(h.s * 100), L = Math.round(h.l * 100);
  return c.a < 1 ? `hsla(${H}, ${S}%, ${L}%, ${+c.a.toFixed(3)})` : `hsl(${H}, ${S}%, ${L}%)`;
}
export function fmtHsv(c: RGB): string {
  const h = rgbToHsv(c);
  const H = Math.round(h.h), S = Math.round(h.s * 100), V = Math.round(h.v * 100);
  return `hsv(${H}, ${S}%, ${V}%)`;
}
