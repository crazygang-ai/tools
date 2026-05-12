import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { useLocalState } from '@/lib/useLocalState';
import { fmtHex, fmtHsl, fmtHsv, fmtRgb, parseColor } from './color.lib';

export default function ColorConvert() {
  const { t } = useTranslation();
  const [input, setInput] = useLocalState('color.input', '#aa3bff');
  const c = useMemo(() => parseColor(input), [input]);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader label={t('color-convert.input', { ns: 'tools' })} />
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
          <input
            type="color"
            className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card"
            value={c ? fmtHex({ ...c, a: 1 }).slice(0, 7) : '#000000'}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>
      {c ? (
        <>
          <div
            className="h-20 rounded-lg border border-border"
            style={{ background: fmtRgb(c) }}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: 'HEX', value: fmtHex(c) },
              { label: 'RGB', value: fmtRgb(c) },
              { label: 'HSL', value: fmtHsl(c) },
              { label: 'HSV', value: fmtHsv(c) },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-muted-fg">{row.label}</div>
                  <div className="mt-0.5 truncate font-mono text-sm">{row.value}</div>
                </div>
                <CopyButton value={row.value} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {t('color-convert.invalid', { ns: 'tools' })}
        </div>
      )}
    </div>
  );
}
