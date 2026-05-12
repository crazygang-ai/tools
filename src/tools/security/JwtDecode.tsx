import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { stringCodec, useUrlState } from '@/lib/useUrlState';
import { decodeJwt } from './jwt.lib';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzE1NTUwMDAwfQ.h-zG6pzZP1y8wq7DK6_8H3i7s2x0Yk4Y2J5h6yWB8aE';

const tokenCodec = stringCodec('');

export default function JwtDecode() {
  const { t } = useTranslation();
  // JWTs over ~1.5KB tend to be either signature-padded RSA tokens or tokens
  // stuffed with claims; sharing those via URL is rarely useful and would
  // bloat every navigate() within the tool. Local state keeps working above
  // the cap; only URL persistence is dropped.
  const [token, setToken] = useUrlState('token', tokenCodec, { maxLength: 1500 });

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const r = decodeJwt(token);
      return { ok: true as const, ...r };
    } catch (e) {
      return { ok: false as const, message: (e as Error).message };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader
          label={t('jwt-decode.tokenLabel', { ns: 'tools' })}
          action={
            <>
              <Button variant="outline" size="sm" onClick={() => setToken(SAMPLE)}>
                {t('actions.example')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setToken('')}>
                {t('actions.clear')}
              </Button>
            </>
          }
        />
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOi..."
          rows={4}
        />
      </div>

      {result && !result.ok && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {t('jwt-decode.invalid', { ns: 'tools' })}
        </div>
      )}

      {result && result.ok && (
        <div className="grid gap-4 md:grid-cols-2">
          <Section
            title={t('jwt-decode.header', { ns: 'tools' })}
            content={JSON.stringify(result.header, null, 2)}
          />
          <Section
            title={t('jwt-decode.payload', { ns: 'tools' })}
            content={JSON.stringify(result.payload, null, 2)}
          />
          <Section
            title={t('jwt-decode.signature', { ns: 'tools' })}
            content={result.signature}
            className="md:col-span-2"
          />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  content,
  className,
}: {
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldHeader asSpan label={title} action={<CopyButton value={content} />} />
      <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-all">
        {content}
      </pre>
    </div>
  );
}
