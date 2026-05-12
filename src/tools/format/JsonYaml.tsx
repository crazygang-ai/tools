import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import yaml from 'js-yaml';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { ArrowRight } from 'lucide-react';

type Direction = 'json2yaml' | 'yaml2json';

export default function JsonYaml() {
  const { t } = useTranslation();
  const [dir, setDir] = useState<Direction>('json2yaml');
  const [input, setInput] = useState('');

  const { output, error } = useMemo<{ output: string; error: string | null }>(() => {
    if (!input.trim()) return { output: '', error: null };
    try {
      if (dir === 'json2yaml') {
        const parsed = JSON.parse(input);
        return { output: yaml.dump(parsed, { lineWidth: 120 }), error: null };
      }
      const parsed = yaml.load(input);
      return { output: JSON.stringify(parsed, null, 2), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, dir]);

  function swap() {
    setDir((d) => (d === 'json2yaml' ? 'yaml2json' : 'json2yaml'));
    setInput(output);
  }

  const leftLabel =
    dir === 'json2yaml' ? t('json-yaml.json', { ns: 'tools' }) : t('json-yaml.yaml', { ns: 'tools' });
  const rightLabel =
    dir === 'json2yaml' ? t('json-yaml.yaml', { ns: 'tools' }) : t('json-yaml.json', { ns: 'tools' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={swap}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
        >
          {leftLabel}
          <ArrowRight size={14} />
          {rightLabel}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label={leftLabel} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={dir === 'json2yaml' ? '{"name":"DevTools"}' : 'name: DevTools'}
            rows={14}
          />
        </div>
        <div>
          <FieldHeader label={rightLabel} action={<CopyButton value={output} />} />
          {error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="font-semibold">
                {dir === 'json2yaml'
                  ? t('json-yaml.invalidJson', { ns: 'tools' })
                  : t('json-yaml.invalidYaml', { ns: 'tools' })}
              </div>
              <div className="mt-1 font-mono text-xs">{error}</div>
            </div>
          ) : (
            <Textarea readOnly value={output} rows={14} />
          )}
        </div>
      </div>
    </div>
  );
}
