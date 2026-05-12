import { describe, expect, it } from 'vitest';
import { decodeJwt } from '@/tools/security/jwt.lib';
import { encodeBase64 } from '@/tools/security/base64.lib';

function b64url(obj: unknown): string {
  return encodeBase64(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

describe('jwt-decode', () => {
  it('decodes header and payload', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '42', name: 'Jane' };
    const token = `${b64url(header)}.${b64url(payload)}.signature`;
    const r = decodeJwt(token);
    expect(r.header).toEqual(header);
    expect(r.payload).toEqual(payload);
    expect(r.signature).toBe('signature');
  });
  it('rejects malformed tokens', () => {
    expect(() => decodeJwt('only.two')).toThrow();
    expect(() => decodeJwt('')).toThrow();
  });
});
