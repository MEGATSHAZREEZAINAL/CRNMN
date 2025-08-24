import React from 'react';
import { Card, CardContent } from './Card';
import { CheckCircleIcon, XCircleIcon, BrainIcon } from './Icons';

interface SystemStatusProps {
  isBotConnected: boolean;
  isBriefingLoading: boolean;
}

const StatusItem = ({
  name,
  isOk,
  statusText,
}: {
  name: string;
  isOk: boolean;
  statusText: string;
}) => (
  <li className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-b-0">
    <span className="text-gray-300">{name}</span>
    <div className="flex items-center gap-2">
      {isOk ? (
        <CheckCircleIcon className="w-5 h-5 text-green-400" />
      ) : (
        <XCircleIcon className="w-5 h-5 text-yellow-400" />
      )}
      <span className={`text-sm font-bold ${isOk ? 'text-green-400' : 'text-yellow-400'}`}>
        {statusText}
      </span>
    </div>
  </li>
);

export const SystemStatus = ({
  isBotConnected,
  isBriefingLoading,
}: SystemStatusProps): React.ReactNode => {
  return (
    <Card>
      <CardContent>
        <h3 className="font-teko text-3xl mb-4">SYSTEM STATUS</h3>
        <ul className="bg-black p-4 rounded-lg">
          <StatusItem
            name="AI Strategic Advisor"
            isOk={!isBriefingLoading}
            statusText={isBriefingLoading ? 'ANALYZING' : 'OPERATIONAL'}
          />
          <StatusItem name="Sales & Inventory Monitor" isOk={true} statusText="ONLINE" />
          <StatusItem name="Content Autopublisher" isOk={true} statusText="STANDBY" />
          <StatusItem
            name="WhatsApp Command Center"
            isOk={isBotConnected}
            statusText={isBotConnected ? 'CONNECTED' : 'DISCONNECTED'}
          />
        </ul>
      </CardContent>
    </Card>
  );
};
