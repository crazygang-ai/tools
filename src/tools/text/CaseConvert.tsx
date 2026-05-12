import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { stringCodec, useUrlState } from '@/lib/useUrlState';
import { cases, type CaseId } from './case.lib';

const ORDER: CaseId[] = [
  'camel',
  'pascal',
  'snake',
  'kebab',
  'constant',
  'title',
  'sentence',
  'upper',
  'lower',
];

const inputCodec = stringCodec('hello world devtools cafe');

export default function CaseConvert() {
  const { t } = useTranslation();
  const [input, setInput] = useUrlState('s', inputCodec);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader
          label={t('common.input')}
          action={
            <Button variant="outline" size="sm" onClick={() => setInput('')}>
              {t('actions.clear')}
            </Button>
          }
        />
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="hello world"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ORDER.map((id) => {
          const out = cases[id](input);
          return (
            <div
              key={id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium text-muted-fg">
                  {t(`case-convert.cases.${id}`, { ns: 'tools' })}
                </div>
                <div className="mt-0.5 truncate font-mono text-sm">{out || '—'}</div>
              </div>
              <CopyButton value={out} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
