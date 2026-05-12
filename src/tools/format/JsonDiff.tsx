import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { diffJson } from './jsonDiff.lib';
import { cn } from '@/lib/cn';

export default function JsonDiff() {
  const { t } = useTranslation();
  const [left, setLeft] = useState('{\n  "name": "alice",\n  "age": 30\n}');
  const [right, setRight] = useState('{\n  "name": "alice",\n  "age": 31,\n  "email": "a@x.io"\n}');

  const { error, result } = useMemo(() => {
    if (!left.trim() || !right.trim()) return { error: null, result: null };
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      return { error: null, result: diffJson(a, b) };
    } catch (e) {
      return { error: (e as Error).message, result: null };
    }
  }, [left, right]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label={t('json-diff.left', { ns: 'tools' })} />
          <Textarea rows={10} value={left} onChange={(e) => setLeft(e.target.value)} />
        </div>
        <div>
          <FieldHeader label={t('json-diff.right', { ns: 'tools' })} />
          <Textarea rows={10} value={right} onChange={(e) => setRight(e.target.value)} />
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="font-semibold">{t('json-diff.invalid', { ns: 'tools' })}</div>
          <div className="mt-1 font-mono text-xs">{error}</div>
        </div>
      )}
      {result && (
        <div>
          <FieldHeader
            asSpan
            label={
              <span className="font-mono">
                {t('json-diff.summary', {
                  ns: 'tools',
                  add: result.add,
                  del: result.del,
                  mod: result.mod,
                })}
              </span>
            }
            action={<CopyButton value={result.lines.join('\n')} />}
          />
          {result.lines.length === 0 ? (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-600">
              {t('json-diff.noDiff', { ns: 'tools' })}
            </div>
          ) : (
            <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm">
              {result.lines.map((l, i) => (
                <div
                  key={i}
                  className={cn(
                    l.startsWith('+') && 'text-emerald-500',
                    l.startsWith('-') && 'text-destructive',
                    l.startsWith('~') && 'text-amber-500',
                  )}
                >
                  {l}
                </div>
              ))}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
