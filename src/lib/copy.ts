export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copy a Blob (typically `image/png`) to the system clipboard.
 *
 * Returns `true` on success. Falls back to `false` when the browser
 * lacks `ClipboardItem` (older Safari, Firefox without dom.events.asyncClipboard
 * enabled, insecure context) — callers should react by surfacing a toast
 * or auto-downloading instead of silently failing.
 *
 * Note: `navigator.clipboard.write` may reject if the document doesn't
 * have transient user activation (e.g. clipboard write outside a click
 * handler), so always invoke this directly inside the click callback.
 */
export async function copyBlob(blob: Blob): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
