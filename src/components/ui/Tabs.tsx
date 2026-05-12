import { useId, useRef, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';

interface Tab<T extends string> {
  value: T;
  label: ReactNode;
}

interface Props<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  /** Accessible label for the tablist (required if no visible label) */
  'aria-label'?: string;
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  'aria-label': ariaLabel,
}: Props<T>) {
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const target = tabs[next];
    onChange(target.value);
    refs.current[next]?.focus();
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-muted p-1',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((t, i) => {
        const selected = t.value === value;
        const id = `${baseId}-tab-${t.value}`;
        return (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => handleKey(e, i)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-muted',
              selected
                ? 'bg-card text-fg shadow-sm'
                : 'text-muted-fg hover:bg-card/60 hover:text-fg',
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
