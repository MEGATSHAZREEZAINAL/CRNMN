import React, { useState, useEffect } from 'react';
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
import {
  analyticsService,
  type RevenueAnalytics,
  type SalesAnalytics,
  type InventoryAnalytics,
  type CustomerAnalytics,
  type BusinessInsights,
} from '../../services/analytics';

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

interface RealTimeMetrics {
  todayRevenue: number;
  monthRevenue: number;
  todaySalesCount: number;
  lowStockAlerts: number;
  lastUpdated: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [sales, setSales] = useState<SalesAnalytics | null>(null);
  const [inventory, setInventory] = useState<InventoryAnalytics | null>(null);
  const [customers, setCustomers] = useState<CustomerAnalytics | null>(null);
  const [insights, setInsights] = useState<BusinessInsights | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  type TabId = 'overview' | 'sales' | 'inventory' | 'customers' | 'insights';
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadRealTimeMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [revenueData, salesData, inventoryData, customerData, insightsData] = await Promise.all(
        [
          analyticsService.getRevenueAnalytics(),
          analyticsService.getSalesAnalytics(),
          analyticsService.getInventoryAnalytics(),
          analyticsService.getCustomerAnalytics(),
          analyticsService.getBusinessInsights(),
        ],
      );

      setRevenue(revenueData);
      setSales(salesData);
      setInventory(inventoryData);
      setCustomers(customerData);
      setInsights(insightsData);
      setLastUpdated(new Date());
    } catch (error: unknown) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeMetrics = async () => {
    try {
      const metrics = await analyticsService.getRealTimeMetrics();
      setRealTimeMetrics(metrics);
    } catch (error: unknown) {
      console.error('Error loading real-time metrics:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Last updated: {lastUpdated.toLocaleString()}</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Real-time Metrics Bar */}
      {realTimeMetrics && (
        <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                <span className="text-sm">LIVE METRICS</span>
              </div>
              <div className="text-sm">
                Today: {formatCurrency(realTimeMetrics.todayRevenue)} (
                {realTimeMetrics.todaySalesCount} sales)
              </div>
              <div className="text-sm">
                This Month: {formatCurrency(realTimeMetrics.monthRevenue)}
              </div>
              {realTimeMetrics.lowStockAlerts > 0 && (
                <div className="flex items-center text-yellow-200">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{realTimeMetrics.lowStockAlerts} Stock Alerts</span>
                </div>
              )}
            </div>
            <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
      {activeTab === 'overview' && revenue && sales && inventory && customers && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(revenue.totalRevenue)}
              change={revenue.revenueGrowth}
              trend={
                revenue.revenueGrowth > 0 ? 'up' : revenue.revenueGrowth < 0 ? 'down' : 'stable'
              }
              icon={<DollarSign className="w-8 h-8" />}
            />
            <MetricCard
              title="Total Sales"
              value={formatNumber(sales.totalSales)}
              change={sales.salesGrowth}
              trend={sales.salesGrowth > 0 ? 'up' : sales.salesGrowth < 0 ? 'down' : 'stable'}
              icon={<ShoppingCart className="w-8 h-8" />}
            />
            <MetricCard
              title="Total Customers"
              value={formatNumber(customers.totalCustomers)}
              change={(customers.newCustomers / customers.totalCustomers) * 100}
              trend="up"
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="Inventory Value"
              value={formatCurrency(inventory.inventoryValue)}
              change={0}
              icon={<Package className="w-8 h-8" />}
              className={inventory.lowStockItems > 0 ? 'border-l-4 border-yellow-400' : ''}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <SimpleBarChart
                data={revenue.monthlyTrend.map((item) => ({
                  label: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
                  value: item.revenue,
                }))}
              />
            </div>

            {/* Revenue by Product */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
              <SimplePieChart
                data={revenue.revenueByProduct.slice(0, 5).map((item) => ({
                  label: item.product,
                  value: item.revenue,
                }))}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">{formatCurrency(revenue.dailyRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-medium">{sales.dailySales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Order Value</span>
                  <span className="font-medium">{formatCurrency(revenue.averageOrderValue)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{inventory.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Low Stock</span>
                  <span className="font-medium text-red-600">{inventory.lowStockItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Out of Stock</span>
                  <span className="font-medium text-red-600">{inventory.outOfStockItems}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Customers</span>
                  <span className="font-medium">{customers.activeCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">New This Month</span>
                  <span className="font-medium text-green-600">{customers.newCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Lifetime Value</span>
                  <span className="font-medium">
                    {formatCurrency(customers.customerLifetimeValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && sales && revenue && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Monthly Sales"
              value={formatNumber(sales.monthlySales)}
              change={sales.salesGrowth}
              trend={sales.salesGrowth > 0 ? 'up' : 'down'}
              icon={<ShoppingCart className="w-8 h-8" />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${sales.conversionRate}%`}
              icon={<Target className="w-8 h-8" />}
            />
            <MetricCard
              title="Average Order Value"
              value={formatCurrency(revenue.averageOrderValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Top Products by Sales</h3>
              <div className="space-y-3">
                {sales.topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{product.product}</span>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Performance (Last 30 Days)</h3>
              <SimpleBarChart
                data={sales.performanceTrend.slice(-10).map((item) => ({
                  label: new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }),
                  value: item.sales,
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && inventory && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Items"
              value={formatNumber(inventory.totalItems)}
              icon={<Package className="w-8 h-8" />}
            />
            <MetricCard
              title="Low Stock Items"
              value={inventory.lowStockItems}
              icon={<AlertTriangle className="w-8 h-8" />}
              className={inventory.lowStockItems > 0 ? 'border-l-4 border-yellow-400' : ''}
            />
            <MetricCard
              title="Out of Stock"
              value={inventory.outOfStockItems}
              icon={<AlertTriangle className="w-8 h-8" />}
              className={inventory.outOfStockItems > 0 ? 'border-l-4 border-red-400' : ''}
            />
            <MetricCard
              title="Inventory Value"
              value={formatCurrency(inventory.inventoryValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>

          {/* Stock Alerts */}
          {inventory.stockAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Stock Alerts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.stockAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alert.status === 'out'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <h4 className="font-medium">{alert.item}</h4>
                    <p className="text-sm text-gray-600">
                      Current: {alert.currentStock} | Reorder: {alert.reorderPoint}
                    </p>
                    <span
                      className={`text-xs font-semibold uppercase ${
                        alert.status === 'out' ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    >
                      {alert.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fast Moving Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Fast Moving Items</h3>
              <div className="space-y-3">
                {inventory.fastMovingItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{item.item}</span>
                      <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-600">
                        Velocity: {item.velocity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slow Moving Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Slow Moving Items</h3>
              <div className="space-y-3">
                {inventory.slowMovingItems.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{item.item}</span>
                      <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-red-600">
                        {item.daysInStock} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && customers && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Customers"
              value={formatNumber(customers.totalCustomers)}
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="New Customers"
              value={customers.newCustomers}
              change={25}
              trend="up"
              icon={<Users className="w-8 h-8" />}
            />
            <MetricCard
              title="Churn Rate"
              value={`${customers.churnRate}%`}
              trend={customers.churnRate > 15 ? 'down' : 'up'}
              icon={<TrendingDown className="w-8 h-8" />}
            />
            <MetricCard
              title="Lifetime Value"
              value={formatCurrency(customers.customerLifetimeValue)}
              icon={<DollarSign className="w-8 h-8" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
              <div className="space-y-3">
                {customers.topCustomers.slice(0, 5).map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{customer.customer}</span>
                      <p className="text-sm text-gray-600">{customer.orders} orders</p>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Segments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
              <SimplePieChart
                data={customers.customerSegments.map((segment) => ({
                  label: segment.segment,
                  value: segment.count,
                }))}
              />
            </div>
          </div>

          {/* Acquisition Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Acquisition Trend</h3>
            <SimpleBarChart
              data={customers.acquisitionTrend.slice(-6).map((item) => ({
                label: new Date(item.month).toLocaleDateString('en-US', {
                  month: 'short',
                  year: '2-digit',
                }),
                value: item.newCustomers,
                color: '#10B981',
              }))}
            />
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && insights && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.kpis.map((kpi, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{kpi.metric}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        kpi.status === 'on-track'
                          ? 'bg-green-100 text-green-800'
                          : kpi.status === 'above'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {kpi.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{kpi.current.toFixed(1)}</span>
                    <span className="text-gray-600">Target: {kpi.target}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        kpi.status === 'on-track'
                          ? 'bg-green-500'
                          : kpi.status === 'above'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Profit Margin"
              value={`${insights.profitMargin.toFixed(1)}%`}
              trend={
                insights.profitMargin > 20 ? 'up' : insights.profitMargin > 10 ? 'stable' : 'down'
              }
              icon={<TrendingUp className="w-8 h-8" />}
            />
            <MetricCard
              title="Net Profit"
              value={formatCurrency(insights.netProfit)}
              trend={insights.netProfit > 0 ? 'up' : 'down'}
              icon={<DollarSign className="w-8 h-8" />}
            />
            <MetricCard
              title="Cash Flow"
              value={formatCurrency(insights.cashFlow)}
              trend={insights.cashFlow > 0 ? 'up' : 'down'}
              icon={<Activity className="w-8 h-8" />}
            />
            <MetricCard
              title="Break Even"
              value={formatCurrency(insights.breakEvenPoint)}
              icon={<Target className="w-8 h-8" />}
            />
          </div>

          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h3>
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
            </div>
          )}

          {/* Seasonal Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Seasonal Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {insights.seasonalTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                  <h4 className="font-medium text-gray-900">{trend.period}</h4>
                  <div
                    className={`flex items-center justify-center mt-2 ${
                      trend.trend === 'up'
                        ? 'text-green-600'
                        : trend.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {trend.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    ) : (
                      <Activity className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {trend.impact > 0 ? '+' : ''}
                      {trend.impact}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 capitalize">{trend.trend} trend</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
