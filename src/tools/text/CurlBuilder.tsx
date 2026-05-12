import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const METHODS: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

interface Header { key: string; value: string }

function shellEscape(s: string): string {
  // Wrap in single quotes; escape any embedded single quote.
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export default function CurlBuilder() {
  const { t } = useTranslation();
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('https://api.example.com/users');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);
  const [body, setBody] = useState('');

  const cmd = useMemo(() => {
    const parts = ['curl'];
    if (method !== 'GET') parts.push(`-X ${method}`);
    parts.push(shellEscape(url));
    for (const h of headers) {
      if (!h.key) continue;
      parts.push(`-H ${shellEscape(`${h.key}: ${h.value}`)}`);
    }
    if (body && method !== 'GET') {
      parts.push(`--data ${shellEscape(body)}`);
    }
    return parts.join(' \\\n  ');
  }, [method, url, headers, body]);

  function setHeader(i: number, patch: Partial<Header>) {
    setHeaders((hs) => hs.map((h, j) => (j === i ? { ...h, ...patch } : h)));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[auto,1fr]">
        <div>
          <FieldHeader label={t('curl-builder.method', { ns: 'tools' })} />
          <Tabs<Method>
            tabs={METHODS.map((m) => ({ value: m, label: m }))}
            value={method}
            onChange={setMethod}
          />
        </div>
        <div>
          <FieldHeader label={t('curl-builder.url', { ns: 'tools' })} />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />
        </div>
      </div>

      <div>
        <FieldHeader
          label={t('curl-builder.headers', { ns: 'tools' })}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setHeaders((hs) => [...hs, { key: '', value: '' }])}
            >
              <Plus size={14} /> {t('curl-builder.addHeader', { ns: 'tools' })}
            </Button>
          }
        />
        <div className="space-y-2">
          {headers.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Header"
                value={h.key}
                onChange={(e) => setHeader(i, { key: e.target.value })}
                className="font-mono"
              />
              <Input
                placeholder="Value"
                value={h.value}
                onChange={(e) => setHeader(i, { value: e.target.value })}
                className="font-mono"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setHeaders((hs) => hs.filter((_, j) => j !== i))}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <FieldHeader label={t('curl-builder.body', { ns: 'tools' })} />
        <Textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{"name":"alice"}'
          disabled={method === 'GET'}
        />
      </div>

      <div>
        <FieldHeader
          label={t('curl-builder.command', { ns: 'tools' })}
          action={<CopyButton value={cmd} />}
        />
        <pre className="overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm whitespace-pre">
          {cmd}
        </pre>
      </div>
    </div>
  );
}
