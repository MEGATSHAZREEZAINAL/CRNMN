import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'brand' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-dark-800 border border-dark-600',
  glass: 'glass border border-dark-600/50',
  elevated: 'bg-dark-800 border border-dark-600 shadow-elevation-2',
  brand: 'bg-dark-800 border border-brand-electric/30 shadow-glow-brand',
  ghost: 'bg-transparent border border-dark-700',
};

const cardPaddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg transition-all duration-300',
        cardVariants[variant],
        cardPaddings[padding],
        {
          'hover:scale-105 hover:shadow-elevation-3 cursor-pointer': hover,
          'animate-glow-pulse': glow,
          'transform-gpu': hover,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex items-center pt-6', className)} {...props}>
      {children}
    </div>
  );
};
