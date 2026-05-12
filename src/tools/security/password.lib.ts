export interface Strength {
  /** 0..4 */
  level: 0 | 1 | 2 | 3 | 4;
  /** Approx Shannon entropy in bits */
  entropy: number;
  /** Crack time at 1e10 guesses/sec (offline fast attacker) */
  crackSeconds: number;
  tips: string[];
}

export type TipKey = 'len' | 'upper' | 'lower' | 'digit' | 'symbol' | 'noRepeat';

export function evaluatePassword(pw: string): Strength {
  if (!pw) {
    return { level: 0, entropy: 0, crackSeconds: 0, tips: ['len', 'upper', 'lower', 'digit', 'symbol'] };
  }
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  pool = Math.max(pool, 1);
  const entropy = pw.length * Math.log2(pool);
  // Penalties for repeats / sequences
  let penalty = 0;
  if (/(.)\1\1/.test(pw)) penalty += 6;
  if (/0123|1234|2345|3456|4567|5678|6789|abcd|qwer/i.test(pw)) penalty += 8;
  const adj = Math.max(0, entropy - penalty);
  const seconds = Math.pow(2, adj) / 1e10;

  const tips: TipKey[] = [];
  if (pw.length < 12) tips.push('len');
  if (!/[A-Z]/.test(pw)) tips.push('upper');
  if (!/[a-z]/.test(pw)) tips.push('lower');
  if (!/[0-9]/.test(pw)) tips.push('digit');
  if (!/[^A-Za-z0-9]/.test(pw)) tips.push('symbol');
  if (penalty > 0) tips.push('noRepeat');

  let level: Strength['level'] = 0;
  if (adj >= 28) level = 1;
  if (adj >= 50) level = 2;
  if (adj >= 70) level = 3;
  if (adj >= 90) level = 4;

  return { level, entropy: adj, crackSeconds: seconds, tips };
}

export function humanizeSeconds(s: number): string {
  if (!isFinite(s) || s > 1e15) return '∞';
  if (s < 1) return '< 1 s';
  const units: [number, string][] = [
    [60, 's'],
    [60, 'min'],
    [24, 'h'],
    [365, 'd'],
    [1000, 'y'],
  ];
  let v = s;
  let out = `${Math.round(v)} s`;
  for (let i = 0; i < units.length; i++) {
    const [div, _name] = units[i];
    if (v < div) break;
    v /= div;
    void _name;
    const next = i + 1 < units.length ? units[i + 1][1] : 'ky';
    out = `${v.toFixed(v >= 100 ? 0 : 1)} ${next}`;
  }
  return out;
}
