import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-dark-900 rounded-2xl p-6',
      bordered: 'bg-white dark:bg-dark-900 rounded-2xl p-6 border border-dark-200 dark:border-dark-800',
      elevated: `
        bg-white dark:bg-dark-900 rounded-2xl p-6
        shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.04)]
        dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_16px_rgba(0,0,0,0.15)]
      `,
      interactive: `
        bg-white dark:bg-dark-900 rounded-2xl p-6 cursor-pointer
        shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.04)]
        dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_16px_rgba(0,0,0,0.15)]
        hover:shadow-[0_2px_8px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.06)]
        dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.2)]
        transition-shadow duration-200
      `,
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
