import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width = 'w-full', 
  height = 'h-4' 
}) => (
  <div 
    className={cn(
      'animate-pulse bg-dark-600 rounded',
      width,
      height,
      className
    )}
  />
);

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface ContentLoaderProps {
  lines?: number;
  className?: string;
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index} 
        height="h-4" 
        width={index === lines - 1 ? 'w-3/4' : 'w-full'} 
      />
    ))}
  </div>
);

interface CardLoaderProps {
  className?: string;
}

export const CardLoader: React.FC<CardLoaderProps> = ({ className }) => (
  <div className={cn('p-4 space-y-4', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton height="h-4" width="w-3/4" />
        <Skeleton height="h-3" width="w-1/2" />
      </div>
    </div>
    <ContentLoader lines={2} />
  </div>
);
