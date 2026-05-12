import { describe, expect, it } from 'vitest';
import { fmtHex, fmtHsl, fmtRgb, parseColor } from '@/tools/text/color.lib';

describe('color', () => {
  it('parses #hex', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });
  it('parses #rgb shorthand', () => {
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });
  it('parses rgb()', () => {
    const c = parseColor('rgb(255, 0, 0)');
    expect(c).not.toBeNull();
    if (c) expect(fmtHex(c)).toBe('#ff0000');
  });
  it('parses hsl() and round-trips', () => {
    const c = parseColor('hsl(0, 100%, 50%)');
    expect(c).not.toBeNull();
    if (c) {
      expect(fmtRgb(c)).toBe('rgb(255, 0, 0)');
      expect(fmtHsl(c).startsWith('hsl(0,')).toBe(true);
    }
  });
  it('rejects garbage', () => {
    expect(parseColor('definitely not a color')).toBeNull();
  });
});
