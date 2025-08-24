import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { BrainIcon } from './Icons';

interface AiStrategicBriefingProps {
  insight: string;
  isLoading: boolean;
}

export const AiStrategicBriefing = ({
  insight,
  isLoading,
}: AiStrategicBriefingProps): React.ReactNode => {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#39FF14]">
      <CardContent>
        <CardTitle>
          <div className="flex items-center gap-2 text-[#39FF14]">
            <BrainIcon />
            <span>AI STRATEGIC BRIEFING</span>
          </div>
        </CardTitle>
        <CardDescription>Your AI advisor's real-time analysis and recommendations.</CardDescription>
        <div className="bg-black rounded-md mt-4 p-4 min-h-[150px] flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <p className="animate-pulse text-gray-400">Menganalisis data terkini...</p>
            </div>
          ) : (
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{insight}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
