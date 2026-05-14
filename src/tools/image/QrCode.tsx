import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { downloadBlob } from '@/lib/copy';

type Level = 'L' | 'M' | 'Q' | 'H';

// Discriminated union keeps i18n.t() out of the encode useEffect — we only
// store the structured error context here and translate it at render time.
type ErrorState =
  | null
  | { kind: 'tooBig'; length: number; level: Level }
  | { kind: 'generic'; message: string };

export default function QrCodeTool() {
  const { t } = useTranslation();
  const [content, setContent] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<Level>('M');
  const [error, setError] = useState<ErrorState>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const value = content || ' ';
    QRCode.toCanvas(c, value, {
      errorCorrectionLevel: level,
      width: size,
      margin: 2,
      color: {
        dark: '#0b0b0d',
        light: '#ffffff',
      },
    })
      .then(() => {
        // qrcode.toCanvas overwrites canvas.style.width/height with the
        // bitmap pixel size (e.g. '1024px'), which both blows up the layout
        // and uncouples the on-screen size from our intent. Replace those
        // inline styles ourselves with the desired *display* size — capped
        // at 320 so the column never overflows. Below 320 the preview
        // scales with the slider (WYSIWYG); above 320 the preview stays at
        // 320 and only the bitmap (download size) keeps growing.
        const display = Math.min(size, 320);
        c.style.width = `${display}px`;
        c.style.height = `${display}px`;
        setError(null);
      })
      .catch((e: unknown) => {
        const ctx = c.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, c.width, c.height);
        const message = e instanceof Error ? e.message : String(e);
        // qrcode lib message: "The amount of data is too big to be stored in a QR Code"
        if (/too big|too large/i.test(message)) {
          setError({ kind: 'tooBig', length: content.length, level });
        } else {
          setError({ kind: 'generic', message });
        }
      });
  }, [content, size, level]);

  function download() {
    const c = canvasRef.current;
    if (!c || error) return;
    c.toBlob((b) => {
      if (b) downloadBlob(b, 'qrcode.png');
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr,minmax(0,420px)]">
      <div className="space-y-3">
        <div>
          <FieldHeader label={t('qr-code.content', { ns: 'tools' })} />
          <Textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error.kind === 'tooBig'
              ? t('qr-code.tooBig', {
                  ns: 'tools',
                  length: error.length,
                  level: error.level,
                })
              : t('qr-code.generic', { ns: 'tools', message: error.message })}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <FieldHeader
              label={`${t('qr-code.size', { ns: 'tools' })} (${size}px)`}
            />
            <input
              type="range"
              min={64}
              max={1024}
              step={8}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="h-9 w-full"
            />
          </div>
          <div>
            <FieldHeader label={t('qr-code.errorLevel', { ns: 'tools' })} />
            <select
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
            >
              <option value="L">L (7%)</option>
              <option value="M">M (15%)</option>
              <option value="Q">Q (25%)</option>
              <option value="H">H (30%)</option>
            </select>
          </div>
        </div>
        <Button onClick={download} disabled={!!error}>
          {t('qr-code.downloadPng', { ns: 'tools' })}
        </Button>
      </div>
      {/* The canvas's display size is set imperatively in the useEffect    */}
      {/* (after qrcode.toCanvas, which would otherwise overwrite our       */}
      {/* inline styles with the bitmap size). The wrapper just centers it  */}
      {/* and provides the white background; it doesn't constrain the       */}
      {/* canvas size — the useEffect does. `min-w-0` lets the grid item    */}
      {/* shrink below its intrinsic content width.                         */}
      <div className="flex w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white p-4">
        <canvas ref={canvasRef} className="block max-w-full" />
      </div>
    </div>
  );
}
