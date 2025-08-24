import React from 'react';
import { ThemeToggle } from './UI';

export const Header = (): React.ReactNode => (
  <header className="relative text-center mb-16 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-hero-mesh opacity-30 pointer-events-none" />

    {/* Theme Toggle */}
    <div className="absolute top-0 right-0">
      <ThemeToggle />
    </div>

    {/* Main Header Content */}
    <div className="relative z-10 animate-slide-in-up">
      <h1 className="font-display text-display-lg md:text-display-xl text-brand-gradient drop-shadow-lg">
        CORNMAN
      </h1>
      <div className="mt-4 space-y-2">
        <p className="text-heading-md md:text-heading-lg font-heading uppercase tracking-widest">
          <span className="text-brand-electric animate-glow-pulse">
            THE COMPLETE SMALL BUSINESS OS
          </span>
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-px bg-gradient-to-r from-transparent via-brand-electric to-transparent w-20" />
          <p className="text-caption text-dark-400 uppercase tracking-widest font-mono">
            A BRAND BY THE FAMOUS MARKET
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-brand-electric to-transparent w-20" />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-center gap-6 mt-8 opacity-80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
          <span className="text-caption text-dark-300 font-mono">SYSTEMS ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-electric rounded-full animate-pulse" />
          <span className="text-caption text-dark-300 font-mono">AI ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
          <span className="text-caption text-dark-300 font-mono">REAL-TIME DATA</span>
        </div>
      </div>
    </div>
  </header>
);
