import { api } from './api';
import type {
  Product,
  Order,
  Category,
  EcommerceDashboardStats,
  EcommerceSettings,
  Coupon,
} from '../types/ecommerce';

class EcommerceService {
  // Dashboard Stats
  async getDashboardStats(): Promise<EcommerceDashboardStats> {
    // This can be a combination of multiple API calls
    const [products, orders] = await Promise.all([api.getProducts(), api.getOrders()]);

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === 'active').length;
    const lowStockProducts = products.filter((p) => p.stock < p.lowStockThreshold).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    const revenue = orders.reduce(
      (acc, order) => {
        const orderDate = new Date(order.createdAt);
        if (order.paymentStatus === 'paid') {
          if (orderDate >= today) {
            acc.today += order.total;
          }
          if (orderDate >= thisWeekStart) {
            acc.thisWeek += order.total;
          }
          if (orderDate >= thisMonthStart) {
            acc.thisMonth += order.total;
          }
          if (orderDate >= thisYearStart) {
            acc.thisYear += order.total;
          }
        }
        return acc;
      },
      { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 },
    );

    const salesByProduct = orders
      .flatMap((o) => o.items)
      .reduce(
        (acc, item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = {
              productId: item.productId,
              name: item.name,
              sales: 0,
              revenue: 0,
            };
          }
          acc[item.productId].sales += item.quantity;
          acc[item.productId].revenue += item.total;
          return acc;
        },
        {} as Record<string, { productId: string; name: string; sales: number; revenue: number }>,
      );

    const topSellingProducts = Object.values(salesByProduct)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const recentOrders = orders.slice(0, 5);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      revenue,
      topSellingProducts,
      recentOrders,
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return api.getProducts();
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return api.createProduct(product);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return api.updateProduct(id, updates);
  }

  async deleteProduct(id: string): Promise<void> {
    return api.deleteProduct(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return api.getCategories();
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    return api.createCategory(category);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    return api.updateCategory(id, updates);
  }

  async deleteCategory(id: string): Promise<void> {
    return api.deleteCategory(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return api.getOrders();
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return api.createOrder(order);
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    return api.updateOrder(id, updates);
  }

  async deleteOrder(id: string): Promise<void> {
    return api.deleteOrder(id);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return api.updateOrder(id, { status });
  }

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return api.getCoupons();
  }

  // Settings
  async getSettings(): Promise<EcommerceSettings | null> {
    return api.getEcommerceSettings();
  }

  async updateSettings(settings: Partial<EcommerceSettings>): Promise<EcommerceSettings> {
    return api.updateEcommerceSettings(settings);
  }
}

export const ecommerceService = new EcommerceService();
