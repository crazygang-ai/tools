/**
 * Minimal cron parser supporting standard 5-field syntax with:
 * - star *
 * - lists  a,b,c
 * - ranges a-b
 * - steps  star/n  or  a-b/n
 *
 * Returns the next N matching dates after `from`.
 */

export interface ParsedCron {
  minute: number[];
  hour: number[];
  dom: number[];
  month: number[];
  dow: number[];
}

const RANGES: { min: number; max: number }[] = [
  { min: 0, max: 59 }, // minute
  { min: 0, max: 23 }, // hour
  { min: 1, max: 31 }, // dom
  { min: 1, max: 12 }, // month
  { min: 0, max: 6 }, // dow (0 = Sun)
];

function expandField(field: string, idx: number): number[] {
  const { min, max } = RANGES[idx];
  const out = new Set<number>();
  for (const piece of field.split(',')) {
    const [rangePart, stepPart] = piece.split('/');
    const step = stepPart ? parseInt(stepPart, 10) : 1;
    if (step <= 0 || isNaN(step)) throw new Error(`Bad step in field ${idx + 1}`);
    let lo = min, hi = max;
    if (rangePart !== '*' && rangePart !== '') {
      const [a, b] = rangePart.split('-').map((s) => parseInt(s, 10));
      if (isNaN(a)) throw new Error(`Bad value in field ${idx + 1}`);
      lo = a;
      hi = isNaN(b) ? (stepPart ? max : a) : b;
    }
    if (lo < min || hi > max) throw new Error(`Out of range in field ${idx + 1}`);
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return Array.from(out).sort((a, b) => a - b);
}

export function parseCron(expr: string): ParsedCron {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error('Cron expression must have exactly 5 fields');
  const [m, h, d, mo, w] = parts.map((p, i) => expandField(p, i));
  return { minute: m, hour: h, dom: d, month: mo, dow: w };
}

export function nextRuns(expr: string, from: Date, count = 5): Date[] {
  const p = parseCron(expr);
  const out: Date[] = [];
  // Start from the next minute
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  // Cap iterations to avoid infinite loop on impossible expressions
  for (let safety = 0; safety < 366 * 24 * 60 && out.length < count; safety++) {
    if (
      p.minute.includes(cursor.getMinutes()) &&
      p.hour.includes(cursor.getHours()) &&
      p.month.includes(cursor.getMonth() + 1) &&
      p.dom.includes(cursor.getDate()) &&
      p.dow.includes(cursor.getDay())
    ) {
      out.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return out;
}

export function humanize(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return '—';
  const [m, h, d, mo, w] = parts;
  if (expr.trim() === '* * * * *') return 'Every minute';
  if (m !== '*' && h === '*' && d === '*' && mo === '*' && w === '*') return `At minute ${m} of every hour`;
  if (m !== '*' && h !== '*' && d === '*' && mo === '*' && w === '*') return `Daily at ${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  if (m === '0' && h === '0' && d === '*' && mo === '*' && w === '*') return 'Daily at midnight';
  return `${m} ${h} ${d} ${mo} ${w}`;
}
