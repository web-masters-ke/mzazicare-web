import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'stat-card',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="metric-label mb-1">{label}</p>
            <p className="metric">{value}</p>
          </div>
          {icon && (
            <div className="text-primary-500 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-3 pt-3 border-t border-dark-100 dark:border-dark-800">
            <span
              className={cn(
                'text-sm font-semibold',
                trend.isPositive
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export { StatCard };
