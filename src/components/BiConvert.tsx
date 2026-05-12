import { useId, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

export interface BiConvertProps {
  leftLabel: string;
  rightLabel: string;
  /** Left → Right */
  forward: (input: string) => string;
  /** Right → Left */
  backward: (input: string) => string;
  invalidLeft: string;
  invalidRight: string;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  rows?: number;
  hint?: ReactNode;
}

type Direction = 'forward' | 'backward';

export function BiConvert({
  leftLabel,
  rightLabel,
  forward,
  backward,
  invalidLeft,
  invalidRight,
  leftPlaceholder,
  rightPlaceholder,
  rows = 14,
  hint,
}: BiConvertProps) {
  const [dir, setDir] = useState<Direction>('forward');
  const [input, setInput] = useState('');

  const inputId = useId();
  const outputId = useId();
  const errorId = useId();

  // Output is derived from input/direction — no effect needed.
  const { output, error } = useMemo<{ output: string; error: string | null }>(() => {
    if (!input.trim()) return { output: '', error: null };
    try {
      const out = dir === 'forward' ? forward(input) : backward(input);
      return { output: out, error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, dir, forward, backward]);

  function swap() {
    setDir((d) => (d === 'forward' ? 'backward' : 'forward'));
    setInput(output);
  }

  const lLabel = dir === 'forward' ? leftLabel : rightLabel;
  const rLabel = dir === 'forward' ? rightLabel : leftLabel;
  const errLabel = dir === 'forward' ? invalidLeft : invalidRight;
  const lPh = dir === 'forward' ? leftPlaceholder : rightPlaceholder;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={swap}
          aria-label={`${lLabel} → ${rLabel}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <span>{lLabel}</span>
          <ArrowRight size={14} aria-hidden="true" />
          <span>{rLabel}</span>
        </button>
        {hint}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader htmlFor={inputId} label={lLabel} />
          <Textarea
            id={inputId}
            rows={rows}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lPh}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
        <div>
          <FieldHeader
            htmlFor={outputId}
            label={rLabel}
            action={<CopyButton value={output} />}
          />
          {error ? (
            <div
              id={errorId}
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <div className="font-semibold">{errLabel}</div>
              <div className="mt-1 break-words font-mono text-xs">{error}</div>
            </div>
          ) : (
            <Textarea id={outputId} readOnly rows={rows} value={output} />
          )}
        </div>
      </div>
    </div>
  );
}
