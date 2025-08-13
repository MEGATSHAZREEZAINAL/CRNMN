import React, { useState } from 'react';
import Navigation from './Navigation';
import ViralPredictionDashboard from '../viral/ViralPredictionDashboard';

// Import other existing components (these would normally exist)
// For demo purposes, we'll create placeholder components
const DashboardComponent = () => (
  <div className="p-8">
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📊</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <p className="text-gray-600">Main dashboard coming soon...</p>
    </div>
  </div>
);

const SocialMediaComponent = () => (
  <div className="p-8">
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📱</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Social Media</h2>
      <p className="text-gray-600">AI-powered social media management...</p>
    </div>
  </div>
);

const AnalyticsComponent = () => (
  <div className="p-8">
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📈</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h2>
      <p className="text-gray-600">Advanced analytics and reporting...</p>
    </div>
  </div>
);

const TeamComponent = () => (
  <div className="p-8">
    <div className="text-center py-20">
      <div className="text-6xl mb-4">👥</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Management</h2>
      <p className="text-gray-600">Team collaboration and management...</p>
    </div>
  </div>
);

const EcommerceComponent = () => (
  <div className="p-8">
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">E-commerce</h2>
      <p className="text-gray-600">E-commerce integration and management...</p>
    </div>
  </div>
);

const AppLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('viral-prediction'); // Default to viral prediction

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardComponent />;
      case 'social-media':
        return <SocialMediaComponent />;
      case 'viral-prediction':
        return <ViralPredictionDashboard />;
      case 'analytics':
        return <AnalyticsComponent />;
      case 'team':
        return <TeamComponent />;
      case 'ecommerce':
        return <EcommerceComponent />;
      default:
        return <ViralPredictionDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar - Optional */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-600">
                {activeSection === 'viral-prediction' &&
                  'Revolutionary AI system with viral guarantee'}
                {activeSection === 'dashboard' && 'Overview of your corn business performance'}
                {activeSection === 'social-media' && 'AI-powered social media management'}
                {activeSection === 'analytics' && 'Advanced business intelligence and insights'}
                {activeSection === 'team' && 'Team collaboration and project management'}
                {activeSection === 'ecommerce' && 'Online store and e-commerce tools'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex space-x-3">
              {activeSection === 'viral-prediction' && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Live Prediction</span>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    🚀 Quick Predict
                  </button>
                </div>
              )}

              {activeSection !== 'viral-prediction' && (
                <button
                  onClick={() => setActiveSection('viral-prediction')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all animate-pulse"
                >
                  🔥 Try Viral Predictor
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AppLayout;
