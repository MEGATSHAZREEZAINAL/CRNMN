import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
}

const buttonVariants = {
  primary:
    'bg-brand-electric text-dark-900 hover:bg-brand-electric-dark hover:shadow-glow-brand font-heading font-bold uppercase tracking-wider',
  secondary: 'bg-dark-700 text-dark-100 hover:bg-dark-600 border border-dark-600',
  outline:
    'bg-transparent text-brand-electric border border-brand-electric hover:bg-brand-electric hover:text-dark-900',
  ghost: 'bg-transparent text-dark-300 hover:text-dark-100 hover:bg-dark-700',
  danger: 'bg-accent-red text-white hover:bg-accent-red-dark',
};

const buttonSizes = {
  xs: 'px-2 py-1 text-body-sm',
  sm: 'px-3 py-1.5 text-body-md',
  md: 'px-4 py-2 text-body-lg',
  lg: 'px-6 py-3 text-heading-sm',
  xl: 'px-8 py-4 text-heading-md',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  glow = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        {
          'w-full': fullWidth,
          'animate-glow-pulse': glow,
          'transform hover:scale-105 active:scale-95': !disabled && !loading,
          'cursor-not-allowed': loading,
        },
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!loading && leftIcon && leftIcon}

      <span className={cn('whitespace-nowrap', { 'sr-only': loading })}>
        {loading ? 'Loading...' : children}
      </span>

      {!loading && rightIcon && rightIcon}
    </button>
  );
};
