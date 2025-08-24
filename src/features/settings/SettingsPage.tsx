import React from 'react';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      
      <main className="space-y-8 sm:space-y-12 lg:space-y-16">
        <Section
          title="SETTINGS & CONFIGURATION"
          subtitle="Manage your account, preferences, and system settings"
          titleGradient
        >
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <h3 className="font-heading text-heading-md text-dark-100 mb-4">
              ⚙️ System Settings
            </h3>
            <p className="text-dark-300">
              Settings and configuration features will be implemented here.
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
};

export default SettingsPage;
