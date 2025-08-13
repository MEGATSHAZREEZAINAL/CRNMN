import { api } from './api';
import { offlineStorage } from './offlineStorage';
import { generateBusinessInsights } from './geminiService';
import type { Order, Product, Customer } from '../types';

// Analytics Types
export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  revenueByProduct: Array<{
    product: string;
    revenue: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export interface SalesAnalytics {
  totalSales: number;
  monthlySales: number;
  dailySales: number;
  salesGrowth: number;
  conversionRate: number;
  topProducts: Array<{
    product: string;
    sales: number;
    revenue: number;
  }>;
  salesByCustomer: Array<{
    customer: string;
    sales: number;
    totalValue: number;
  }>;
  performanceTrend: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

export interface InventoryAnalytics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
  turnoverRate: number;
  fastMovingItems: Array<{
    item: string;
    velocity: number;
    stock: number;
  }>;
  slowMovingItems: Array<{
    item: string;
    daysInStock: number;
    stock: number;
  }>;
  stockAlerts: Array<{
    item: string;
    currentStock: number;
    reorderPoint: number;
    status: 'low' | 'out';
  }>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  churnRate: number;
  customerLifetimeValue: number;
  topCustomers: Array<{
    customer: string;
    totalSpent: number;
    orders: number;
    lastOrder: string;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    averageValue: number;
  }>;
  acquisitionTrend: Array<{
    month: string;
    newCustomers: number;
    churnedCustomers: number;
  }>;
}

export interface BusinessInsights {
  profitMargin: number;
  operatingExpenses: number;
  netProfit: number;
  cashFlow: number;
  breakEvenPoint: number;
  seasonalTrends: Array<{
    period: string;
    trend: 'up' | 'down' | 'stable';
    impact: number;
  }>;
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    impact: string;
  }>;
  kpis: Array<{
    metric: string;
    current: number;
    target: number;
    status: 'above' | 'below' | 'on-track';
  }>;
}

class AnalyticsService {
  private cache = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  // Revenue Analytics
  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    const cacheKey = 'revenue_analytics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const sales = await api.getSales();
      const analytics = this.calculateRevenueAnalytics(sales || []);
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      // Fallback to offline data
      const offlineSales = await offlineStorage.getSales();
      return this.calculateRevenueAnalytics(offlineSales);
    }
  }

  // Sales Analytics
  async getSalesAnalytics(): Promise<SalesAnalytics> {
    const cacheKey = 'sales_analytics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const sales = await api.getSales();
      const analytics = this.calculateSalesAnalytics(sales || []);
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      const offlineSales = await offlineStorage.getSales();
      return this.calculateSalesAnalytics(offlineSales);
    }
  }

  // Inventory Analytics
  async getInventoryAnalytics(): Promise<InventoryAnalytics> {
    const cacheKey = 'inventory_analytics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const inventory = await api.getInventory();
      const analytics = this.calculateInventoryAnalytics(inventory || []);
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
      const offlineInventory = await offlineStorage.getInventory();
      return this.calculateInventoryAnalytics(offlineInventory);
    }
  }

  // Customer Analytics
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    const cacheKey = 'customer_analytics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const [customers, sales] = await Promise.all([
        api.getCustomers(),
        api.getSales(),
      ]);

      const analytics = this.calculateCustomerAnalytics(
        customers || [],
        sales || [],
      );
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      const [offlineCustomers, offlineSales] = await Promise.all([
        offlineStorage.getCustomers(),
        offlineStorage.getSales(),
      ]);
      return this.calculateCustomerAnalytics(offlineCustomers, offlineSales);
    }
  }

  // Business Insights with AI-powered recommendations
  async getBusinessInsights(): Promise<BusinessInsights> {
    const cacheKey = 'business_insights';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const [revenue, sales, inventory, customers] = await Promise.all([
        this.getRevenueAnalytics(),
        this.getSalesAnalytics(),
        this.getInventoryAnalytics(),
        this.getCustomerAnalytics(),
      ]);

      const insights = await generateBusinessInsights(revenue, sales, inventory, customers);
      this.setCache(cacheKey, insights);
      return insights;
    } catch (error) {
      console.error('Error generating business insights:', error);
      return this.getDefaultInsights();
    }
  }

  // Real-time metrics for dashboard
  async getRealTimeMetrics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const allSales = await api.getSales();
      const todaySales = allSales.filter(sale => new Date(sale.createdAt) >= today);
      const monthSales = allSales.filter(sale => new Date(sale.createdAt) >= thisMonth);

      const inventory = await api.getInventory();

      return {
        todayRevenue: todaySales?.reduce((sum, sale) => sum + sale.amount, 0) || 0,
        monthRevenue: monthSales?.reduce((sum, sale) => sum + sale.amount, 0) || 0,
        todaySalesCount: todaySales?.length || 0,
        lowStockAlerts: inventory?.filter((item) => item.stock <= item.threshold).length || 0,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      return {
        todayRevenue: 0,
        monthRevenue: 0,
        todaySalesCount: 0,
        lowStockAlerts: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // Private calculation methods
  private calculateRevenueAnalytics(sales: Order[]): RevenueAnalytics {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const monthlyRevenue = sales
      .filter((sale) => new Date(sale.created_at) >= startOfMonth)
      .reduce((sum, sale) => sum + sale.amount, 0);
    const dailyRevenue = sales
      .filter((sale) => new Date(sale.created_at) >= startOfDay)
      .reduce((sum, sale) => sum + sale.amount, 0);

    // Product revenue analysis
    const productRevenue = sales.reduce((acc, sale) => {
      const product = sale.product || 'Unknown';
      acc[product] = (acc[product] || 0) + sale.amount;
      return acc;
    }, {});

    const revenueByProduct = Object.entries(productRevenue)
      .map(([product, revenue]) => ({
        product,
        revenue: revenue as number, // Type assertion needed because Object.entries returns [string, unknown]
        percentage: ((revenue as number) / totalRevenue) * 100,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Monthly trend
    const monthlyTrend = this.calculateMonthlyTrend(sales);

    return {
      totalRevenue,
      monthlyRevenue,
      dailyRevenue,
      revenueGrowth: this.calculateGrowthRate(sales, 'revenue'),
      averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
      revenueByProduct,
      monthlyTrend,
    };
  }

  private calculateSalesAnalytics(sales: Order[]): SalesAnalytics {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalSales = sales.length;
    const monthlySales = sales.filter((sale) => new Date(sale.created_at) >= startOfMonth).length;
    const dailySales = sales.filter((sale) => new Date(sale.created_at) >= startOfDay).length;

    // Top products by sales count
    const productSales = sales.reduce((acc, sale) => {
      const product = sale.product || 'Unknown';
      if (!acc[product]) {
        acc[product] = { count: 0, revenue: 0 };
      }
      acc[product].count += 1;
      acc[product].revenue += sale.amount;
      return acc;
    }, {});

    const topProducts = Object.entries(productSales)
      .map(([product, data]: [string, { count: number; revenue: number }]) => ({
        product,
        sales: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.sales - a.sales);

    return {
      totalSales,
      monthlySales,
      dailySales,
      salesGrowth: this.calculateGrowthRate(sales, 'count'),
      conversionRate: 85, // This would come from actual visitor/conversion data
      topProducts,
      salesByCustomer: this.calculateSalesByCustomer(sales),
      performanceTrend: this.calculatePerformanceTrend(sales),
    };
  }

  private calculateInventoryAnalytics(inventory: Product[]): InventoryAnalytics {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter((item) => item.stock <= item.threshold).length;
    const outOfStockItems = inventory.filter((item) => item.stock === 0).length;
    const inventoryValue = inventory.reduce(
      (sum, item) => sum + item.stock * (item.cost_price || 0),
      0,
    );

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
      turnoverRate: 4.2, // This would be calculated from sales velocity
      fastMovingItems: inventory
        .sort((a, b) => (b.sales_velocity || 0) - (a.sales_velocity || 0))
        .slice(0, 5)
        .map((item) => ({
          item: item.name,
          velocity: item.sales_velocity || 0,
          stock: item.stock,
        })),
      slowMovingItems: inventory
        .filter((item) => (item.sales_velocity || 0) < 1)
        .map((item) => ({
          item: item.name,
          daysInStock: Math.floor(
            (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24),
          ),
          stock: item.stock,
        })),
      stockAlerts: inventory
        .filter((item) => item.stock <= item.threshold)
        .map((item) => ({
          item: item.name,
          currentStock: item.stock,
          reorderPoint: item.threshold,
          status: item.stock === 0 ? ('out' as const) : ('low' as const),
        })),
    };
  }

  private calculateCustomerAnalytics(customers: Customer[], sales: Order[]): CustomerAnalytics {
    const totalCustomers = customers.length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newCustomers = customers.filter(
      (customer) => new Date(customer.created_at) >= thirtyDaysAgo,
    ).length;

    // Customer spending analysis
    const customerSpending = sales.reduce((acc, sale) => {
      const customerId = sale.customer_id;
      if (!acc[customerId]) {
        acc[customerId] = {
          totalSpent: 0,
          orders: 0,
          lastOrder: sale.created_at,
        };
      }
      acc[customerId].totalSpent += sale.amount;
      acc[customerId].orders += 1;
      if (new Date(sale.created_at) > new Date(acc[customerId].lastOrder)) {
        acc[customerId].lastOrder = sale.created_at;
      }
      return acc;
    }, {});

    const topCustomers = Object.entries(customerSpending)
      .map(([customerId, data]: [string, { totalSpent: number; orders: number; lastOrder: string }]) => {
        const customer = customers.find((c) => c.id === customerId);
        return {
          customer: customer?.name || 'Unknown',
          totalSpent: data.totalSpent,
          orders: data.orders,
          lastOrder: data.lastOrder,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      totalCustomers,
      newCustomers,
      activeCustomers: Object.keys(customerSpending).length,
      churnRate: 12.5, // This would be calculated from actual churn data
      customerLifetimeValue:
        topCustomers.length > 0
          ? topCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) /
            topCustomers.length
          : 0,
      topCustomers,
      customerSegments: [
        {
          segment: 'VIP',
          count: topCustomers.filter((c) => c.totalSpent > 5000).length,
          averageValue: 7500,
        },
        {
          segment: 'Regular',
          count: topCustomers.filter((c) => c.totalSpent > 1000 && c.totalSpent <= 5000).length,
          averageValue: 2500,
        },
        { segment: 'New', count: newCustomers, averageValue: 500 },
      ],
      acquisitionTrend: this.calculateAcquisitionTrend(customers),
    };
  }

  private calculateBusinessInsights(
    revenue: RevenueAnalytics,
    sales: SalesAnalytics,
    inventory: InventoryAnalytics,
    customers: CustomerAnalytics,
  ): BusinessInsights {
    const operatingExpenses = revenue.totalRevenue * 0.3; // Estimated 30% expenses
    const netProfit = revenue.totalRevenue - operatingExpenses;
    const profitMargin = (netProfit / revenue.totalRevenue) * 100;

    const recommendations = [];

    // Inventory recommendations
    if (inventory.lowStockItems > 0) {
      recommendations.push({
        category: 'Inventory',
        priority: 'high' as const,
        suggestion: `${inventory.lowStockItems} items are running low. Restock immediately to avoid stockouts.`,
        impact: 'Prevent lost sales and customer dissatisfaction',
      });
    }

    // Sales recommendations
    if (revenue.revenueGrowth < 0) {
      recommendations.push({
        category: 'Sales',
        priority: 'high' as const,
        suggestion:
          'Revenue is declining. Focus on customer retention and new acquisition strategies.',
        impact: 'Reverse negative trend and boost revenue',
      });
    }

    // Customer recommendations
    if (customers.churnRate > 15) {
      recommendations.push({
        category: 'Customer',
        priority: 'medium' as const,
        suggestion:
          'Churn rate is high. Implement customer loyalty programs and improve service quality.',
        impact: 'Improve customer retention by 25%',
      });
    }

    return {
      profitMargin,
      operatingExpenses,
      netProfit,
      cashFlow: revenue.monthlyRevenue - operatingExpenses / 12,
      breakEvenPoint: operatingExpenses / 12,
      seasonalTrends: [
        { period: 'Q1', trend: 'stable', impact: 0 },
        { period: 'Q2', trend: 'up', impact: 15 },
        { period: 'Q3', trend: 'down', impact: -10 },
        { period: 'Q4', trend: 'up', impact: 25 },
      ],
      recommendations,
      kpis: [
        {
          metric: 'Revenue Growth',
          current: revenue.revenueGrowth,
          target: 20,
          status:
            revenue.revenueGrowth >= 20
              ? 'on-track'
              : revenue.revenueGrowth >= 15
                ? 'above'
                : 'below',
        },
        {
          metric: 'Customer Acquisition',
          current: customers.newCustomers,
          target: 50,
          status:
            customers.newCustomers >= 50
              ? 'on-track'
              : customers.newCustomers >= 40
                ? 'above'
                : 'below',
        },
        {
          metric: 'Inventory Turnover',
          current: inventory.turnoverRate,
          target: 6,
          status:
            inventory.turnoverRate >= 6
              ? 'on-track'
              : inventory.turnoverRate >= 4
                ? 'above'
                : 'below',
        },
      ],
    };
  }

  // Helper methods
  private calculateGrowthRate(data: Order[], type: 'revenue' | 'count'): number {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const recent = data.filter((item) => new Date(item.created_at) >= thirtyDaysAgo);
    const previous = data.filter(
      (item) =>
        new Date(item.created_at) >= sixtyDaysAgo && new Date(item.created_at) < thirtyDaysAgo,
    );

    const recentValue =
      type === 'revenue' ? recent.reduce((sum, item) => sum + item.amount, 0) : recent.length;

    const previousValue =
      type === 'revenue' ? previous.reduce((sum, item) => sum + item.amount, 0) : previous.length;

    if (previousValue === 0) return recentValue > 0 ? 100 : 0;
    return ((recentValue - previousValue) / previousValue) * 100;
  }

  private calculateMonthlyTrend(sales: Order[]) {
    const monthlyData = {};
    sales.forEach((sale) => {
      const month = new Date(sale.created_at).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      monthlyData[month].revenue += sale.amount;
      monthlyData[month].orders += 1;
    });

    return Object.entries(monthlyData)
      .map(([month, data]: [string, { revenue: number; orders: number }]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  private calculateSalesByCustomer(sales: Order[]) {
    const customerSales = sales.reduce((acc, sale) => {
      const customerId = sale.customer_id;
      if (!acc[customerId]) {
        acc[customerId] = { sales: 0, totalValue: 0 };
      }
      acc[customerId].sales += 1;
      acc[customerId].totalValue += sale.amount;
      return acc;
    }, {});

    return Object.entries(customerSales)
      .map(([customerId, data]: [string, { sales: number; totalValue: number }]) => ({
        customer: `Customer ${customerId}`,
        sales: data.sales,
        totalValue: data.totalValue,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);
  }

  private calculatePerformanceTrend(sales: Order[]) {
    const dailyData = {};
    sales.forEach((sale) => {
      const date = new Date(sale.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { sales: 0, revenue: 0 };
      }
      dailyData[date].sales += 1;
      dailyData[date].revenue += sale.amount;
    });

    return Object.entries(dailyData)
      .map(([date, data]: [string, { sales: number; revenue: number }]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }

  private calculateAcquisitionTrend(customers: Customer[]) {
    const monthlyData = {};
    customers.forEach((customer) => {
      const month = new Date(customer.created_at).toISOString().substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, newCustomers]: [string, number]) => ({
        month,
        newCustomers,
        churnedCustomers: Math.floor(newCustomers * 0.1), // Estimated churn
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }

  private getDefaultInsights(): BusinessInsights {
    return {
      profitMargin: 0,
      operatingExpenses: 0,
      netProfit: 0,
      cashFlow: 0,
      breakEvenPoint: 0,
      seasonalTrends: [],
      recommendations: [],
      kpis: [],
    };
  }

  // Cache management
  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) { // data can be any of the analytics types
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Clear cache when needed
  clearCache() {
    this.cache.clear();
  }
}

export const analyticsService = new AnalyticsService();
