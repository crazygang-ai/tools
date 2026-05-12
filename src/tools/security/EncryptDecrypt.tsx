import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { decryptAesGcm, encryptAesGcm } from './aes.lib';

type Mode = 'encrypt' | 'decrypt';

export default function EncryptDecrypt() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('encrypt');
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setError(null);
    setBusy(true);
    try {
      if (mode === 'encrypt') {
        setOutput(await encryptAesGcm(input, password));
      } else {
        setOutput(await decryptAesGcm(input, password));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs<Mode>
        tabs={[
          { value: 'encrypt', label: t('encrypt-decrypt.modeEncrypt', { ns: 'tools' }) },
          { value: 'decrypt', label: t('encrypt-decrypt.modeDecrypt', { ns: 'tools' }) },
        ]}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setOutput('');
          setError(null);
        }}
      />
      <div>
        <FieldHeader label={t('encrypt-decrypt.password', { ns: 'tools' })} />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <FieldHeader
          label={
            mode === 'encrypt'
              ? t('encrypt-decrypt.plaintext', { ns: 'tools' })
              : t('encrypt-decrypt.ciphertext', { ns: 'tools' })
          }
        />
        <Textarea rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <Button onClick={run} disabled={!password || !input || busy}>
        {mode === 'encrypt' ? t('actions.encode') : t('actions.decode')}
      </Button>
      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {t('encrypt-decrypt.invalid', { ns: 'tools' })}
          <div className="mt-1 font-mono text-xs">{error}</div>
        </div>
      ) : (
        <div>
          <FieldHeader
            label={
              mode === 'encrypt'
                ? t('encrypt-decrypt.ciphertext', { ns: 'tools' })
                : t('encrypt-decrypt.plaintext', { ns: 'tools' })
            }
            action={<CopyButton value={output} />}
          />
          <Textarea readOnly rows={6} value={output} />
        </div>
      )}
    </div>
  );
}
