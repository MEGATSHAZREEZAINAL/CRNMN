import type {
  ReactNode,
  ButtonHTMLAttributes,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
  HTMLAttributes,
} from 'react';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Base Button Interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Enhanced Primary Button with Design System
export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseClasses =
    'font-heading font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-dark-900';

  const variantClasses = {
    primary: 'btn-brand',
    secondary:
      'bg-dark-700 text-dark-100 hover:bg-dark-600 border border-dark-600 hover:border-brand-electric',
    outline:
      'bg-transparent text-brand-electric border border-brand-electric hover:bg-brand-electric hover:text-dark-900',
    ghost: 'bg-transparent text-dark-100 hover:bg-dark-800 hover:text-brand-electric',
    danger: 'bg-accent-red text-white hover:bg-accent-red-dark',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          Processing...
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// Legacy Buttons (Updated with new design system)
export const AiButton = ({ children, className, ...props }: ButtonProps): React.ReactNode => (
  <Button variant="primary" size="md" className={`w-full ${className}`} {...props}>
    {children}
  </Button>
);

export const PostButton = ({ children, className, ...props }: ButtonProps): React.ReactNode => (
  <Button variant="outline" size="md" className={`w-full ${className}`} {...props}>
    {children}
  </Button>
);

export const ScheduleButton = ({ children, className, ...props }: ButtonProps): React.ReactNode => (
  <Button variant="secondary" size="md" className={`w-full ${className}`} {...props}>
    {children}
  </Button>
);

export const RestockButton = ({ children, className, ...props }: ButtonProps): React.ReactNode => (
  <Button
    variant="primary"
    size="sm"
    className={`bg-accent-yellow text-dark-900 hover:bg-accent-yellow-dark text-xs ${className}`}
    {...props}
  >
    {children}
  </Button>
);

// Input Components
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-dark-100">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400
            focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent
            transition-colors duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-accent-red' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-accent-red">{error}</p>}
    </div>
  );
};

// Enhanced Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-dark-100">{label}</label>}
      <textarea
        className={`
          w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400
          focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent
          transition-colors duration-200 resize-vertical min-h-[100px]
          ${error ? 'border-accent-red' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-accent-red">{error}</p>}
    </div>
  );
};

// Legacy Composer Textarea (Updated)
export const ComposerTextarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>): React.ReactNode => (
  <Textarea className={`mt-4 min-h-[120px] ${className}`} {...props} />
);

// Toggle Switch Component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8',
  };

  const thumbSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        className={`
          ${sizes[size]} bg-dark-600 rounded-full p-0.5 transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-dark-900
          ${checked ? 'bg-brand-electric' : 'bg-dark-600'}
        `}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`
            ${thumbSizes[size]} bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-full' : 'translate-x-0'}
          `}
        />
      </button>
      {label && <span className="text-sm font-medium text-dark-100">{label}</span>}
    </div>
  );
};

// Badge Component
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider rounded-full';

  const variantClasses = {
    primary: 'bg-brand-electric text-dark-900',
    secondary: 'bg-dark-600 text-dark-100',
    success: 'bg-status-success text-white',
    warning: 'bg-status-warning text-dark-900',
    error: 'bg-status-error text-white',
    info: 'bg-status-info text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Progress Bar Component
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'brand' | 'success' | 'warning' | 'error';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  color = 'brand',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    brand: 'bg-brand-electric',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-dark-100">Progress</span>
          <span className="text-dark-300">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Theme Toggle Button
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="md" onClick={toggleTheme} className="p-2">
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </Button>
  );
};
