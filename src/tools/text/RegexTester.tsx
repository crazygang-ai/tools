import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { stringCodec, useUrlState } from '@/lib/useUrlState';

const FLAGS = ['g', 'i', 'm', 's', 'u', 'y'] as const;

interface Match {
  index: number;
  text: string;
  groups: string[];
}

const patternCodec = stringCodec('\\b\\w+@\\w+\\.\\w+\\b');
const flagsCodec = stringCodec('gi');
const textCodec = stringCodec(
  'Reach us at hello@example.com or support@example.org for help.',
);

export default function RegexTester() {
  const { t } = useTranslation();
  const [pattern, setPattern] = useUrlState('p', patternCodec);
  const [flags, setFlags] = useUrlState('f', flagsCodec);
  const [text, setText] = useUrlState('t', textCodec);

  const result = useMemo(() => {
    if (!pattern) return { ok: true as const, matches: [] as Match[] };
    try {
      const re = new RegExp(pattern, flags);
      const matches: Match[] = [];
      if (flags.includes('g')) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          matches.push({ index: m.index, text: m[0], groups: m.slice(1) });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        const m = re.exec(text);
        if (m) matches.push({ index: m.index, text: m[0], groups: m.slice(1) });
      }
      return { ok: true as const, matches };
    } catch (e) {
      return { ok: false as const, message: (e as Error).message };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!result.ok || result.matches.length === 0) return null;
    const parts: { text: string; match: boolean }[] = [];
    let cursor = 0;
    for (const m of result.matches) {
      if (m.index > cursor) parts.push({ text: text.slice(cursor, m.index), match: false });
      parts.push({ text: m.text, match: true });
      cursor = m.index + m.text.length;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
    return parts;
  }, [result, text]);

  function toggleFlag(f: string) {
    setFlags(flags.includes(f) ? flags.replace(f, '') : flags + f);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
        <div>
          <FieldHeader label={t('regex-tester.pattern', { ns: 'tools' })} />
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="font-mono"
            placeholder="\\d+"
          />
        </div>
        <div>
          <FieldHeader label={t('regex-tester.flags', { ns: 'tools' })} />
          <div className="flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-2">
            {FLAGS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={
                  'h-6 w-6 rounded text-xs font-mono transition-colors ' +
                  (flags.includes(f) ? 'bg-primary text-primary-fg' : 'text-muted-fg hover:bg-muted')
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!result.ok && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="font-semibold">{t('regex-tester.invalid', { ns: 'tools' })}</div>
          <div className="mt-1 font-mono text-xs">{result.message}</div>
        </div>
      )}

      <div>
        <FieldHeader label={t('regex-tester.testStr', { ns: 'tools' })} />
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      </div>

      {result.ok && (
        <div className="space-y-2">
          <div className="text-xs text-muted-fg">
            {result.matches.length === 0
              ? t('regex-tester.noMatches', { ns: 'tools' })
              : t('regex-tester.matches', {
                  ns: 'tools',
                  count: result.matches.length,
                })}
          </div>
          {highlighted && (
            <pre className="overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm whitespace-pre-wrap">
              {highlighted.map((p, i) =>
                p.match ? (
                  <mark key={i} className="rounded bg-primary/30 px-0.5 text-fg">
                    {p.text}
                  </mark>
                ) : (
                  <span key={i}>{p.text}</span>
                ),
              )}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
