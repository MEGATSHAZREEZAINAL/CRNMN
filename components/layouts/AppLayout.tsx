import React, { useState, lazy, Suspense } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
const AnalyticsDashboard = lazy(() => import('../analytics/AnalyticsDashboard'));
const TeamDashboard = lazy(() => import('../team/TeamDashboard'));
import TwilioDashboard from '../TwilioDashboard';
import { cn } from '../../utils/cn';
import type { Financials } from '../../types';

interface AppLayoutProps {
  financials: Financials;
  aiInsight: string;
  isBriefingLoading: boolean;
  className?: string;
}

type ActiveSection =
  | 'dashboard'
  | 'analytics'
  | 'team'
  | 'generate'
  | 'sales'
  | 'operations'
  | 'whatsapp';

export const AppLayout: React.FC<AppLayoutProps> = ({
  financials,
  aiInsight,
  isBriefingLoading,
  className,
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return (
          <Suspense fallback={<div className="text-dark-300 font-mono">Loading analytics...</div>}>
            <AnalyticsDashboard />
          </Suspense>
        );
      case 'team':
        return (
          <Suspense fallback={<div className="text-dark-300 font-mono">Loading team...</div>}>
            <TeamDashboard />
          </Suspense>
        );
      case 'dashboard':
        return (
          <Dashboard
            financials={financials}
            aiInsight={aiInsight}
            isBriefingLoading={isBriefingLoading}
          />
        );
      case 'whatsapp':
        return (
          <Suspense
            fallback={<div className="text-dark-300 font-mono">Loading Twilio Dashboard...</div>}
          >
            <TwilioDashboard />
          </Suspense>
        );
      case 'generate':
      case 'sales':
      case 'operations':
        return (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <h2 className="text-display-md font-display font-bold text-dark-300 mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-body-lg text-dark-500 font-mono">
                Coming soon in Phase 7+ implementation...
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('min-h-screen bg-dark-900 text-dark-100', className)}>
      {/* Navigation */}
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <main className="lg:ml-64 p-6 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};
