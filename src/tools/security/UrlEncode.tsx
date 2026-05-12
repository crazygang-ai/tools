import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Mode = 'encode' | 'decode';
type Variant = 'component' | 'uri';

export default function UrlEncode() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Variant>('component');
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input) return { ok: true, value: '' } as const;
    try {
      const value =
        mode === 'encode'
          ? variant === 'component'
            ? encodeURIComponent(input)
            : encodeURI(input)
          : variant === 'component'
            ? decodeURIComponent(input)
            : decodeURI(input);
      return { ok: true, value } as const;
    } catch (e) {
      return { ok: false, value: (e as Error).message } as const;
    }
  }, [input, mode, variant]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs<Mode>
          tabs={[
            { value: 'encode', label: t('url-encode.modeEncode', { ns: 'tools' }) },
            { value: 'decode', label: t('url-encode.modeDecode', { ns: 'tools' }) },
          ]}
          value={mode}
          onChange={setMode}
        />
        <Tabs<Variant>
          tabs={[
            { value: 'component', label: t('url-encode.component', { ns: 'tools' }) },
            { value: 'uri', label: t('url-encode.uri', { ns: 'tools' }) },
          ]}
          value={variant}
          onChange={setVariant}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label={t('url-encode.input', { ns: 'tools' })} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder={mode === 'encode' ? 'hello world?a=1&b=你好' : 'hello%20world%3Fa%3D1'}
          />
        </div>
        <div>
          <FieldHeader
            label={t('url-encode.output', { ns: 'tools' })}
            action={<CopyButton value={result.ok ? result.value : ''} />}
          />
          <Textarea readOnly rows={6} value={result.ok ? result.value : `Error: ${result.value}`} />
        </div>
      </div>
    </div>
  );
}
