import type { Sale, InventoryItem, Customer, Invoice, Project, ScheduledPost } from '../types';
import type { Product, Order, Category, Coupon, EcommerceSettings } from '../types/ecommerce';

interface OfflineData {
  sales: Sale[];
  inventory: InventoryItem[];
  customers: Customer[];
  invoices: Invoice[];
  projects: Project[];
  scheduledPosts: ScheduledPost[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  coupons: Coupon[];
  ecommerceSettings: EcommerceSettings;
  aiInsights: { prompt: string; response: string; timestamp: number }[];
  lastSync: number;
}

class OfflineStorageService {
  private dbName = 'cornman-hq-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('sales')) {
          db.createObjectStore('sales', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customers')) {
          db.createObjectStore('customers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('invoices')) {
          db.createObjectStore('invoices', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scheduledPosts')) {
          db.createObjectStore('scheduledPosts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('coupons')) {
          db.createObjectStore('coupons', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('ecommerceSettings')) {
          db.createObjectStore('ecommerceSettings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('aiInsights')) {
          const store = db.createObjectStore('aiInsights', { keyPath: 'timestamp' });
          store.createIndex('prompt', 'prompt', { unique: false });
        }
        if (!db.objectStoreNames.contains('appData')) {
          db.createObjectStore('appData', { keyPath: 'key' });
        }
      };
    });
  }

  private async getStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly',
  ): Promise<IDBObjectStore> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Sales operations
  async saveSales(sales: Sale[]): Promise<void> {
    const store = await this.getStore('sales', 'readwrite');
    for (const sale of sales) {
      await this.promisifyRequest(store.put(sale));
    }
  }

  async getSales(): Promise<Sale[]> {
    const store = await this.getStore('sales');
    const request = store.getAll();
    return this.promisifyRequest(request);
  }

  async addSale(sale: Sale): Promise<void> {
    const store = await this.getStore('sales', 'readwrite');
    await this.promisifyRequest(store.add(sale));
  }

  // Inventory operations
  async saveInventory(inventory: InventoryItem[]): Promise<void> {
    const store = await this.getStore('inventory', 'readwrite');
    // Clear existing inventory
    await this.promisifyRequest(store.clear());
    for (const item of inventory) {
      await this.promisifyRequest(store.put(item));
    }
  }

  async getInventory(): Promise<InventoryItem[]> {
    const store = await this.getStore('inventory');
    return this.promisifyRequest(store.getAll());
  }

  async updateInventoryItem(item: InventoryItem): Promise<void> {
    const store = await this.getStore('inventory', 'readwrite');
    await this.promisifyRequest(store.put(item));
  }

  // Customer operations
  async saveCustomers(customers: Customer[]): Promise<void> {
    const store = await this.getStore('customers', 'readwrite');
    for (const customer of customers) {
      await this.promisifyRequest(store.put(customer));
    }
  }

  async getCustomers(): Promise<Customer[]> {
    const store = await this.getStore('customers');
    return this.promisifyRequest(store.getAll());
  }

  async addCustomer(customer: Customer): Promise<void> {
    const store = await this.getStore('customers', 'readwrite');
    await this.promisifyRequest(store.add(customer));
  }

  // Project operations
  async saveProjects(projects: Project[]): Promise<void> {
    const store = await this.getStore('projects', 'readwrite');
    for (const project of projects) {
      await this.promisifyRequest(store.put(project));
    }
  }

  async getProjects(): Promise<Project[]> {
    const store = await this.getStore('projects');
    return this.promisifyRequest(store.getAll());
  }

  // AI Insights operations
  async saveAIInsight(prompt: string, response: string): Promise<void> {
    const store = await this.getStore('aiInsights', 'readwrite');
    const insight = {
      prompt,
      response,
      timestamp: Date.now(),
    };
    await this.promisifyRequest(store.put(insight));
  }

  async getAIInsights(
    limit: number = 10,
  ): Promise<{ prompt: string; response: string; timestamp: number }[]> {
    const store = await this.getStore('aiInsights');
    const request = store.getAll();
    const insights = await this.promisifyRequest(request);
    return insights.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  async getCachedAIResponse(prompt: string): Promise<string | null> {
    const store = await this.getStore('aiInsights');
    const index = store.index('prompt');
    const request = index.get(prompt);
    const result = await this.promisifyRequest(request);
    return result ? result.response : null;
  }

  // App data operations
  async setAppData(key: string, value: unknown): Promise<void> {
    const store = await this.getStore('appData', 'readwrite');
    await this.promisifyRequest(store.put({ key, value, timestamp: Date.now() }));
  }

  async getAppData(key: string): Promise<unknown> {
    const store = await this.getStore('appData');
    const result = await this.promisifyRequest(store.get(key));
    return result ? result.value : null;
  }

  // Sync operations
  async setLastSync(timestamp: number): Promise<void> {
    await this.setAppData('lastSync', timestamp);
  }

  async getLastSync(): Promise<number> {
    const lastSync = await this.getAppData('lastSync');
    return lastSync || 0;
  }

  // Bulk operations for sync
  async getAllData(): Promise<OfflineData> {
    const [
      sales,
      inventory,
      customers,
      invoices,
      projects,
      scheduledPosts,
      products,
      orders,
      categories,
      coupons,
      ecommerceSettings,
      aiInsights,
      lastSync,
    ] = await Promise.all([
      this.getSales(),
      this.getInventory(),
      this.getCustomers(),
      this.getInvoices(),
      this.getProjects(),
      this.getScheduledPosts(),
      this.getProducts(),
      this.getOrders(),
      this.getCategories(),
      this.getCoupons(),
      this.getEcommerceSettings(),
      this.getAIInsights(50),
      this.getLastSync(),
    ]);

    return {
      sales,
      inventory,
      customers,
      invoices,
      projects,
      scheduledPosts,
      products,
      orders,
      categories,
      coupons,
      ecommerceSettings,
      aiInsights,
      lastSync,
    };
  }

  async saveAllData(data: Partial<OfflineData>): Promise<void> {
    const promises: Promise<void>[] = [];

    if (data.sales) promises.push(this.saveSales(data.sales));
    if (data.inventory) promises.push(this.saveInventory(data.inventory));
    if (data.customers) promises.push(this.saveCustomers(data.customers));
    if (data.invoices) promises.push(this.saveInvoices(data.invoices));
    if (data.projects) promises.push(this.saveProjects(data.projects));
    if (data.scheduledPosts) promises.push(this.saveScheduledPosts(data.scheduledPosts));
    if (data.products) promises.push(this.saveProducts(data.products));
    if (data.orders) promises.push(this.saveOrders(data.orders));
    if (data.categories) promises.push(this.saveCategories(data.categories));
    if (data.coupons) promises.push(this.saveCoupons(data.coupons));
    if (data.ecommerceSettings) promises.push(this.saveEcommerceSettings(data.ecommerceSettings));
    if (data.lastSync) promises.push(this.setLastSync(data.lastSync));

    await Promise.all(promises);
  }

  // Invoice operations
  async saveInvoices(invoices: Invoice[]): Promise<void> {
    const store = await this.getStore('invoices', 'readwrite');
    for (const invoice of invoices) {
      await this.promisifyRequest(store.put(invoice));
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    const store = await this.getStore('invoices');
    return this.promisifyRequest(store.getAll());
  }

  // Scheduled posts operations
  async saveScheduledPosts(posts: ScheduledPost[]): Promise<void> {
    const store = await this.getStore('scheduledPosts', 'readwrite');
    for (const post of posts) {
      await this.promisifyRequest(store.put(post));
    }
  }

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    const store = await this.getStore('scheduledPosts');
    return this.promisifyRequest(store.getAll());
  }

  // Product operations
  async saveProducts(products: Product[]): Promise<void> {
    const store = await this.getStore('products', 'readwrite');
    for (const product of products) {
      await this.promisifyRequest(store.put(product));
    }
  }

  async getProducts(): Promise<Product[]> {
    const store = await this.getStore('products');
    return this.promisifyRequest(store.getAll());
  }

  // Order operations
  async saveOrders(orders: Order[]): Promise<void> {
    const store = await this.getStore('orders', 'readwrite');
    for (const order of orders) {
      await this.promisifyRequest(store.put(order));
    }
  }

  async getOrders(): Promise<Order[]> {
    const store = await this.getStore('orders');
    return this.promisifyRequest(store.getAll());
  }

  // Category operations
  async saveCategories(categories: Category[]): Promise<void> {
    const store = await this.getStore('categories', 'readwrite');
    for (const category of categories) {
      await this.promisifyRequest(store.put(category));
    }
  }

  async getCategories(): Promise<Category[]> {
    const store = await this.getStore('categories');
    return this.promisifyRequest(store.getAll());
  }

  // Coupon operations
  async saveCoupons(coupons: Coupon[]): Promise<void> {
    const store = await this.getStore('coupons', 'readwrite');
    for (const coupon of coupons) {
      await this.promisifyRequest(store.put(coupon));
    }
  }

  async getCoupons(): Promise<Coupon[]> {
    const store = await this.getStore('coupons');
    return this.promisifyRequest(store.getAll());
  }

  // EcommerceSettings operations
  async saveEcommerceSettings(settings: EcommerceSettings): Promise<void> {
    const store = await this.getStore('ecommerceSettings', 'readwrite');
    await this.promisifyRequest(store.put(settings));
  }

  async getEcommerceSettings(): Promise<EcommerceSettings | null> {
    const store = await this.getStore('ecommerceSettings');
    const request = store.get(0); // Assuming single settings object
    return this.promisifyRequest(request);
  }

  // Network status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Utility method to promisify IndexedDB requests
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    const storeNames = [
      'sales',
      'inventory',
      'customers',
      'invoices',
      'projects',
      'scheduledPosts',
      'products',
      'orders',
      'categories',
      'aiInsights',
      'appData',
    ];
    for (const storeName of storeNames) {
      const store = await this.getStore(storeName, 'readwrite');
      await this.promisifyRequest(store.clear());
    }
  }
}

export const offlineStorage = new OfflineStorageService();
