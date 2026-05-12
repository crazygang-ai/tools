import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './Button';
import { copyText } from '@/lib/copy';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  disabled?: boolean;
}

export function CopyButton({ value, className, size = 'sm', variant = 'outline', disabled }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Inactive when there's nothing to copy or the parent forced disabled.
  // We don't use the native `disabled` attribute: that removes the button
  // from the tab order and hides any explanatory tooltip from screen
  // readers. `aria-disabled` keeps the button focusable and announces the
  // disabled state, while we no-op the click handler ourselves.
  const isInactive = disabled || !value;
  const reason = !value ? t('a11y.copyEmpty') : undefined;

  async function handle() {
    if (isInactive) return;
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handle}
        aria-disabled={isInactive || undefined}
        title={reason}
        size={size}
        variant={variant}
        className={
          isInactive
            ? `${className ?? ''} cursor-not-allowed opacity-50`.trim()
            : className
        }
        aria-label={copied ? t('a11y.copied') : t('actions.copy')}
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        <span aria-hidden={copied ? undefined : 'true'}>
          {copied ? t('actions.copied') : t('actions.copy')}
        </span>
      </Button>
      {/* Live region announces successful copy to assistive tech */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t('a11y.copied') : ''}
      </span>
    </>
  );
}
