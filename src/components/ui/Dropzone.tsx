import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  /** Called when the user picks a file (click) or drops one. */
  onFile: (file: File) => void;
  /** MIME type prefix the file must match, e.g. "image/". Files that don't match are ignored silently. */
  accept?: string;
  /** Native file input accept attribute. Defaults to `accept + "*"` if not provided. */
  inputAccept?: string;
  /** Visible content (icon, text, etc.). */
  children: ReactNode;
  className?: string;
  /** Aria label for the implicit button (the click target). Required for screen readers. */
  ariaLabel: string;
}

/**
 * Click-or-drop file picker. Wraps a hidden <input type="file"> and adds
 * proper drag-and-drop semantics, including the `dragover.preventDefault()`
 * dance that's required to actually receive a `drop` event in the browser.
 */
export function Dropzone({ onFile, accept, inputAccept, children, className, ariaLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Track depth because dragenter/leave fire for descendants too. A naive
  // boolean flickers when the cursor crosses inner elements.
  const dragDepth = useRef(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const matches = (file: File): boolean => {
    if (!accept) return true;
    return file.type.startsWith(accept);
  };

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!matches(file)) return;
    onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setIsDragOver(true);
      }}
      onDragOver={(e) => {
        // Required: without preventDefault on dragover the browser refuses
        // to fire `drop` and instead navigates to the file.
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setIsDragOver(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        'cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/40 p-8 text-center transition-colors',
        'hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        isDragOver && 'border-primary bg-primary/10',
        className,
      )}
    >
      {children}
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={inputAccept ?? (accept ? `${accept}*` : undefined)}
        onChange={(e) => {
          pick(e.target.files?.[0]);
          // Reset so picking the same file twice still fires onChange.
          e.target.value = '';
        }}
      />
    </div>
  );
}
