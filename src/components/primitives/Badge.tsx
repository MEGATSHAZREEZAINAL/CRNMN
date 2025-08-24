import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'brand' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  children: React.ReactNode;
}

const badgeVariants = {
  success: 'bg-status-success/20 text-status-success border-status-success/30',
  warning: 'bg-status-warning/20 text-status-warning border-status-warning/30',
  error: 'bg-status-error/20 text-status-error border-status-error/30',
  info: 'bg-status-info/20 text-status-info border-status-info/30',
  brand: 'bg-brand-electric/20 text-brand-electric border-brand-electric/30',
  ghost: 'bg-dark-700 text-dark-300 border-dark-600',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-caption',
  md: 'px-2.5 py-1 text-body-sm',
  lg: 'px-3 py-1.5 text-body-md',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'ghost',
  size = 'md',
  pulse = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-mono font-medium uppercase tracking-wide transition-all duration-200',
        badgeVariants[variant],
        badgeSizes[size],
        {
          'animate-pulse': pulse,
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
