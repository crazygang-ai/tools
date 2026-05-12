import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Dropzone } from '@/components/ui/Dropzone';
import { downloadBlob } from '@/lib/copy';

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512] as const;

export default function Favicon() {
  const { t } = useTranslation();
  const [src, setSrc] = useState<HTMLImageElement | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string; blob: Blob }[]>([]);

  async function generate(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await new Promise((r, j) => {
      img.onload = () => r(null);
      img.onerror = j;
    });
    setSrc(img);
    const out: { size: number; url: string; blob: Blob }[] = [];
    for (const s of SIZES) {
      const c = document.createElement('canvas');
      c.width = s;
      c.height = s;
      const ctx = c.getContext('2d');
      if (!ctx) continue;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, s, s);
      const b: Blob | null = await new Promise((r) => c.toBlob(r, 'image/png'));
      if (b) out.push({ size: s, url: URL.createObjectURL(b), blob: b });
    }
    setPreviews(out);
  }

  function downloadOne(p: { size: number; blob: Blob }) {
    downloadBlob(p.blob, `favicon-${p.size}.png`);
  }

  function downloadAll() {
    previews.forEach((p) => downloadOne(p));
  }

  return (
    <div className="space-y-4">
      <Dropzone
        accept="image/"
        ariaLabel={t('favicon.drop', { ns: 'tools' })}
        onFile={(f) => void generate(f)}
      >
        <p className="text-sm text-muted-fg">{t('favicon.drop', { ns: 'tools' })}</p>
      </Dropzone>
      {src && previews.length > 0 && (
        <>
          <div className="flex items-center justify-end">
            <Button onClick={downloadAll}>{t('favicon.downloadAll', { ns: 'tools' })}</Button>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {previews.map((p) => (
              <div
                key={p.size}
                className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-card p-3 hover:border-primary/40"
                onClick={() => downloadOne(p)}
              >
                <img
                  src={p.url}
                  width={Math.min(64, p.size)}
                  height={Math.min(64, p.size)}
                  className="rounded"
                  alt={`${p.size}px`}
                />
                <div className="mt-2 text-xs text-muted-fg">{p.size}×{p.size}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
