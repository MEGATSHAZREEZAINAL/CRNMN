import React from 'react';
import { Card, CardContent } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { Progress } from '../primitives/Progress';
import { cn } from '../../utils/cn';

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    isPercentage?: boolean;
  };
  color?: 'brand' | 'success' | 'warning' | 'error' | 'info';
  progress?: {
    current: number;
    target: number;
  };
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const colorMap = {
  brand: {
    card: 'brand',
    badge: 'brand',
    progress: 'brand',
    text: 'text-brand-electric',
  },
  success: {
    card: 'default',
    badge: 'success',
    progress: 'success',
    text: 'text-status-success',
  },
  warning: {
    card: 'default',
    badge: 'warning',
    progress: 'warning',
    text: 'text-status-warning',
  },
  error: {
    card: 'default',
    badge: 'error',
    progress: 'error',
    text: 'text-status-error',
  },
  info: {
    card: 'default',
    badge: 'info',
    progress: 'info',
    text: 'text-status-info',
  },
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  change,
  color = 'brand',
  progress,
  icon,
  subtitle,
  trend,
  className,
}) => {
  const colors = colorMap[color];

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend || trend === 'neutral') return null;

    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-status-error" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <Card variant={colors.card} hover className={cn('group', className)}>
      <CardContent className="space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className={cn('p-2 rounded-lg bg-dark-700', colors.text)}>{icon}</div>}
            <div>
              <h3 className="font-mono text-body-md text-dark-300 uppercase tracking-wider">
                {title}
              </h3>
              {subtitle && <p className="text-caption text-dark-400 font-mono mt-1">{subtitle}</p>}
            </div>
          </div>

          {trend && <div className="flex items-center gap-1">{getTrendIcon()}</div>}
        </div>

        {/* Main value */}
        <div className="space-y-2">
          <div className={cn('font-display text-display-sm font-bold', colors.text)}>
            {formatValue(value)}
          </div>

          {change && (
            <div className="flex items-center gap-2">
              <Badge variant={change.value >= 0 ? 'success' : 'error'} size="sm">
                {change.value >= 0 ? '+' : ''}
                {change.value}
                {change.isPercentage ? '%' : ''}
              </Badge>
              <span className="text-body-sm text-dark-400 font-mono">{change.label}</span>
            </div>
          )}
        </div>

        {/* Progress bar if provided */}
        {progress && (
          <Progress
            value={progress.current}
            max={progress.target}
            variant={colors.progress}
            showValue
            size="md"
            animated
          />
        )}
      </CardContent>
    </Card>
  );
};
