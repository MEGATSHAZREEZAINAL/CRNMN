import React from 'react';
import {
  CheckCircle,
  Clock,
  Zap,
  Users,
  ShoppingCart,
  BarChart3,
  UserCheck,
  Smartphone,
  Bot,
  Truck,
  Globe,
  Shield,
} from 'lucide-react';

const phases = [
  {
    id: 1,
    title: 'Basic Sales Tracking',
    description: 'Core sales recording and basic metrics',
    status: 'completed',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Sales Entry', 'Daily Totals', 'Basic Reporting', 'Data Persistence'],
  },
  {
    id: 2,
    title: 'Inventory Management',
    description: 'Stock tracking and low-stock alerts',
    status: 'completed',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Stock Management', 'Low Stock Alerts', 'Inventory Reports', 'Product Categories'],
  },
  {
    id: 3,
    title: 'Customer Relationship Management',
    description: 'Customer tracking and engagement',
    status: 'completed',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Customer Database', 'Purchase History', 'Customer Insights', 'Segmentation'],
  },
  {
    id: 4,
    title: 'Financial Management',
    description: 'Comprehensive financial tracking',
    status: 'completed',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Invoice Management', 'Expense Tracking', 'Financial Reports', 'Cash Flow'],
  },
  {
    id: 5,
    title: 'Project Management & Social Media',
    description: 'Task management and social media scheduling',
    status: 'completed',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Project Tracking', 'Task Management', 'Social Media Scheduler', 'Content Calendar'],
  },
  {
    id: 6,
    title: 'Advanced Analytics & Reporting',
    description: 'Business intelligence and performance metrics',
    status: 'completed',
    icon: BarChart3,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: [
      'Revenue Analytics',
      'Sales Performance',
      'Customer Insights',
      'Business Intelligence',
    ],
  },
  {
    id: 7,
    title: 'Team Management & Collaboration',
    description: 'Team coordination and performance tracking',
    status: 'completed',
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Team Members', 'Task Assignment', 'Performance Analytics', 'Team Chat'],
  },
  {
    id: 8,
    title: 'E-Commerce Integration',
    description: 'Online store management and operations',
    status: 'completed',
    icon: ShoppingCart,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Product Catalog', 'Order Management', 'Payment Integration', 'Shipping Management'],
  },
  {
    id: 9,
    title: 'Mobile App Integration',
    description: 'Mobile application management and analytics',
    status: 'completed',
    icon: Smartphone,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['App Analytics', 'Push Notifications', 'Mobile Orders', 'User Management'],
  },
  {
    id: 10,
    title: 'Automation & Workflows',
    description: 'Process automation and workflow management',
    status: 'completed',
    icon: Bot,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Workflow Builder', 'Automation Rules', 'Scheduled Tasks', 'Trigger Management'],
  },
  {
    id: 11,
    title: 'Supply Chain Management',
    description: 'Supplier and procurement management',
    status: 'completed',
    icon: Truck,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: ['Supplier Management', 'Purchase Orders', 'Warehouse Management', 'Quality Control'],
  },
  {
    id: 12,
    title: 'Enterprise Integrations',
    description: 'Third-party system integrations',
    status: 'completed',
    icon: Zap,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: [
      'API Management',
      'Data Synchronization',
      'Webhook Management',
      'Integration Marketplace',
    ],
  },
  {
    id: 13,
    title: 'Global Scaling & Compliance',
    description: 'International expansion and regulatory compliance',
    status: 'completed',
    icon: Globe,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    features: [
      'Multi-Region Support',
      'Data Privacy Compliance',
      'Tax Management',
      'Security Standards',
    ],
  },
];

export const CompleteDashboard: React.FC = () => {
  const completedPhases = phases.filter((p) => p.status === 'completed').length;
  const totalPhases = phases.length;
  const completionPercentage = Math.round((completedPhases / totalPhases) * 100);

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-electric to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-dark-900">C</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">CORNMAN Strategic HQ</h1>
              <p className="text-dark-300 font-mono">Complete Business Management Platform</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-electric mb-2">{completedPhases}</div>
                <div className="text-dark-300">Phases Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{totalPhases}</div>
                <div className="text-dark-300">Total Phases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {completionPercentage}%
                </div>
                <div className="text-dark-300">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
                <div className="text-dark-300">Features</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-dark-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brand-electric to-green-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-brand-electric/50 transition-colors"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${phase.bgColor}`}>
                    <phase.icon className={`w-6 h-6 ${phase.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-dark-400">Phase {phase.id}</div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        phase.status === 'completed'
                          ? 'text-green-400 bg-green-400/20'
                          : phase.status === 'in-progress'
                            ? 'text-yellow-400 bg-yellow-400/20'
                            : 'text-dark-400 bg-dark-600'
                      }`}
                    >
                      {phase.status === 'completed'
                        ? 'COMPLETE'
                        : phase.status === 'in-progress'
                          ? 'IN PROGRESS'
                          : 'PLANNED'}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{phase.title}</h3>
                <p className="text-dark-300 text-sm mb-4">{phase.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {phase.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-dark-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-dark-700/50 border-t border-dark-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">Status:</span>
                  <span className={`text-sm font-medium ${phase.color}`}>
                    {phase.status === 'completed'
                      ? '✓ Implemented'
                      : phase.status === 'in-progress'
                        ? '⚡ Building'
                        : '📋 Planned'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Message */}
        <div className="mt-12 text-center bg-gradient-to-r from-green-500/20 to-brand-electric/20 rounded-xl p-8 border border-green-500/30">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Mission Accomplished!</h2>
          </div>
          <p className="text-dark-200 text-lg mb-6">
            All 13 phases of CORNMAN Strategic HQ have been successfully implemented. Your
            comprehensive business management platform is now ready for enterprise deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-dark-800/50 rounded-lg p-4">
              <div className="text-brand-electric font-semibold mb-2">🚀 Ready for Production</div>
              <div className="text-dark-300">
                Full-featured business platform with enterprise capabilities
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">🔒 Security & Compliance</div>
              <div className="text-dark-300">GDPR, SOC2, and enterprise security standards</div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">🌍 Global Scale</div>
              <div className="text-dark-300">Multi-region support with local compliance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
