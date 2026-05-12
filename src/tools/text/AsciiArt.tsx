import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Image as ImageIcon, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { Tabs } from '@/components/ui/Tabs';
import { useLocalState } from '@/lib/useLocalState';
import {
  FONTS,
  type Font,
  type Theme,
  copyPngToClipboard,
  downloadPng,
  render,
  renderToCanvas,
} from './asciiArt.lib';

function isFont(v: string): v is Font {
  return (FONTS as readonly string[]).includes(v);
}

function isTheme(v: string): v is Theme {
  return v === 'light' || v === 'dark' || v === 'transparent';
}

export default function AsciiArt() {
  const { t } = useTranslation();
  const [text, setText] = useLocalState('asciiArt.text', 'Hello');
  const [fontRaw, setFont] = useLocalState<string>('asciiArt.font', 'Standard');
  const [themeRaw, setTheme] = useLocalState<string>('asciiArt.theme', 'light');
  const font: Font = isFont(fontRaw) ? fontRaw : 'Standard';
  const theme: Theme = isTheme(themeRaw) ? themeRaw : 'light';

  const [imageCopied, setImageCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const art = useMemo(() => render(text, font), [text, font]);

  // Preview surface mirrors the export theme. For 'transparent' we show a
  // CSS checkerboard so the user understands the bg will be see-through.
  const previewClass =
    theme === 'light'
      ? 'bg-white text-zinc-900'
      : theme === 'dark'
        ? 'bg-zinc-950 text-zinc-100'
        : 'text-zinc-900 [background:repeating-conic-gradient(#e5e7eb_0%_25%,#ffffff_0%_50%)_50%/16px_16px]';

  function makeCanvas() {
    return renderToCanvas(art, { theme });
  }

  function handleDownload() {
    if (!art) return;
    downloadPng(makeCanvas());
  }

  async function handleCopyImage() {
    if (!art) return;
    const ok = await copyPngToClipboard(makeCanvas());
    if (ok) {
      setImageCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setImageCopied(false), 1500);
    } else {
      // Browser refused / unsupported (Safari < 16, FF default). Fall back
      // to download so the user still gets the image.
      handleDownload();
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldHeader label={t('ascii-art.input', { ns: 'tools' })} />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('ascii-art.placeholder', { ns: 'tools' })}
          className="font-mono"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-fg">
          {t('ascii-art.fontLabel', { ns: 'tools' })}
          <select
            className="h-8 rounded-md border border-border bg-card px-2 text-sm"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <Tabs<Theme>
          aria-label={t('ascii-art.themeLabel', { ns: 'tools' })}
          tabs={[
            { value: 'light', label: t('ascii-art.themeLight', { ns: 'tools' }) },
            { value: 'dark', label: t('ascii-art.themeDark', { ns: 'tools' }) },
            { value: 'transparent', label: t('ascii-art.themeTransparent', { ns: 'tools' }) },
          ]}
          value={theme}
          onChange={setTheme}
        />

        <div className="ml-auto flex flex-wrap gap-2">
          <CopyButton value={art} />
          <Button variant="outline" size="sm" onClick={handleCopyImage} disabled={!art}>
            {imageCopied ? <Check size={14} /> : <ImageIcon size={14} />}
            {imageCopied
              ? t('actions.copied')
              : t('ascii-art.copyImage', { ns: 'tools' })}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!art}>
            <Download size={14} />
            {t('ascii-art.downloadPng', { ns: 'tools' })}
          </Button>
        </div>
      </div>

      <FieldHeader label={t('ascii-art.output', { ns: 'tools' })} asSpan />
      <pre
        className={
          'overflow-auto rounded-lg border border-border p-4 font-mono text-xs leading-tight whitespace-pre ' +
          previewClass
        }
      >
        {art || ' '}
      </pre>
    </div>
  );
}
