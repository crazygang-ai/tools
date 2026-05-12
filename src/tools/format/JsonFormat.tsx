import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Mode = 'format' | 'minify';
type Indent = 2 | 4 | 'tab';

const SAMPLE = `{"name":"Tools","tools":23,"local":true,"categories":["security","format","text"]}`;

export default function JsonFormat() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState<Indent>(2);
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, value: '' };
    try {
      const parsed = JSON.parse(input);
      const space = indent === 'tab' ? '\t' : indent;
      const value =
        mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, space);
      return { ok: true as const, value };
    } catch (e) {
      return { ok: false as const, message: (e as Error).message };
    }
  }, [input, mode, indent]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs<Mode>
          tabs={[
            { value: 'format', label: t('json-format.modeFormat', { ns: 'tools' }) },
            { value: 'minify', label: t('json-format.modeMinify', { ns: 'tools' }) },
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === 'format' && (
          <label className="flex items-center gap-2 text-sm text-muted-fg">
            {t('json-format.indent', { ns: 'tools' })}
            <select
              className="h-8 rounded-md border border-border bg-card px-2 text-sm"
              value={indent}
              onChange={(e) => {
                const v = e.target.value;
                setIndent(v === 'tab' ? 'tab' : (parseInt(v, 10) as Indent));
              }}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value="tab">tab</option>
            </select>
          </label>
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>
            {t('actions.example')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput('')}>
            {t('actions.clear')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label={t('common.input')} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"hello":"world"}'
            rows={14}
          />
        </div>
        <div>
          <FieldHeader
            label={t('common.output')}
            action={<CopyButton value={result.ok ? result.value : ''} />}
          />
          {result.ok ? (
            <Textarea readOnly value={result.value} rows={14} />
          ) : (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="font-semibold">{t('json-format.invalid', { ns: 'tools' })}</div>
              <div className="mt-1 font-mono text-xs">{result.message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
