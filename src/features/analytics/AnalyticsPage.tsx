import React from 'react';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      
      <main className="space-y-8 sm:space-y-12 lg:space-y-16">
        <Section
          title="ANALYTICS & INSIGHTS"
          subtitle="Business intelligence and performance metrics"
          titleGradient
        >
          <AnalyticsDashboard />
        </Section>
      </main>
    </div>
  );
};

export default AnalyticsPage;
