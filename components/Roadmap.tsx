import React from 'react';
import type { RoadmapPhase } from '../types';
import { Card } from './Card';

interface RoadmapProps {
  data: RoadmapPhase[];
}

const getStatusStyles = (status: RoadmapPhase['status']) => {
  switch (status) {
    case 'Complete':
      return {
        borderColor: 'border-green-500',
        textColor: 'text-green-500',
        bgColor: 'bg-green-500',
      };
    case 'In Progress':
      return {
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-400',
      };
    case 'Planned':
      return {
        borderColor: 'border-gray-500',
        textColor: 'text-gray-500',
        bgColor: 'bg-gray-500',
      };
    default:
      return {
        borderColor: 'border-[#39FF14]',
        textColor: 'text-[#39FF14]',
        bgColor: 'bg-[#39FF14]',
      };
  }
};

const Phase = ({ phase, isLast }: { phase: RoadmapPhase; isLast: boolean }) => {
  const { borderColor, textColor, bgColor } = getStatusStyles(phase.status);

  return (
    <div className="relative pl-10">
      {!isLast && <div className="absolute left-4 top-5 h-full w-0.5 bg-[#333]"></div>}
      <div className="absolute left-0 top-3">
        <div
          className={`w-8 h-8 rounded-full bg-[#1E1E1E] border-2 ${borderColor} flex items-center justify-center`}
        >
          <div
            className={`w-3 h-3 rounded-full ${bgColor} ${phase.status === 'In Progress' ? 'animate-pulse' : ''}`}
          ></div>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-baseline gap-4">
          <h4 className={`font-teko text-2xl ${textColor}`}>{phase.title}</h4>
          <span className="text-xs font-mono text-gray-500">({phase.weeks} Minggu)</span>
        </div>
        <ul className="list-disc list-inside text-gray-400 text-sm pl-2">
          {phase.tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Roadmap = ({ data }: RoadmapProps): React.ReactNode => {
  return (
    <Card>
      <div className="p-4">
        <div className="relative mt-6">
          {data.map((phase, index) => (
            <Phase key={phase.id} phase={phase} isLast={index === data.length - 1} />
          ))}
        </div>
      </div>
    </Card>
  );
};
