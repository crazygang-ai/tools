import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-fg shadow-sm',
        'transition-shadow',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold leading-tight', className)}>{children}</h3>;
}

export function CardDescription({ className, children }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-fg mt-1', className)}>{children}</p>;
}

export function CardBody({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}
