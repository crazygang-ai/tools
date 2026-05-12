import { describe, expect, it } from 'vitest';
import { FONTS, render } from '@/tools/text/asciiArt.lib';

describe('asciiArt.render', () => {
  it('returns empty string for empty input', () => {
    expect(render('', 'Standard')).toBe('');
  });

  it('produces multi-line output for the Standard font', () => {
    const out = render('Hi', 'Standard');
    // Smoke test: figlet always emits at least a few rows for non-empty
    // input. We don't snapshot the exact glyphs because future figlet
    // bumps could legitimately tweak whitespace/baseline rows.
    expect(out.split('\n').length).toBeGreaterThan(2);
    expect(out.length).toBeGreaterThan(10);
  });

  it('exposes the curated font list', () => {
    expect(FONTS).toContain('Standard');
    expect(FONTS).toContain('Slant');
    expect(FONTS.length).toBeGreaterThanOrEqual(6);
  });

  it('all curated fonts render without throwing', () => {
    for (const f of FONTS) {
      const out = render('Ok', f);
      expect(out.length).toBeGreaterThan(0);
    }
  });
});
