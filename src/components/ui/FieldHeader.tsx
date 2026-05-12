import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  /**
   * The label / heading on the left side. Most callers pass a string;
   * complex cases (e.g. summary text with stats) can pass any node.
   */
  label: ReactNode;
  /** htmlFor on the underlying <label>. Pass when the label describes a field with an id. */
  htmlFor?: string;
  /** Right-aligned action area. Typically a <CopyButton/>. Optional. */
  action?: ReactNode;
  className?: string;
  /**
   * Render the label as <span> instead of <label>. Use when there is no
   * associated form control (e.g. <pre> output blocks).
   */
  asSpan?: boolean;
}

/**
 * A consistent header row for input/output fields.
 *
 * Why min-h-[2rem]: keeps both columns the same height even when only
 * one column has a CopyButton (h-8 = 2rem), so the <Textarea> below
 * stays vertically aligned across the grid.
 */
export function FieldHeader({ label, htmlFor, action, className, asSpan }: Props) {
  const Tag = asSpan ? 'span' : 'label';
  return (
    <div className={cn('mb-1.5 flex min-h-8 items-center justify-between gap-2', className)}>
      <Tag htmlFor={asSpan ? undefined : htmlFor} className="text-xs text-muted-fg">
        {label}
      </Tag>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
