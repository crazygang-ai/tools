import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
type Encoding = 'hex' | 'base64';

const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default function Hmac() {
  const { t } = useTranslation();
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [algo, setAlgo] = useState<Algo>('SHA-256');
  const [enc, setEnc] = useState<Encoding>('hex');
  const [out, setOut] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!key || !message) {
        setOut('');
        return;
      }
      try {
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(key),
          { name: 'HMAC', hash: algo },
          false,
          ['sign'],
        );
        const sig = await crypto.subtle.sign(
          'HMAC',
          cryptoKey,
          new TextEncoder().encode(message),
        );
        if (!cancelled) setOut(enc === 'hex' ? bufToHex(sig) : bufToB64(sig));
      } catch {
        if (!cancelled) setOut('');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key, message, algo, enc]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Tabs<Algo>
          tabs={ALGOS.map((a) => ({ value: a, label: a }))}
          value={algo}
          onChange={setAlgo}
        />
        <Tabs<Encoding>
          tabs={[
            { value: 'hex', label: 'hex' },
            { value: 'base64', label: 'base64' },
          ]}
          value={enc}
          onChange={setEnc}
        />
      </div>
      <div>
        <FieldHeader label={t('hmac.key', { ns: 'tools' })} />
        <Input value={key} onChange={(e) => setKey(e.target.value)} />
      </div>
      <div>
        <FieldHeader label={t('hmac.message', { ns: 'tools' })} />
        <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div>
        <FieldHeader label={`HMAC-${algo}`} action={<CopyButton value={out} />} />
        <pre className="overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap">
          {out || '—'}
        </pre>
      </div>
    </div>
  );
}
