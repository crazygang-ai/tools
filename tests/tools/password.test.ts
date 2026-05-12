import { describe, expect, it } from 'vitest';
import { evaluatePassword } from '@/tools/security/password.lib';

describe('password strength', () => {
  it('empty has level 0', () => {
    expect(evaluatePassword('').level).toBe(0);
  });
  it('weak short password is at most level 1', () => {
    expect(evaluatePassword('abc').level).toBeLessThanOrEqual(1);
  });
  it('mixed strong long password reaches at least level 3', () => {
    expect(evaluatePassword('Tr0ub4dor&3xample!').level).toBeGreaterThanOrEqual(3);
  });
  it('detects missing classes via tips', () => {
    const r = evaluatePassword('alllowercase');
    expect(r.tips).toContain('upper');
    expect(r.tips).toContain('digit');
    expect(r.tips).toContain('symbol');
  });
});
