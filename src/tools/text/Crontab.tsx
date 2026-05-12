import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { stringCodec, useUrlState } from '@/lib/useUrlState';
import { humanize, nextRuns } from './cron.lib';

const exprCodec = stringCodec('*/15 * * * *');

export default function Crontab() {
  const { t } = useTranslation();
  const [expr, setExpr] = useUrlState('expr', exprCodec);

  const { error, runs, label } = useMemo(() => {
    try {
      return {
        error: null as string | null,
        runs: nextRuns(expr, new Date(), 5),
        label: humanize(expr),
      };
    } catch (e) {
      return { error: (e as Error).message, runs: [] as Date[], label: '' };
    }
  }, [expr]);

  const FIELDS: Array<keyof typeof FIELD_LABEL> = ['minute', 'hour', 'dom', 'month', 'dow'];
  const FIELD_LABEL = {
    minute: t('crontab.fields.minute', { ns: 'tools' }),
    hour: t('crontab.fields.hour', { ns: 'tools' }),
    dom: t('crontab.fields.dom', { ns: 'tools' }),
    month: t('crontab.fields.month', { ns: 'tools' }),
    dow: t('crontab.fields.dow', { ns: 'tools' }),
  };

  const parts = expr.trim().split(/\s+/);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader
          label={t('crontab.expression', { ns: 'tools' })}
          action={<CopyButton value={expr} />}
        />
        <Input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="font-mono text-base"
        />
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {FIELDS.map((f, i) => (
          <div key={f} className="rounded-lg border border-border bg-card p-2">
            <div className="text-muted-fg">{FIELD_LABEL[f]}</div>
            <div className="mt-1 font-mono">{parts[i] ?? '—'}</div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {t('crontab.invalid', { ns: 'tools' })}
          <div className="mt-1 font-mono text-xs">{error}</div>
        </div>
      ) : (
        <>
          <div>
            <div className="text-xs text-muted-fg">{t('crontab.humanize', { ns: 'tools' })}</div>
            <div className="mt-1 text-sm">{label}</div>
          </div>
          <div>
            <div className="text-xs text-muted-fg">{t('crontab.next', { ns: 'tools' })}</div>
            <ul className="mt-1 space-y-1 font-mono text-sm">
              {runs.map((d, i) => (
                <li key={i}>{d.toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
