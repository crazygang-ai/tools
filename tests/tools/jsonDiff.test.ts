import { describe, expect, it } from 'vitest';
import { diffJson } from '@/tools/format/jsonDiff.lib';

describe('json diff', () => {
  it('detects identical', () => {
    const r = diffJson({ a: 1 }, { a: 1 });
    expect(r.add + r.del + r.mod).toBe(0);
  });
  it('detects add / del / mod', () => {
    const r = diffJson({ a: 1, b: 2 }, { a: 1, c: 3 });
    expect(r.add).toBe(1);
    expect(r.del).toBe(1);
  });
  it('walks nested objects', () => {
    const r = diffJson({ a: { x: 1 } }, { a: { x: 2 } });
    expect(r.mod).toBe(1);
  });
});
