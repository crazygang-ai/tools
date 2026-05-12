import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { evaluatePassword, humanizeSeconds, type TipKey } from './password.lib';
import { cn } from '@/lib/cn';

const LEVELS = ['veryWeak', 'weak', 'fair', 'strong', 'veryStrong'] as const;
const LEVEL_COLOR = [
  'bg-destructive',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-emerald-600',
];

export default function PasswordStrength() {
  const { t } = useTranslation();
  const [pw, setPw] = useState('');
  const r = useMemo(() => evaluatePassword(pw), [pw]);
  const pct = Math.min(100, (r.level / 4) * 100);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader label={t('password-strength.password', { ns: 'tools' })} />
        <Input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="hunter2" />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-fg">
          <span>{t('password-strength.level', { ns: 'tools' })}</span>
          <span className="font-medium text-fg">
            {t(`password-strength.levels.${LEVELS[r.level]}`, { ns: 'tools' })}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded bg-muted">
          <div
            className={cn('h-full transition-all', LEVEL_COLOR[r.level])}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label={t('password-strength.entropy', { ns: 'tools' })}
          value={`${r.entropy.toFixed(1)}`}
        />
        <Stat
          label={t('password-strength.crackTime', { ns: 'tools' })}
          value={humanizeSeconds(r.crackSeconds)}
        />
      </div>

      {r.tips.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <div className="mb-2 text-xs font-semibold text-muted-fg">
            {t('password-strength.tips', { ns: 'tools' })}
          </div>
          <ul className="space-y-1 text-sm">
            {(r.tips as TipKey[]).map((k) => (
              <li key={k} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                {t(`password-strength.tipList.${k}`, { ns: 'tools' })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-xs text-muted-fg">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
