import { describe, expect, it } from 'vitest';
import { humanize, nextRuns, parseCron } from '@/tools/text/cron.lib';

describe('cron', () => {
  it('parses every minute', () => {
    const p = parseCron('* * * * *');
    expect(p.minute).toHaveLength(60);
    expect(p.hour).toHaveLength(24);
  });
  it('parses ranges and steps', () => {
    const p = parseCron('*/15 9-17 * * 1-5');
    expect(p.minute).toEqual([0, 15, 30, 45]);
    expect(p.hour).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    expect(p.dow).toEqual([1, 2, 3, 4, 5]);
  });
  it('throws on bad expression', () => {
    expect(() => parseCron('* * * *')).toThrow();
    expect(() => parseCron('60 * * * *')).toThrow();
  });
  it('lists next 3 runs for daily 9:00', () => {
    const runs = nextRuns('0 9 * * *', new Date('2024-01-01T00:00:00Z'), 3);
    expect(runs).toHaveLength(3);
    for (const d of runs) expect(d.getHours()).toBe(9);
  });
  it('humanize', () => {
    expect(humanize('* * * * *')).toBe('Every minute');
  });
});
