import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { downloadBlob } from '@/lib/copy';

type Level = 'L' | 'M' | 'Q' | 'H';

export default function QrCodeTool() {
  const { t } = useTranslation();
  const [content, setContent] = useState('https://devtoolcafe.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<Level>('M');
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
    }).catch(() => {
      const ctx = c.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    });
  }, [content, size, level]);

  function download() {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob((b) => {
      if (b) downloadBlob(b, 'qrcode.png');
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr,auto]">
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldHeader label={t('qr-code.size', { ns: 'tools' })} />
            <Input
              type="number"
              min={64}
              max={1024}
              step={32}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value || '256', 10))}
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
        <Button onClick={download}>{t('qr-code.downloadPng', { ns: 'tools' })}</Button>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-border bg-white p-4">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
