import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../primitives/Card';

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  subtitle?: string;
  priority: 'high' | 'medium' | 'low';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, subtitle, priority }) => (
  <Card className={`p-4 ${priority === 'high' ? 'border-brand-electric/30 bg-brand-electric/5' : ''}`}>
    <h3 className="font-heading text-heading-sm text-dark-200 mb-2">{title}</h3>
    <div className="text-2xl font-bold text-dark-100 mb-1">{value}</div>
    {subtitle && <p className="text-sm text-dark-400 mb-2">{subtitle}</p>}
    {trend && (
      <span className={`text-sm font-medium ${
        trend.startsWith('+') ? 'text-status-success' : 'text-status-error'
      }`}>
        {trend}
      </span>
    )}
  </Card>
);

interface AIInsightCardProps {
  insight: string;
  isLoading: boolean;
  priority: 'high' | 'medium' | 'low';
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, isLoading, priority }) => (
  <Card className={`p-4 ${priority === 'high' ? 'border-brand-electric/30 bg-brand-electric/5' : ''}`}>
    <h3 className="font-heading text-heading-sm text-dark-200 mb-2">AI Strategic Insight</h3>
    {isLoading ? (
      <div className="animate-pulse">
        <div className="h-4 bg-dark-600 rounded mb-2"></div>
        <div className="h-4 bg-dark-600 rounded w-3/4"></div>
      </div>
    ) : (
      <p className="text-dark-100 text-sm leading-relaxed">{insight}</p>
    )}
  </Card>
);

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-dark-600 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex justify-between items-center hover:bg-dark-800 transition-colors"
      >
        <h3 className="font-heading text-heading-md text-dark-100">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-dark-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-dark-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="border-t border-dark-600 p-4">
          {children}
        </div>
      )}
    </div>
  );
};

interface QuickActionsRowProps {
  onRestock: (itemId?: string) => void;
  onAddCustomer: (name?: string, phone?: string) => void;
  onSchedulePost: (platform?: string, content?: string, icon?: React.ReactNode) => void;
}

const QuickActionsRow: React.FC<QuickActionsRowProps> = ({ 
  onRestock, 
  onAddCustomer, 
  onSchedulePost 
}) => (
  <div className="grid grid-cols-3 gap-4">
    <button
      onClick={() => onRestock()}
      className="p-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg transition-colors text-center"
    >
      <div className="text-brand-electric text-lg mb-1">📦</div>
      <span className="text-xs text-dark-200">Restock</span>
    </button>
    
    <button
      onClick={() => onAddCustomer()}
      className="p-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg transition-colors text-center"
    >
      <div className="text-brand-electric text-lg mb-1">👤</div>
      <span className="text-xs text-dark-200">Add Customer</span>
    </button>
    
    <button
      onClick={() => onSchedulePost()}
      className="p-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg transition-colors text-center"
    >
      <div className="text-brand-electric text-lg mb-1">📱</div>
      <span className="text-xs text-dark-200">Schedule Post</span>
    </button>
  </div>
);

interface SmartDashboardProps {
  totalRevenue: number;
  monthlyGoal: number;
  aiInsight: string;
  isBriefingLoading: boolean;
  onRestock: (itemId?: string) => void;
  onAddCustomer: (name?: string, phone?: string) => void;
  onSchedulePost: (platform?: string, content?: string, icon?: React.ReactNode) => void;
}

export const SmartDashboard: React.FC<SmartDashboardProps> = ({
  totalRevenue,
  monthlyGoal,
  aiInsight,
  isBriefingLoading,
  onRestock,
  onAddCustomer,
  onSchedulePost,
}) => {
  const monthlyProgress = Math.round((totalRevenue / monthlyGoal) * 100);
  const currentRevenue = totalRevenue.toFixed(2);
  
  return (
    <div className="space-y-6">
      {/* Hero KPIs - Only 3 most important metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Today's Revenue"
          value={`RM${totalRevenue.toFixed(2)}`}
          trend="+12%"
          priority="high"
        />
        <KPICard
          title="Monthly Progress"
          value={`${monthlyProgress}%`}
          subtitle={`RM${currentRevenue} / RM${monthlyGoal}`}
          priority="high"
        />
        <AIInsightCard
          insight={aiInsight}
          isLoading={isBriefingLoading}
          priority="high"
        />
      </div>
      
      {/* Quick Actions - Maximum 3 */}
      <QuickActionsRow
        onRestock={onRestock}
        onAddCustomer={onAddCustomer}
        onSchedulePost={onSchedulePost}
      />
      
      {/* Expandable Secondary Information */}
      <CollapsibleSection title="Detailed Analytics" defaultOpen={false}>
        <div className="text-dark-300">
          <p>Detailed analytics and reports will be displayed here.</p>
          <p>This section is collapsible to reduce cognitive overload.</p>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Recent Activity" defaultOpen={false}>
        <div className="text-dark-300">
          <p>Recent sales, inventory changes, and system updates.</p>
        </div>
      </CollapsibleSection>
    </div>
  );
};
