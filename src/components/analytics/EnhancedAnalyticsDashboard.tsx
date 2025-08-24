import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useConfig } from '../../contexts/ConfigContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend = 'stable',
  className = '',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1 text-sm font-medium">
                {change > 0 ? '+' : ''}
                {change}%
              </span>
            </div>
          )}
        </div>
        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
};

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

const SimpleBarChart: React.FC<{ data: ChartData[]; height?: number }> = ({
  data,
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end space-x-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-blue-500 rounded-t min-h-[4px] transition-all duration-300 hover:bg-blue-600"
            style={{
              height: `${(item.value / maxValue) * (height - 40)}px`,
              backgroundColor: item.color || '#3B82F6',
            }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const SimplePieChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="flex items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const offset = data
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 100, 0);
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -offset;

            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>
      <div className="ml-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-gray-700">{item.label}</span>
            <span className="ml-auto font-medium">{((item.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendationCard: React.FC<{
  category: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
}> = ({ category, priority, suggestion, impact }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-800';
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Target className="w-4 h-4" />;
      case 'low':
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor()}`}>
      <div className="flex items-center mb-2">
        {getPriorityIcon()}
        <span className="ml-2 font-medium text-sm">{category}</span>
        <span className="ml-auto text-xs uppercase font-semibold">{priority}</span>
      </div>
      <p className="text-sm mb-2">{suggestion}</p>
      <p className="text-xs opacity-75">Impact: {impact}</p>
    </div>
  );
};

const EnhancedAnalyticsDashboard: React.FC = () => {
  const { 
    revenueData, 
    salesData, 
    inventoryData, 
    customerData, 
    insights,
    loading,
    error,
    refreshAll,
    refreshSection
  } = useAnalytics();
  
  const { getFormattedCurrency } = useConfig();
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'customers' | 'insights'>('overview');

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const formatCurrency = (amount: number) => {
    return getFormattedCurrency(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading && !revenueData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Analytics</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refreshAll()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Analytics Dashboard</h1>
          <p className="text-gray-600">Business intelligence with real-time insights</p>
        </div>
        <button
          onClick={() => refreshAll()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && revenueData && salesData && inventoryData && customerData && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(revenueData.totalRevenue)}
              change={revenueData.revenueGrowth}
              trend={
                revenueData.revenueGrowth > 0 ? 'up' : revenueData.revenueGrowth < 0 ? 'down' : 'stable'
              }
              icon={<DollarSign className="w-8 h-8" />}
            />
            <MetricCard
              title="Total Sales"
              value={formatNumber(salesData.totalSales)}
              change={salesData.salesGrowth}
              trend={salesData.salesGrowth > 0 ? 'up' : salesData.salesGrowth < 0 ? 'down' : 'stable'}
              icon={<ShoppingCart className="w-8 h-8" />}
            />
            <MetricCard
              title="Total Customers"
              value={formatNumber(customerData.totalCustomers)}
              change={(customerData.newCustomers / customerData.totalCustomers) * 100}
              trend="up"
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="Inventory Value"
              value={formatCurrency(inventoryData.inventoryValue)}
              change={0}
              icon={<Package className="w-8 h-8" />}
              className={inventoryData.lowStockItems > 0 ? 'border-l-4 border-yellow-400' : ''}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <SimpleBarChart
                data={revenueData.monthlyTrend.map((item) => ({
                  label: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
                  value: item.revenue,
                }))}
              />
            </div>

            {/* Revenue by Product */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
              <SimplePieChart
                data={revenueData.revenueByProduct.slice(0, 5).map((item) => ({
                  label: item.product,
                  value: item.revenue,
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Monthly Sales"
              value={formatNumber(salesData.monthlySales)}
              change={salesData.salesGrowth}
              trend={salesData.salesGrowth > 0 ? 'up' : 'down'}
              icon={<ShoppingCart className="w-8 h-8" />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${salesData.conversionRate}%`}
              icon={<Target className="w-8 h-8" />}
            />
            <MetricCard
              title="Average Order Value"
              value={formatCurrency(salesData.averageOrderValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && inventoryData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Items"
              value={formatNumber(inventoryData.totalItems)}
              icon={<Package className="w-8 h-8" />}
            />
            <MetricCard
              title="Low Stock Items"
              value={inventoryData.lowStockItems}
              icon={<AlertTriangle className="w-8 h-8" />}
              className={inventoryData.lowStockItems > 0 ? 'border-l-4 border-yellow-400' : ''}
            />
            <MetricCard
              title="Out of Stock"
              value={inventoryData.outOfStockItems}
              icon={<AlertTriangle className="w-8 h-8" />}
              className={inventoryData.outOfStockItems > 0 ? 'border-l-4 border-red-400' : ''}
            />
            <MetricCard
              title="Inventory Value"
              value={formatCurrency(inventoryData.inventoryValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Customers"
              value={formatNumber(customerData.totalCustomers)}
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="New Customers"
              value={customerData.newCustomers}
              change={25}
              trend="up"
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="Churn Rate"
              value={`${customerData.churnRate}%`}
              trend={customerData.churnRate > 15 ? 'down' : 'up'}
              icon={<TrendingDown className="w-8 h-8" />}
            />
            <MetricCard
              title="Lifetime Value"
              value={formatCurrency(customerData.customerLifetimeValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && insights && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Business Insights</h3>
            <div className="prose max-w-none">
              {insights.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.recommendations.map((rec, index) => (
                    <RecommendationCard
                      key={index}
                      category={rec.category}
                      priority={rec.priority}
                      suggestion={rec.suggestion}
                      impact={rec.impact}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No recommendations available at this time.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalyticsDashboard;