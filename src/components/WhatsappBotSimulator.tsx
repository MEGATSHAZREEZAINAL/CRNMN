import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { AiButton } from './UI';
import { usePhoneShell } from '../contexts/PhoneShellContext';
import { WhatsappScreen } from './WhatsappScreen';
import type { Sale, InventoryItem } from '../types';

// The props are now for the launcher to know what to pass to the screen component
interface WhatsappBotSimulatorProps {
  sales: Sale[];
  inventory: InventoryItem[];
  totalRevenue: number;
  onAutoRestock: (itemName: string) => string;
  isBotConnected: boolean;
}

export const WhatsappBotSimulator = (props: WhatsappBotSimulatorProps): React.ReactNode => {
  const { openPhoneShell } = usePhoneShell();

  const handleLaunch = () => {
    openPhoneShell('WhatsApp', <WhatsappScreen {...props} />);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow">
        <CardTitle>🤖 WHATSAPP COMMAND CENTER</CardTitle>
        <CardDescription>Launch the bot simulator in a floating phone window.</CardDescription>
      </CardContent>
      <div className="p-4 bg-black mt-4 rounded-lg flex flex-col justify-center items-center text-center flex-grow">
        <p className="text-gray-400 mb-4">
          Click to open the WhatsApp bot in a movable phone interface.
        </p>
        <AiButton onClick={handleLaunch}>LAUNCH SIMULATOR</AiButton>
      </div>
    </Card>
  );
};
