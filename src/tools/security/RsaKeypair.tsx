import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Size = '2048' | '3072' | '4096';
const SIZES: Size[] = ['2048', '3072', '4096'];

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function pem(label: string, b64: string): string {
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
}

export default function RsaKeypair() {
  const { t } = useTranslation();
  const [size, setSize] = useState<Size>('2048');
  const [pub, setPub] = useState('');
  const [priv, setPriv] = useState('');
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const kp = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: parseInt(size, 10),
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );
      const spki = await crypto.subtle.exportKey('spki', kp.publicKey);
      const pkcs8 = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
      setPub(pem('PUBLIC KEY', bufToB64(spki)));
      setPriv(pem('PRIVATE KEY', bufToB64(pkcs8)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs<Size>
          tabs={SIZES.map((s) => ({ value: s, label: s }))}
          value={size}
          onChange={setSize}
        />
        <Button onClick={generate} disabled={busy}>
          {busy ? '...' : t('rsa-keypair.generate', { ns: 'tools' })}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader
            label={t('rsa-keypair.publicKey', { ns: 'tools' })}
            action={<CopyButton value={pub} />}
          />
          <Textarea readOnly rows={14} value={pub} className="text-xs" />
        </div>
        <div>
          <FieldHeader
            label={t('rsa-keypair.privateKey', { ns: 'tools' })}
            action={<CopyButton value={priv} />}
          />
          <Textarea readOnly rows={14} value={priv} className="text-xs" />
        </div>
      </div>
    </div>
  );
}
