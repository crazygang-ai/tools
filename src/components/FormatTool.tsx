import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Mode = 'format' | 'minify';

interface Props {
  ns: string;
  format: (input: string, indent: number) => string;
  minify: (input: string) => string;
  placeholder?: string;
}

export function FormatTool({ ns, format, minify, placeholder }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState(2);
  const [input, setInput] = useState('');

  const inputId = useId();
  const outputId = useId();
  const indentId = useId();
  const errorId = useId();

  const { output, error } = useMemo<{ output: string; error: string | null }>(() => {
    if (!input.trim()) return { output: '', error: null };
    try {
      return {
        output: mode === 'format' ? format(input, indent) : minify(input),
        error: null,
      };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, indent, format, minify]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs<Mode>
          aria-label={t('common.options')}
          tabs={[
            { value: 'format', label: t(`${ns}.modeFormat`, { ns: 'tools' }) },
            { value: 'minify', label: t(`${ns}.modeMinify`, { ns: 'tools' }) },
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === 'format' && (
          <div className="flex items-center gap-2 text-sm text-muted-fg">
            <label htmlFor={indentId}>{t(`${ns}.indent`, { ns: 'tools' })}</label>
            <select
              id={indentId}
              className="h-8 rounded-md border border-border bg-card px-2 text-sm text-fg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value, 10))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader htmlFor={inputId} label={t('common.input')} />
          <Textarea
            id={inputId}
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
        <div>
          <FieldHeader
            htmlFor={outputId}
            label={t('common.output')}
            action={<CopyButton value={output} />}
          />
          {error ? (
            <div
              id={errorId}
              role="alert"
              aria-live="polite"
              className="min-h-[14rem] rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <div className="font-semibold">{t('common.error')}</div>
              <div className="mt-1 break-words font-mono text-xs">{error}</div>
            </div>
          ) : (
            <Textarea id={outputId} rows={14} readOnly value={output} />
          )}
        </div>
      </div>
    </div>
  );
}
