import React from 'react';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { Card, CardContent } from '../primitives/Card';
import { useOffline } from '../../hooks/useOffline';
import { cn } from '../../utils/cn';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className }) => {
  const {
    isOnline,
    hasOfflineData,
    lastSync,
    syncInProgress,
    syncError,
    needsSync,
    syncWithServer,
  } = useOffline();

  if (isOnline && !syncInProgress && !needsSync && !syncError) {
    return null; // Don't show anything when everything is normal
  }

  return (
    <div className={cn('fixed top-4 left-1/2 transform -translate-x-1/2 z-50', className)}>
      <Card
        variant={isOnline ? (syncError ? 'default' : 'brand') : 'elevated'}
        className="shadow-elevation-3 backdrop-blur-md"
      >
        <CardContent className="py-3 px-4 flex items-center gap-3">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <>
                <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></div>
                <Badge variant="error" size="sm">
                  OFFLINE
                </Badge>
              </>
            ) : syncInProgress ? (
              <>
                <div className="w-2 h-2 bg-brand-electric rounded-full animate-pulse"></div>
                <Badge variant="brand" size="sm" pulse>
                  SYNCING
                </Badge>
              </>
            ) : syncError ? (
              <>
                <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                <Badge variant="warning" size="sm">
                  SYNC ERROR
                </Badge>
              </>
            ) : needsSync ? (
              <>
                <div className="w-2 h-2 bg-accent-yellow rounded-full animate-pulse"></div>
                <Badge variant="warning" size="sm">
                  NEEDS SYNC
                </Badge>
              </>
            ) : null}
          </div>

          {/* Status text */}
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-mono text-dark-100 font-medium">
              {!isOnline
                ? 'Working offline'
                : syncInProgress
                  ? 'Syncing data...'
                  : syncError
                    ? 'Sync failed'
                    : needsSync
                      ? 'Ready to sync'
                      : null}
            </p>
            {lastSync && (
              <p className="text-caption text-dark-400 font-mono">
                Last sync:{' '}
                {lastSync.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>

          {/* Action button */}
          {(needsSync || syncError) && (
            <Button
              variant="outline"
              size="sm"
              onClick={syncWithServer}
              disabled={syncInProgress}
              className="font-mono text-xs"
            >
              {syncInProgress ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}

          {/* Offline data indicator */}
          {!isOnline && hasOfflineData && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-caption text-status-success font-mono">Data saved</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
