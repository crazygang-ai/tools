import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Kind = 'hex' | 'base64url' | 'alnum' | 'uuid';

const ALNUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function fromCharset(len: number, charset: string): string {
  const out: string[] = [];
  const buf = new Uint8Array(len * 2);
  const max = Math.floor(256 / charset.length) * charset.length;
  while (out.length < len) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < len; i++) {
      const v = buf[i];
      if (v < max) out.push(charset[v % charset.length]);
    }
  }
  return out.join('');
}

function genHex(len: number): string {
  const buf = new Uint8Array(Math.ceil(len / 2));
  crypto.getRandomValues(buf);
  let s = '';
  for (let i = 0; i < buf.length; i++) s += buf[i].toString(16).padStart(2, '0');
  return s.slice(0, len);
}

function genUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generate(kind: Kind, len: number): string {
  switch (kind) {
    case 'hex':
      return genHex(len);
    case 'base64url':
      return fromCharset(len, B64URL);
    case 'alnum':
      return fromCharset(len, ALNUM);
    case 'uuid':
      return genUuid();
  }
}

function generateMany(kind: Kind, len: number, count: number): string[] {
  const safeCount = Math.max(1, Math.min(100, count));
  const safeLen = Math.max(4, Math.min(512, len));
  return Array.from({ length: safeCount }, () => generate(kind, safeLen));
}

export default function TokenGen() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<Kind>('hex');
  const [len, setLen] = useState(32);
  const [count, setCount] = useState(5);
  // Generate an initial batch on mount; subsequent batches are produced when
  // the user clicks the Generate button. Changing settings does not auto-
  // regenerate — that would silently consume entropy on every keystroke and
  // leave the user unsure when they actually got a "new" token.
  const [tokens, setTokens] = useState<string[]>(() => generateMany('hex', 32, 5));

  const all = tokens.join('\n');

  return (
    <div className="space-y-4">
      <Tabs<Kind>
        tabs={(['hex', 'base64url', 'alnum', 'uuid'] as Kind[]).map((k) => ({
          value: k,
          label: t(`token-gen.kinds.${k}`, { ns: 'tools' }),
        }))}
        value={kind}
        onChange={setKind}
      />
      <div className="grid gap-3 sm:grid-cols-[auto,auto,1fr,auto] sm:items-end">
        <div>
          <FieldHeader label={t('token-gen.length', { ns: 'tools' })} />
          <Input
            type="number"
            min={4}
            max={512}
            value={len}
            onChange={(e) => setLen(parseInt(e.target.value || '32', 10))}
            disabled={kind === 'uuid'}
            className="w-24"
          />
        </div>
        <div>
          <FieldHeader label={t('token-gen.count', { ns: 'tools' })} />
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value || '5', 10))}
            className="w-24"
          />
        </div>
        <div />
        <div className="flex gap-2">
          <Button onClick={() => setTokens(generateMany(kind, len, count))}>
            {t('actions.generate')}
          </Button>
          <CopyButton value={all} />
        </div>
      </div>
      <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm whitespace-pre-wrap break-all">
        {all}
      </pre>
    </div>
  );
}
