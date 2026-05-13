import { describe, expect, it } from 'vitest';
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
} from '@/tools/image/codeSnapshot.lib';

describe('codeSnapshot.lib', () => {
  describe('constants', () => {
    it('exposes a non-empty language list with unique entries', () => {
      expect(LANGUAGES.length).toBeGreaterThan(0);
      expect(new Set(LANGUAGES).size).toBe(LANGUAGES.length);
    });
    it('exposes a non-empty theme list with unique entries', () => {
      expect(THEMES.length).toBeGreaterThan(0);
      expect(new Set(THEMES).size).toBe(THEMES.length);
    });
    it('exposes background presets with unique ids and non-empty css', () => {
      expect(BACKGROUNDS.length).toBeGreaterThan(0);
      const ids = BACKGROUNDS.map((b) => b.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const b of BACKGROUNDS) {
        expect(b.css.length).toBeGreaterThan(0);
      }
    });
    it('exposes font presets with unique ids and an explicit fallback', () => {
      expect(FONTS.length).toBeGreaterThan(0);
      const ids = FONTS.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const f of FONTS) {
        // Every stack must end with `monospace` so we never fall through
        // to a proportional system font on exotic platforms.
        expect(f.stack).toMatch(/monospace\s*$/);
      }
    });
    it('exposes shadow presets with unique ids', () => {
      expect(SHADOW_PRESETS.length).toBeGreaterThan(0);
      const ids = SHADOW_PRESETS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it('exposes window-style presets with unique ids', () => {
      expect(WINDOW_STYLES.length).toBeGreaterThan(0);
      const ids = WINDOW_STYLES.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it('lists pixel ratios in ascending order', () => {
      const sorted = [...PIXEL_RATIOS].sort((a, b) => a - b);
      expect([...PIXEL_RATIOS]).toEqual(sorted);
    });
    it('has traffic light colors as valid hex strings', () => {
      for (const c of Object.values(TRAFFIC_LIGHT_COLORS)) {
        expect(c).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
    it('ships a default code sample', () => {
      expect(DEFAULT_CODE.length).toBeGreaterThan(0);
    });
  });

  describe('clampPadding', () => {
    it('clamps below zero', () => {
      expect(clampPadding(-10)).toBe(0);
    });
    it('clamps above 128', () => {
      expect(clampPadding(500)).toBe(128);
    });
    it('rounds floats', () => {
      expect(clampPadding(31.6)).toBe(32);
    });
    it('defaults NaN / Infinity to 32', () => {
      expect(clampPadding(Number.NaN)).toBe(32);
      expect(clampPadding(Number.POSITIVE_INFINITY)).toBe(32);
    });
  });

  describe('clampCornerRadius', () => {
    it('clamps below zero', () => {
      expect(clampCornerRadius(-1)).toBe(0);
    });
    it('clamps above 24', () => {
      expect(clampCornerRadius(99)).toBe(24);
    });
    it('rounds floats', () => {
      expect(clampCornerRadius(11.4)).toBe(11);
    });
    it('defaults NaN to 12', () => {
      expect(clampCornerRadius(Number.NaN)).toBe(12);
    });
  });

  describe('makeFilename', () => {
    const fixedTs = Date.UTC(2026, 4, 12, 10, 30, 0); // 2026-05-12T10:30:00Z

    it('includes language and .png extension', () => {
      const name = makeFilename('typescript', { timestamp: fixedTs });
      expect(name.startsWith('code-typescript_')).toBe(true);
      expect(name.endsWith('.png')).toBe(true);
    });
    it('sanitizes weird characters in language', () => {
      const name = makeFilename('C++', { timestamp: fixedTs });
      expect(name).toMatch(/^code-c_/);
      expect(name).not.toContain('+');
    });
    it('falls back to code-snapshot when language is all junk', () => {
      const name = makeFilename('!!!', { timestamp: fixedTs });
      expect(name.startsWith('code-snapshot_')).toBe(true);
    });
    it('embeds a colon-free timestamp safe for filesystems', () => {
      const name = makeFilename('go', { timestamp: fixedTs });
      const stem = name.replace(/\.png$/, '');
      expect(stem).not.toContain(':');
      expect(stem).not.toContain('.');
      expect(name).toMatch(/^code-go_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}-\d{3}\.png$/);
    });
    it('appends a pixel-ratio suffix when ratio is given', () => {
      expect(makeFilename('go', { timestamp: fixedTs, ratio: 2 })).toMatch(/_@2x\.png$/);
      expect(makeFilename('go', { timestamp: fixedTs, ratio: 3 })).toMatch(/_@3x\.png$/);
    });
    it('omits the suffix for ratio 0 / undefined', () => {
      expect(makeFilename('go', { timestamp: fixedTs })).not.toContain('@');
      expect(makeFilename('go', { timestamp: fixedTs, ratio: 0 })).not.toContain('@');
    });
    it('still works with no options arg (uses Date.now)', () => {
      expect(makeFilename('rust')).toMatch(/^code-rust_/);
    });
  });

  describe('parseLineRanges', () => {
    it('returns an empty set for empty / whitespace input', () => {
      expect(parseLineRanges('')).toEqual(new Set());
      expect(parseLineRanges('   ')).toEqual(new Set());
      expect(parseLineRanges(',,,')).toEqual(new Set());
    });
    it('parses a single number', () => {
      expect(parseLineRanges('7')).toEqual(new Set([7]));
    });
    it('parses a comma list', () => {
      expect(parseLineRanges('1,3,5')).toEqual(new Set([1, 3, 5]));
    });
    it('parses a range', () => {
      expect(parseLineRanges('3-5')).toEqual(new Set([3, 4, 5]));
    });
    it('mixes ranges and singles', () => {
      expect(parseLineRanges('1,3-5,8')).toEqual(new Set([1, 3, 4, 5, 8]));
    });
    it('tolerates whitespace', () => {
      expect(parseLineRanges('  1 , 3 - 5 , 8  ')).toEqual(new Set([1, 3, 4, 5, 8]));
    });
    it('handles reversed ranges', () => {
      expect(parseLineRanges('5-3')).toEqual(new Set([3, 4, 5]));
    });
    it('dedupes overlapping ranges', () => {
      expect(parseLineRanges('1-3,2-4')).toEqual(new Set([1, 2, 3, 4]));
    });
    it('drops zero and negative tokens', () => {
      expect(parseLineRanges('0,1,-2')).toEqual(new Set([1]));
    });
    it('silently ignores junk tokens', () => {
      expect(parseLineRanges('abc,1,foo-bar,3')).toEqual(new Set([1, 3]));
    });
  });
});
