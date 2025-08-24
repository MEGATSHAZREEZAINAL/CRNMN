import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'ghost' | 'brand';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const inputVariants = {
  default:
    'bg-dark-800 border-dark-600 text-dark-100 placeholder-dark-400 focus:border-brand-electric focus:ring-brand-electric/20',
  ghost:
    'bg-transparent border-dark-700 text-dark-100 placeholder-dark-500 focus:border-dark-500 focus:ring-dark-500/20',
  brand:
    'bg-dark-900 border-brand-electric/30 text-dark-100 placeholder-dark-400 focus:border-brand-electric focus:ring-brand-electric/20',
};

const inputSizes = {
  sm: 'px-3 py-2 text-body-md',
  md: 'px-4 py-2.5 text-body-lg',
  lg: 'px-5 py-3 text-heading-sm',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('space-y-2', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-md font-mono font-medium text-dark-200 uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 font-mono disabled:opacity-50 disabled:cursor-not-allowed',
              inputVariants[variant],
              inputSizes[inputSize],
              {
                'w-full': fullWidth,
                'pl-10': leftIcon,
                'pr-10': rightIcon,
                'border-accent-red focus:border-accent-red focus:ring-accent-red/20': error,
              },
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-body-sm text-accent-red font-mono flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && <p className="text-body-sm text-dark-400 font-mono">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
