import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { FieldHeader } from '@/components/ui/FieldHeader';
import { Dropzone } from '@/components/ui/Dropzone';
import { downloadBlob } from '@/lib/copy';

type Format = 'image/png' | 'image/jpeg' | 'image/webp';

interface OriginalState {
  url: string;
  size: number;
  name: string;
  blob: Blob;
}
interface ConvertedState {
  url: string;
  blob: Blob;
}

export default function ImageConvert() {
  const { t } = useTranslation();
  const [original, setOriginal] = useState<OriginalState | null>(null);
  const [converted, setConverted] = useState<ConvertedState | null>(null);
  const [format, setFormat] = useState<Format>('image/webp');
  const [quality, setQuality] = useState(0.9);

  // Revoke object URLs when they get replaced or when the component unmounts.
  useEffect(() => {
    return () => {
      if (original) URL.revokeObjectURL(original.url);
    };
  }, [original]);

  useEffect(() => {
    return () => {
      if (converted) URL.revokeObjectURL(converted.url);
    };
  }, [converted]);

  async function convert(file: File) {
    const url = URL.createObjectURL(file);
    // Replacing original triggers the cleanup effect for the previous one.
    setOriginal({ url, size: file.size, name: file.name, blob: file });
    setConverted(null);
    await runConversion(file, format, quality);
  }

  async function runConversion(source: Blob, fmt: Format, q: number) {
    const sourceUrl = URL.createObjectURL(source);
    try {
      const img = new Image();
      img.src = sourceUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const blob: Blob | null = await new Promise((resolve) =>
        c.toBlob(resolve, fmt, fmt === 'image/png' ? undefined : q),
      );
      if (blob) {
        setConverted({ url: URL.createObjectURL(blob), blob });
      }
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  async function reconvert() {
    if (!original) return;
    await runConversion(original.blob, format, quality);
  }

  function download() {
    if (!converted) return;
    const ext = format.split('/')[1];
    downloadBlob(converted.blob, `image.${ext}`);
  }

  return (
    <div className="space-y-4">
      <Dropzone
        accept="image/"
        ariaLabel={t('image-convert.drop', { ns: 'tools' })}
        onFile={(f) => void convert(f)}
      >
        <p className="text-sm text-muted-fg">{t('image-convert.drop', { ns: 'tools' })}</p>
      </Dropzone>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldHeader label={t('image-convert.format', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
          >
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
        <div>
          <FieldHeader
            label={`${t('image-convert.quality', { ns: 'tools' })} (${Math.round(quality * 100)}%)`}
          />
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            disabled={format === 'image/png'}
            className="w-full"
          />
        </div>
      </div>
      {original && (
        <Button variant="outline" onClick={reconvert}>
          {t('actions.generate')}
        </Button>
      )}
      {original && converted && (
        <div className="grid gap-4 md:grid-cols-2">
          <Preview label={t('image-convert.original', { ns: 'tools' })} url={original.url} size={original.size} />
          <div>
            <Preview
              label={t('image-convert.converted', { ns: 'tools' })}
              url={converted.url}
              size={converted.blob.size}
            />
            <Button onClick={download} className="mt-2">
              {t('actions.download')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Preview({ label, url, size }: { label: string; url: string; size: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-fg">
        <span>{label}</span>
        <span>{formatBytes(size)}</span>
      </div>
      <img src={url} className="max-h-80 w-full rounded-lg border border-border object-contain" />
    </div>
  );
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}
