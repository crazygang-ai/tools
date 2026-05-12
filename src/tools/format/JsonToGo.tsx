import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { jsonToGo } from './jsonToGo.lib';

const SAMPLE = `{
  "id": 1,
  "name": "alice",
  "tags": ["a", "b"],
  "address": { "city": "Beijing", "zip": "100000" }
}`;

export default function JsonToGo() {
  const { t } = useTranslation();
  const [rootName, setRootName] = useState('Root');
  const [input, setInput] = useState(SAMPLE);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    try {
      return { output: jsonToGo(input, rootName || 'Root'), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, rootName]);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader label={t('json-to-go.rootName', { ns: 'tools' })} />
        <Input value={rootName} onChange={(e) => setRootName(e.target.value)} className="font-mono" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label="JSON" />
          <Textarea rows={14} value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <FieldHeader label="Go" action={<CopyButton value={output} />} />
          {error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="font-semibold">{t('json-to-go.invalid', { ns: 'tools' })}</div>
              <div className="mt-1 font-mono text-xs">{error}</div>
            </div>
          ) : (
            <Textarea rows={14} readOnly value={output} />
          )}
        </div>
      </div>
    </div>
  );
}
