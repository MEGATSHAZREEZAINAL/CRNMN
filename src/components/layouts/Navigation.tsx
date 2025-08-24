import React, { useState } from 'react';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { cn } from '../../utils/cn';

type ActiveSection =
  | 'dashboard'
  | 'analytics'
  | 'team'
  | 'generate'
  | 'sales'
  | 'operations'
  | 'whatsapp';

interface NavigationProps {
  className?: string;
  activeSection?: ActiveSection;
  onSectionChange?: (section: ActiveSection) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: {
    count: number;
    variant: 'brand' | 'success' | 'warning' | 'error';
  };
  onClick?: () => void;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
        />
      </svg>
    ),
    isActive: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    badge: { count: 5, variant: 'brand' },
  },
  {
    id: 'team',
    label: 'Team',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    badge: { count: 7, variant: 'brand' },
  },
  {
    id: 'whatsapp',
    label: 'Twilio',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    badge: { count: 8, variant: 'brand' },
  },
  {
    id: 'generate',
    label: 'Generate',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    badge: { count: 3, variant: 'success' },
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    badge: { count: 12, variant: 'success' },
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    badge: { count: 2, variant: 'warning' },
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  className,
  activeSection = 'dashboard',
  onSectionChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId as ActiveSection);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-dark-900 lg:border-r lg:border-dark-600 lg:z-50',
          {
            'lg:w-16': isCollapsed,
          },
          className,
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-dark-600">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-electric rounded-lg flex items-center justify-center">
                  <span className="text-dark-900 font-heading font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="font-heading text-heading-sm text-brand-electric">CORNMAN</h1>
                  <p className="text-caption text-dark-400 font-mono">Strategic HQ</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-dark-400 hover:text-dark-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 space-y-2 px-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left',
                {
                  'bg-brand-electric/10 border border-brand-electric/20 text-brand-electric':
                    activeSection === item.id,
                  'text-dark-300 hover:text-dark-100 hover:bg-dark-800': activeSection !== item.id,
                  'justify-center': isCollapsed,
                },
              )}
            >
              <div className="flex items-center justify-center w-5 h-5">{item.icon}</div>

              {!isCollapsed && (
                <>
                  <span className="font-mono text-body-md font-medium flex-1 uppercase tracking-wide">
                    {item.label}
                  </span>

                  {item.badge && (
                    <Badge variant={item.badge.variant} size="sm">
                      {item.badge.count}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-dark-600">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-800">
                <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
                  <span className="text-dark-900 font-heading font-bold text-xs">M</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-body-sm text-dark-100 font-medium">MEGAT</p>
                  <p className="text-caption text-dark-400 truncate">Owner</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-600 z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200',
                {
                  'text-brand-electric': activeSection === item.id,
                  'text-dark-400': activeSection !== item.id,
                },
              )}
            >
              <div className="relative">
                <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                {item.badge && (
                  <Badge
                    variant={item.badge.variant}
                    size="sm"
                    className="absolute -top-1 -right-1 w-5 h-5 text-[10px]"
                  >
                    {item.badge.count > 9 ? '9+' : item.badge.count}
                  </Badge>
                )}
              </div>
              <span className="text-caption font-mono font-medium uppercase tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Spacer */}
      <div className="lg:ml-64 lg:pl-0" style={{ marginLeft: isCollapsed ? '4rem' : '16rem' }}>
        {/* Content goes here */}
      </div>
    </>
  );
};
