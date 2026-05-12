import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary/90 active:bg-primary/95 disabled:opacity-50',
  secondary:
    'bg-muted text-fg hover:bg-muted/70 active:bg-muted/80 disabled:opacity-50',
  ghost: 'hover:bg-muted active:bg-muted/80 text-fg disabled:opacity-50',
  outline:
    'border border-border bg-transparent hover:bg-muted active:bg-muted/80 text-fg disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', size = 'md', type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      // Default to type="button" so a Button inside a <form> doesn't accidentally submit.
      type={type ?? 'button'}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});
