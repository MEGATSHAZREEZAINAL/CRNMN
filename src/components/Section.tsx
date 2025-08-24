import type { ReactNode } from 'react';
import React from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleGradient?: boolean;
  headerAction?: ReactNode;
}

export const Section = ({
  title,
  subtitle,
  children,
  className = '',
  titleGradient = false,
  headerAction,
}: SectionProps): React.ReactNode => (
  <section className={`mb-16 animate-slide-in-up ${className}`}>
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1">
        <h2
          className={`
          font-heading font-bold text-display-sm 
          ${titleGradient ? 'text-brand-gradient' : 'text-dark-50'}
          border-b-2 border-brand-electric pb-3 mb-2 inline-block
        `}
        >
          {title}
        </h2>
        {subtitle && <p className="text-body-lg text-dark-300 mt-2 font-mono">{subtitle}</p>}
      </div>
      {headerAction && <div className="flex-shrink-0 ml-6">{headerAction}</div>}
    </div>
    <div className="space-y-8">{children}</div>
  </section>
);
