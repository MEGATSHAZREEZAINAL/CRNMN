import React from 'react';
import { Section } from '../../components/Section';
import { TwilioDashboard } from '../../components/TwilioDashboard';
import { SystemHandover } from '../../components/SystemHandover';
import { SystemStatus } from '../../components/SystemStatus';
import { useAppState } from '../../contexts/AppStateContext';

const WhatsAppPage: React.FC = () => {
  const { state } = useAppState();

  const handleConnectBot = () => {
    // This would update bot connection status in context
    // For now, keeping local state
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Section
        title="WHATSAPP BUSINESS INTEGRATION"
        subtitle="Twilio-powered WhatsApp automation and management"
        titleGradient
      >
        <div className="space-y-8">
          {/* Twilio Dashboard - Main WhatsApp Management */}
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <h3 className="font-heading text-heading-md text-dark-100 mb-4">
              📱 WhatsApp Business Dashboard
            </h3>
            <TwilioDashboard />
          </div>

          {/* System Integration Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
              <h3 className="font-heading text-heading-md text-dark-100 mb-4">
                🔗 System Integration
              </h3>
              <SystemHandover 
                isBotConnected={state.isBotConnected} 
                onConnect={handleConnectBot} 
              />
            </div>
            
            <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
              <h3 className="font-heading text-heading-md text-dark-100 mb-4">
                📊 System Status
              </h3>
              <SystemStatus
                isBotConnected={state.isBotConnected}
                isBriefingLoading={state.isBriefingLoading}
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default WhatsAppPage;
