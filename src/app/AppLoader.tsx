import React from 'react';

export const AppLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-electric rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
          <span className="text-dark-900 font-display text-display-sm font-bold">C</span>
        </div>
        <h1 className="font-display text-heading-lg text-brand-electric mb-2">CORNMAN</h1>
        <p className="text-body-md text-dark-400 font-mono">Loading Strategic HQ...</p>
        <div className="mt-4">
          <div className="animate-spin w-6 h-6 border-2 border-brand-electric border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};
