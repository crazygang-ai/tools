import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

function pad(n: number) { return n.toString().padStart(2, '0'); }

function fmtLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function parseInput(raw: string): Date | null {
  const s = raw.trim();
  if (!s) return null;
  const d = /^\d{10}$/.test(s)
    ? new Date(parseInt(s, 10) * 1000)
    : /^\d{13}$/.test(s)
      ? new Date(parseInt(s, 10))
      : new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export default function DateTime() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  const [input, setInput] = useState(() => Math.floor(now.getTime() / 1000).toString());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Derive parsed/error from input — no effect+setState needed.
  const { parsed, error } = useMemo<{ parsed: Date | null; error: string | null }>(() => {
    if (!input.trim()) return { parsed: null, error: null };
    const d = parseInput(input);
    return d ? { parsed: d, error: null } : { parsed: null, error: t('datetime.invalid', { ns: 'tools' }) };
  }, [input, t]);

  const showD = parsed ?? now;

  const rows: { label: string; value: string }[] = [
    { label: t('datetime.unixSec', { ns: 'tools' }), value: Math.floor(showD.getTime() / 1000).toString() },
    { label: t('datetime.unixMs', { ns: 'tools' }), value: showD.getTime().toString() },
    { label: t('datetime.iso', { ns: 'tools' }), value: showD.toISOString() },
    { label: t('datetime.local', { ns: 'tools' }), value: fmtLocal(showD) },
    { label: t('datetime.utc', { ns: 'tools' }), value: showD.toUTCString() },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <FieldHeader label={t('common.input')} />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1715550000 / 2024-05-12T10:00:00Z"
            className="font-mono"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setInput(Math.floor(Date.now() / 1000).toString())}
        >
          {t('datetime.now', { ns: 'tools' })}
        </Button>
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div className="min-w-[8rem] text-xs text-muted-fg">{r.label}</div>
            <div className="min-w-0 flex-1 truncate font-mono text-sm">{r.value}</div>
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
