import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const fieldBase =
  'w-full rounded-lg border border-border bg-card text-fg placeholder:text-muted-fg ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
  'transition-colors px-3 py-2 text-sm ' +
  'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(fieldBase, 'h-9', className)} {...rest} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, spellCheck, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      // Code/JSON/etc. is the dominant use case — disable spellcheck unless caller opts in.
      spellCheck={spellCheck ?? false}
      className={cn(fieldBase, 'min-h-[8rem] resize-y font-mono leading-relaxed', className)}
      {...rest}
    />
  );
});
