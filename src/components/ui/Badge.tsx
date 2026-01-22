import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          {
            'bg-secondary text-secondary-foreground': variant === 'default',
            'bg-emerald-500/20 text-emerald-400': variant === 'success',
            'bg-amber-500/20 text-amber-600': variant === 'warning',
            'bg-destructive/20 text-destructive': variant === 'destructive',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
