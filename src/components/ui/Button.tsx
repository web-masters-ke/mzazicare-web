import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: `
        bg-primary-500 hover:bg-primary-600
        text-white
        shadow-colored hover:shadow-colored-lg
        font-semibold
        transition-all duration-200
      `,
      secondary: `
        bg-dark-100 dark:bg-dark-800
        text-dark-700 dark:text-dark-200
        hover:bg-dark-200 dark:hover:bg-dark-700
        font-semibold
        transition-all duration-200
      `,
      ghost: `
        text-dark-600 dark:text-dark-400
        hover:bg-dark-100 dark:hover:bg-dark-800
        hover:text-dark-900 dark:hover:text-dark-100
        font-semibold
        transition-all duration-200
      `,
      danger: `
        bg-red-500 text-white
        hover:bg-red-600
        shadow-[0_4px_14px_-2px_rgba(239,68,68,0.25)]
        font-semibold
        transition-all duration-200
      `,
      success: `
        bg-success-500 text-white
        hover:bg-success-600
        shadow-[0_4px_14px_-2px_rgba(20,184,160,0.25)]
        font-semibold
        transition-all duration-200
      `,
      outline: `
        border border-dark-200 dark:border-dark-700
        text-dark-700 dark:text-dark-200
        hover:bg-dark-50 dark:hover:bg-dark-800
        hover:border-dark-300 dark:hover:border-dark-600
        font-semibold
        transition-all duration-200
      `,
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
      xl: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
      icon: 'p-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
