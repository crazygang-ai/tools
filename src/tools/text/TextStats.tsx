import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';

interface Stats {
  chars: number;
  charsNoSpace: number;
  words: number;
  lines: number;
  sentences: number;
  bytes: number;
}

function computeStats(text: string): Stats {
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text === '' ? 0 : text.split(/\r?\n/).length;
  const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter((s) => s.trim()).length : 0;
  const bytes = new TextEncoder().encode(text).length;
  return { chars, charsNoSpace, words, lines, sentences, bytes };
}

export default function TextStats() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const s = useMemo(() => computeStats(text), [text]);

  const items: { key: keyof Stats; value: number }[] = [
    { key: 'chars', value: s.chars },
    { key: 'charsNoSpace', value: s.charsNoSpace },
    { key: 'words', value: s.words },
    { key: 'lines', value: s.lines },
    { key: 'sentences', value: s.sentences },
    { key: 'bytes', value: s.bytes },
  ];

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader label={t('text-stats.input', { ns: 'tools' })} />
        <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.key} className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs text-muted-fg">{t(`text-stats.${it.key}`, { ns: 'tools' })}</div>
            <div className="mt-1 text-xl font-semibold">{it.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
