import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { decodeBase64, encodeBase64 } from './base64.lib';

type Mode = 'encode' | 'decode';

export default function Base64() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input) return { ok: true, value: '' };
    try {
      return {
        ok: true,
        value: mode === 'encode' ? encodeBase64(input) : decodeBase64(input),
      };
    } catch (e) {
      return { ok: false, value: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs<Mode>
          tabs={[
            { value: 'encode', label: t('base64.modeEncode', { ns: 'tools' }) },
            { value: 'decode', label: t('base64.modeDecode', { ns: 'tools' }) },
          ]}
          value={mode}
          onChange={setMode}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('')}
          className="ml-auto"
        >
          {t('actions.clear')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader
            label={
              mode === 'encode'
                ? t('base64.inputText', { ns: 'tools' })
                : t('base64.encoded', { ns: 'tools' })
            }
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Hello, 世界' : 'SGVsbG8sIOS4lueVjA=='}
            rows={10}
          />
        </div>
        <div>
          <FieldHeader
            label={
              mode === 'encode'
                ? t('base64.encoded', { ns: 'tools' })
                : t('base64.decoded', { ns: 'tools' })
            }
            action={<CopyButton value={result.ok ? result.value : ''} />}
          />
          {result.ok ? (
            <Textarea readOnly value={result.value} rows={10} />
          ) : (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {t('base64.invalid', { ns: 'tools' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
