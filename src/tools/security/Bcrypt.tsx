import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Mode = 'hash' | 'verify';

export default function Bcrypt() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('hash');
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verifyResult, setVerifyResult] = useState<null | boolean>(null);
  const [busy, setBusy] = useState(false);

  async function doHash() {
    setBusy(true);
    try {
      const h = await bcrypt.hash(password, rounds);
      setHash(h);
    } finally {
      setBusy(false);
    }
  }

  async function doVerify() {
    setBusy(true);
    try {
      const ok = await bcrypt.compare(password, hashToVerify);
      setVerifyResult(ok);
    } catch {
      setVerifyResult(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs<Mode>
        tabs={[
          { value: 'hash', label: t('bcrypt.modeHash', { ns: 'tools' }) },
          { value: 'verify', label: t('bcrypt.modeVerify', { ns: 'tools' }) },
        ]}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setVerifyResult(null);
        }}
      />

      <div>
        <FieldHeader label={t('bcrypt.password', { ns: 'tools' })} />
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="hunter2"
        />
      </div>

      {mode === 'hash' ? (
        <>
          <div className="flex items-end gap-3">
            <div>
              <FieldHeader label={t('bcrypt.rounds', { ns: 'tools' })} />
              <Input
                type="number"
                min={4}
                max={15}
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value || '10', 10))}
                className="w-24"
              />
            </div>
            <Button onClick={doHash} disabled={!password || busy}>
              {t('actions.generate')}
            </Button>
          </div>
          <div>
            <FieldHeader
              label={t('bcrypt.hash', { ns: 'tools' })}
              action={<CopyButton value={hash} />}
            />
            <Textarea readOnly rows={2} value={hash} />
          </div>
        </>
      ) : (
        <>
          <div>
            <FieldHeader label={t('bcrypt.hash', { ns: 'tools' })} />
            <Textarea
              rows={2}
              value={hashToVerify}
              onChange={(e) => setHashToVerify(e.target.value)}
              placeholder="$2a$10$..."
            />
          </div>
          <Button onClick={doVerify} disabled={!password || !hashToVerify || busy}>
            {t('actions.verify')}
          </Button>
          {verifyResult !== null && (
            <div
              className={
                'rounded-lg border p-3 text-sm ' +
                (verifyResult
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
                  : 'border-destructive/40 bg-destructive/10 text-destructive')
              }
            >
              {verifyResult
                ? t('bcrypt.match', { ns: 'tools' })
                : t('bcrypt.noMatch', { ns: 'tools' })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
