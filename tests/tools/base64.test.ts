import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from '@/tools/security/base64.lib';

describe('base64', () => {
  it('roundtrips ASCII', () => {
    expect(decodeBase64(encodeBase64('Hello, world'))).toBe('Hello, world');
  });
  it('roundtrips UTF-8 (CJK + emoji)', () => {
    const s = '你好，世界 🌍 — DevTools Cafe';
    expect(decodeBase64(encodeBase64(s))).toBe(s);
  });
  it('handles empty string', () => {
    expect(encodeBase64('')).toBe('');
    expect(decodeBase64('')).toBe('');
  });
  it('decodes base64url variant', () => {
    const std = encodeBase64('hello?world>');
    const url = std.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decodeBase64(url)).toBe('hello?world>');
  });
  it('throws on invalid base64', () => {
    expect(() => decodeBase64('@@not-base64@@')).toThrow();
  });
});
