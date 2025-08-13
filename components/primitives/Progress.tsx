import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
}

const progressVariants = {
  brand: 'bg-brand-electric',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  ghost: 'bg-dark-400',
};

const progressSizes = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  showValue = false,
  label,
  animated = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full space-y-2', className)} {...props}>
      {(showLabel || showValue) && (
        <div className="flex justify-between items-center">
          {showLabel && label && (
            <span className="text-body-sm font-mono text-dark-300 uppercase tracking-wide">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-body-sm font-mono text-dark-200">
              {value.toLocaleString()}/{max.toLocaleString()} ({percentage.toFixed(0)}%)
            </span>
          )}
        </div>
      )}

      <div className={cn('w-full bg-dark-700 rounded-full overflow-hidden', progressSizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            progressVariants[variant],
            {
              'animate-pulse': animated,
            },
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
