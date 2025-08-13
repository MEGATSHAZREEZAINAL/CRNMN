import React from 'react';
import { StatusCard } from '../composed/StatusCard';
import { Card, CardContent, CardHeader } from '../primitives/Card';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { Progress } from '../primitives/Progress';
import { cn } from '../../utils/cn';
import type { Financials } from '../../types';

interface DashboardProps {
  financials: Financials;
  aiInsight: string;
  isBriefingLoading: boolean;
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'brand' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'generate-content',
    title: 'Generate Content',
    description: 'AI-powered content creation',
    color: 'brand',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    id: 'check-inventory',
    title: 'Check Inventory',
    description: 'Monitor stock levels',
    color: 'warning',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9v10m6-10v10"
        />
      </svg>
    ),
  },
  {
    id: 'view-sales',
    title: 'View Sales',
    description: 'Real-time sales data',
    color: 'success',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  financials,
  aiInsight,
  isBriefingLoading,
  className,
}) => {
  const goalProgress = (financials.totalRevenue / financials.goal) * 100;
  const profitMargin = (financials.profit / financials.totalRevenue) * 100 || 0;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero KPIs Section */}
      <section>
        <div className="mb-6">
          <h1 className="font-display text-display-md text-brand-electric mb-2">STRATEGIC HQ</h1>
          <p className="text-body-lg text-dark-400 font-mono">Command center for CORNMAN empire</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue - Most Important */}
          <StatusCard
            title="Revenue (MTD)"
            value={`RM ${financials.totalRevenue.toLocaleString()}`}
            color="brand"
            progress={{
              current: financials.totalRevenue,
              target: financials.goal,
            }}
            trend="up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            }
            className="md:col-span-2 lg:col-span-1"
          />

          {/* Profit */}
          <StatusCard
            title="Profit"
            value={`RM ${financials.profit.toLocaleString()}`}
            change={{
              value: profitMargin,
              label: 'margin',
              isPercentage: true,
            }}
            color={financials.profit > 0 ? 'success' : 'error'}
            trend={financials.profit > 0 ? 'up' : 'down'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />

          {/* Goal Progress */}
          <StatusCard
            title="Monthly Goal"
            value={`${goalProgress.toFixed(0)}%`}
            subtitle={`RM ${financials.goal.toLocaleString()} target`}
            color={goalProgress >= 80 ? 'success' : goalProgress >= 50 ? 'warning' : 'error'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            }
          />
        </div>
      </section>

      {/* AI Strategic Alert - Prominent */}
      <section>
        <Card variant="brand" glow className="border-brand-electric/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-electric/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-brand-electric"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-heading-md text-brand-electric uppercase tracking-wide">
                  AI STRATEGIC ADVISOR
                </h3>
                <p className="text-body-sm text-dark-400 font-mono">
                  Real-time insights and recommendations
                </p>
              </div>
              <Badge variant={isBriefingLoading ? 'warning' : 'success'} pulse={isBriefingLoading}>
                {isBriefingLoading ? 'ANALYZING' : 'ACTIVE'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isBriefingLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-brand-electric border-t-transparent rounded-full"></div>
                <span className="text-dark-300 font-mono">Analyzing business data...</span>
              </div>
            ) : (
              <p className="text-body-lg text-dark-100 font-mono leading-relaxed">{aiInsight}</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions - Max 3 for Focus */}
      <section>
        <div className="mb-6">
          <h2 className="font-heading text-heading-lg text-dark-100 uppercase tracking-wide mb-2">
            QUICK ACTIONS
          </h2>
          <p className="text-body-md text-dark-400 font-mono">Most important actions for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card
              key={action.id}
              variant="elevated"
              hover
              className="cursor-pointer group"
              onClick={action.onClick}
            >
              <CardContent className="text-center space-y-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-200',
                    {
                      'bg-brand-electric/20 text-brand-electric group-hover:bg-brand-electric group-hover:text-dark-900':
                        action.color === 'brand',
                      'bg-status-success/20 text-status-success group-hover:bg-status-success group-hover:text-dark-900':
                        action.color === 'success',
                      'bg-status-warning/20 text-status-warning group-hover:bg-status-warning group-hover:text-dark-900':
                        action.color === 'warning',
                      'bg-status-error/20 text-status-error group-hover:bg-status-error group-hover:text-dark-900':
                        action.color === 'error',
                    },
                  )}
                >
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-heading text-heading-sm text-dark-100 uppercase tracking-wide mb-2">
                    {action.title}
                  </h3>
                  <p className="text-body-sm text-dark-400 font-mono">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Secondary Modules - Collapsed by Default */}
      <section>
        <div className="mb-6">
          <h2 className="font-heading text-heading-lg text-dark-100 uppercase tracking-wide mb-2">
            BUSINESS MODULES
          </h2>
          <p className="text-body-md text-dark-400 font-mono">Expand to access detailed features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Marketing Suite */}
          <Card variant="ghost" hover className="cursor-pointer group">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-purple/20 text-accent-purple rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-body-lg font-medium text-dark-100 uppercase">
                    Marketing Suite
                  </h3>
                  <p className="text-body-sm text-dark-400">Content & social management</p>
                </div>
                <Badge variant="brand" size="sm">
                  5
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" fullWidth>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Operations Center */}
          <Card variant="ghost" hover className="cursor-pointer group">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-cyan/20 text-accent-cyan rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-body-lg font-medium text-dark-100 uppercase">
                    Operations Center
                  </h3>
                  <p className="text-body-sm text-dark-400">Sales & inventory management</p>
                </div>
                <Badge variant="success" size="sm">
                  Live
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" fullWidth>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Tools */}
          <Card variant="ghost" hover className="cursor-pointer group">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-orange/20 text-accent-orange rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-body-lg font-medium text-dark-100 uppercase">
                    Growth Tools
                  </h3>
                  <p className="text-body-sm text-dark-400">Strategy & expansion planning</p>
                </div>
                <Badge variant="warning" size="sm">
                  Beta
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" fullWidth>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
