import type { ReactNode, HTMLAttributes } from 'react';
import React from 'react';

// Enhanced Card Component with Design System
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'lg',
  hover = false,
  glow = false,
  ...props
}) => {
  const baseClasses = 'flex flex-col transition-all duration-300 rounded-lg';

  const variantClasses = {
    default: 'card-dark',
    glass: 'card-glass',
    elevated: 'card-dark shadow-elevation-2',
    outlined: 'bg-transparent border-2 border-brand-electric',
    gradient: 'bg-gradient-to-br from-dark-800 to-dark-850 border border-dark-600',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-elevation-3 cursor-pointer' : '';
  const glowClasses = glow ? 'animate-glow-pulse' : '';

  return (
    <div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${hoverClasses} 
        ${glowClasses} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', action }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div className="flex-1">{children}</div>
    {action && <div className="flex-shrink-0 ml-4">{action}</div>}
  </div>
);

// Enhanced Card Content
interface CardContentProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  scrollable = false,
}) => {
  const scrollClasses = scrollable ? 'overflow-auto scrollbar-brand' : '';

  return <div className={`flex-grow ${scrollClasses} ${className}`}>{children}</div>;
};

// Enhanced Card Title
interface CardTitleProps {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
  gradient?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  level = 3,
  gradient = false,
}) => {
  const sizeClasses = {
    1: 'text-display-sm',
    2: 'text-heading-xl',
    3: 'text-heading-lg',
    4: 'text-heading-md',
  };

  const baseClasses = `font-heading font-bold ${sizeClasses[level]}`;
  const gradientClasses = gradient ? 'text-brand-gradient' : 'text-dark-50';

  if (level === 1) {
    return <h1 className={`${baseClasses} ${gradientClasses} ${className}`}>{children}</h1>;
  } else if (level === 2) {
    return <h2 className={`${baseClasses} ${gradientClasses} ${className}`}>{children}</h2>;
  } else if (level === 3) {
    return <h3 className={`${baseClasses} ${gradientClasses} ${className}`}>{children}</h3>;
  } else {
    return <h4 className={`${baseClasses} ${gradientClasses} ${className}`}>{children}</h4>;
  }
};

// Enhanced Card Description
interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-body-sm',
    md: 'text-body-md',
    lg: 'text-body-lg',
  };

  return <p className={`text-dark-300 mb-4 ${sizeClasses[size]} ${className}`}>{children}</p>;
};

// Card Footer Component
interface CardFooterProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  justify = 'end',
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-3 mt-6 pt-4 border-t border-dark-600 ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
};

// Status Card Component
interface StatusCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  color?: 'brand' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'brand',
  className = '',
}) => {
  const colorClasses = {
    brand: 'text-brand-electric',
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    info: 'text-status-info',
  };

  return (
    <Card className={`relative overflow-hidden ${className}`} hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-dark-400 text-body-sm uppercase tracking-wider font-mono">{title}</p>
            <p className={`text-display-sm font-display font-bold mt-2 ${colorClasses[color]}`}>
              {value}
            </p>
            {change && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-body-sm font-bold ${
                    change.positive !== false ? 'text-status-success' : 'text-status-error'
                  }`}
                >
                  {change.positive !== false ? '↗' : '↘'} {Math.abs(change.value)}%
                </span>
                <span className="text-dark-400 text-body-sm">{change.label}</span>
              </div>
            )}
          </div>
          {icon && <div className={`text-2xl ${colorClasses[color]} opacity-80`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
