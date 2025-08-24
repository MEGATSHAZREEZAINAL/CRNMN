import { db } from './firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { offlineStorage } from './offlineStorage';
import type { Sale, InventoryItem, Customer, Invoice, Project, ScheduledPost } from '../types';
import type { Product, Order, Category, Coupon, EcommerceSettings } from '../types/ecommerce';
import type {
  TeamMember,
  TeamInvitation,
  TeamTask,
  TeamNotification,
  TeamChat,
  TeamPerformance,
} from '../types/team';

class APIService {
  private isOnline(): boolean {
    return navigator.onLine;
  }

  private async getCollection<T>(collectionName: string, offlineGetter: () => Promise<T[]>, q?: any): Promise<T[]> {
    try {
      if (!this.isOnline()) {
        return await offlineGetter();
      }

      const col = collection(db, collectionName);
      const dataQuery = q ? query(col, q) : col;
      const snapshot = await getDocs(dataQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];

      // Persist to offline storage using specific save methods when available
      try {
        switch (collectionName) {
          case 'sales':
            await offlineStorage.saveSales(data as any);
            break;
          case 'inventory':
            await offlineStorage.saveInventory(data as any);
            break;
          case 'customers':
            await offlineStorage.saveCustomers(data as any);
            break;
          case 'invoices':
            await offlineStorage.saveInvoices(data as any);
            break;
          case 'projects':
            await offlineStorage.saveProjects(data as any);
            break;
          case 'scheduledPosts':
            await offlineStorage.saveScheduledPosts(data as any);
            break;
          case 'products':
            await offlineStorage.saveProducts(data as any);
            break;
          case 'orders':
            await offlineStorage.saveOrders(data as any);
            break;
          case 'categories':
            await offlineStorage.saveCategories(data as any);
            break;
          case 'coupons':
            await offlineStorage.saveCoupons(data as any);
            break;
          default:
            break;
        }
      } catch {}

      return data || [];
    } catch (error) {
      console.warn(`Firebase permission error for ${collectionName}, using offline data:`, error);
      return await offlineGetter();
    }
  }

  // Sales API
  async getSales(): Promise<Sale[]> {
    return this.getCollection('sales', offlineStorage.getSales, query(collection(db, 'sales'), orderBy('createdAt', 'desc'), limit(100)));
  }

  async createSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}`,
    };

    try {
      await offlineStorage.addSale(newSale);

      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'sales'), newSale);
        return { ...newSale, id: docRef.id };
      }

      return newSale;
    } catch (error) {
      console.error('Error creating sale:', error);
      return newSale;
    }
  }

  // Inventory API
  async getInventory(): Promise<InventoryItem[]> {
     return this.getCollection('inventory', offlineStorage.getInventory, query(collection(db, 'inventory'), orderBy('name')));
  }

  async updateInventory(item: InventoryItem): Promise<InventoryItem> {
    try {
      await offlineStorage.updateInventoryItem(item);

      if (this.isOnline()) {
        const itemRef = doc(db, 'inventory', item.id);
        await updateDoc(itemRef, { name: item.name, stock: item.stock, threshold: item.threshold });
        return item;
      }

      return item;
    } catch (error) {
      console.error('Error updating inventory:', error);
      return item;
    }
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'inventory'), newItem);
        const createdItem = { ...newItem, id: docRef.id };
        const inventory = await offlineStorage.getInventory();
        await offlineStorage.saveInventory([...inventory, createdItem]);
        return createdItem;
      }

      const inventory = await offlineStorage.getInventory();
      await offlineStorage.saveInventory([...inventory, newItem]);

      return newItem;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      return newItem;
    }
  }

  // Customers API
  async getCustomers(): Promise<Customer[]> {
    return this.getCollection('customers', offlineStorage.getCustomers, query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
    };

    try {
      await offlineStorage.addCustomer(newCustomer);

      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'customers'), newCustomer);
        return { ...newCustomer, id: docRef.id };
      }

      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      return newCustomer;
    }
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    try {
      if (this.isOnline()) {
        const customerRef = doc(db, 'customers', customer.id);
        await updateDoc(customerRef, { name: customer.name, phone: customer.phone, lastSeen: customer.lastSeen, totalSpent: customer.totalSpent });
      }

      const customers = await offlineStorage.getCustomers();
      const updatedCustomers = customers.map((c) => (c.id === customer.id ? customer : c));
      await offlineStorage.saveCustomers(updatedCustomers);

      return customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      return customer;
    }
  }

  // Projects API
  async getProjects(): Promise<Project[]> {
    return this.getCollection('projects', offlineStorage.getProjects, query(collection(db, 'projects'), orderBy('createdAt', 'desc')));
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'projects'), newProject);
        const createdProject = { ...newProject, id: docRef.id };
        const projects = await offlineStorage.getProjects();
        await offlineStorage.saveProjects([...projects, createdProject]);
        return createdProject;
      }

      const projects = await offlineStorage.getProjects();
      await offlineStorage.saveProjects([...projects, newProject]);

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      return newProject;
    }
  }

  async updateProject(project: Project): Promise<Project> {
    try {
      if (this.isOnline()) {
        const projectRef = doc(db, 'projects', project.id);
        await updateDoc(projectRef, { title: project.title, description: project.description, status: project.status, tasks: project.tasks });
      }

      const projects = await offlineStorage.getProjects();
      const updatedProjects = projects.map((p) => (p.id === project.id ? project : p));
      await offlineStorage.saveProjects(updatedProjects);

      return project;
    } catch (error) {
      console.error('Error updating project:', error);
      return project;
    }
  }

  // Invoices API
  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.getCollection('invoices', offlineStorage.getInvoices, query(collection(db, 'invoices'), orderBy('createdAt', 'desc')));
    return invoices.map((invoice: any) => ({...invoice, customerName: invoice.customerName ?? invoice.customer_name}))
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'invoices'), { ...newInvoice, customer_name: newInvoice.customerName });
        const createdInvoice = { ...newInvoice, id: docRef.id };
        const invoices = await offlineStorage.getInvoices();
        await offlineStorage.saveInvoices([...invoices, createdInvoice]);
        return createdInvoice;
      }

      const invoices = await offlineStorage.getInvoices();
      await offlineStorage.saveInvoices([...invoices, newInvoice]);

      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return newInvoice;
    }
  }

  // AI Insights API
  async saveAIInsight(prompt: string, response: string): Promise<void> {
    try {
      await offlineStorage.saveAIInsight(prompt, response);

      if (this.isOnline()) {
        await addDoc(collection(db, 'ai_insights'), { prompt, response, createdAt: new Date() });
      }
    } catch (error) {
      console.error('Error saving AI insight:', error);
    }
  }

  async getAIInsights(
    limit_val: number = 10,
  ): Promise<Array<{ prompt: string; response: string; timestamp: number }>> {
    const insights: any[] = await this.getCollection('ai_insights', () => offlineStorage.getAIInsights(limit_val), query(collection(db, 'ai_insights'), orderBy('createdAt', 'desc'), limit(limit_val)));
    return insights.map((insight: any) => ({...insight, timestamp: typeof insight.createdAt?.toMillis === 'function' ? insight.createdAt.toMillis() : (insight.timestamp ?? Date.now())}))
  }

  // Business Settings API
  async getBusinessSettings(): Promise<{
    businessName: string;
    monthlyGoal: number;
    currency: string;
  } | null> {
    // Always return default settings to avoid Firebase permission issues
    const defaultSettings = {
      businessName: 'CORNMAN Strategic HQ',
      monthlyGoal: 10000,
      currency: 'RM',
    };

    try {
      // Check offline first
      if (!this.isOnline()) {
        const settings = (await offlineStorage.getAppData('businessSettings')) as any;
        return settings ?? defaultSettings;
      }

      // Try Firebase but catch permission errors
      const settingsDoc = await getDoc(doc(db, 'business_settings', 'settings'));
      if (settingsDoc.exists()) {
         const data = settingsDoc.data();
        const settings = {
            businessName: data.business_name || defaultSettings.businessName,
            monthlyGoal: data.monthly_goal || defaultSettings.monthlyGoal,
            currency: data.currency || defaultSettings.currency,
          };
        await offlineStorage.setAppData('businessSettings', settings);
        return settings;
      }
      
      // Return defaults if document doesn't exist
      return defaultSettings;

    } catch (error) {
      console.warn('Firebase permission error for business settings, using defaults:', error);
      // Store defaults in offline storage for next time
      await offlineStorage.setAppData('businessSettings', defaultSettings);
      return defaultSettings;
    }
  }

  async updateBusinessSettings(settings: {
    businessName: string;
    monthlyGoal: number;
    currency: string;
  }): Promise<void> {
    try {
      await offlineStorage.setAppData('businessSettings', settings);

      if (this.isOnline()) {
        await setDoc(doc(db, 'business_settings', 'settings'), { business_name: settings.businessName, monthly_goal: settings.monthlyGoal, currency: settings.currency }, { merge: true });
      }
    } catch (error) {
      console.error('Error updating business settings:', error);
    }
  }

  // E-commerce Products API
  async getProducts(): Promise<Product[]> {
    return this.getCollection('products', offlineStorage.getProducts, query(collection(db, 'products'), orderBy('name')));
  }

  // E-commerce Orders API
  async getOrders(): Promise<Order[]> {
    return this.getCollection('orders', offlineStorage.getOrders, query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  }

  // E-commerce Categories API
  async getCategories(): Promise<Category[]> {
    return this.getCollection('categories', offlineStorage.getCategories, query(collection(db, 'categories'), orderBy('name')));
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'products'), newProduct);
        return { ...newProduct, id: docRef.id };
      }
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return newProduct;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      if (this.isOnline()) {
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, updates);
      }
      const products = await offlineStorage.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex > -1) {
        products[productIndex] = { ...products[productIndex], ...updates };
        await offlineStorage.saveProducts(products);
        return products[productIndex];
      }
      throw new Error('Product not found offline');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      if (this.isOnline()) {
        await deleteDoc(doc(db, 'products', id));
      }
      const products = await offlineStorage.getProducts();
      const filteredProducts = products.filter((p) => p.id !== id);
      await offlineStorage.saveProducts(filteredProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'categories'), newCategory);
        return { ...newCategory, id: docRef.id };
      }
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      return newCategory;
    }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      if (this.isOnline()) {
        const categoryRef = doc(db, 'categories', id);
        await updateDoc(categoryRef, updates);
      }
      const categories = await offlineStorage.getCategories();
      const categoryIndex = categories.findIndex((c) => c.id === id);
      if (categoryIndex > -1) {
        categories[categoryIndex] = { ...categories[categoryIndex], ...updates };
        await offlineStorage.saveCategories(categories);
        return categories[categoryIndex];
      }
      throw new Error('Category not found offline');
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      if (this.isOnline()) {
        await deleteDoc(doc(db, 'categories', id));
      }
      const categories = await offlineStorage.getCategories();
      const filteredCategories = categories.filter((c) => c.id !== id);
      await offlineStorage.saveCategories(filteredCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (this.isOnline()) {
        const docRef = await addDoc(collection(db, 'orders'), newOrder);
        return { ...newOrder, id: docRef.id };
      }
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return newOrder;
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      if (this.isOnline()) {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, updates);
      }
      const orders = await offlineStorage.getOrders();
      const orderIndex = orders.findIndex((o) => o.id === id);
      if (orderIndex > -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updates };
        await offlineStorage.saveOrders(orders);
        return orders[orderIndex];
      }
      throw new Error('Order not found offline');
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      if (this.isOnline()) {
        await deleteDoc(doc(db, 'orders', id));
      }
      const orders = await offlineStorage.getOrders();
      const filteredOrders = orders.filter((o) => o.id !== id);
      await offlineStorage.saveOrders(filteredOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // E-commerce Coupons API
  async getCoupons(): Promise<Coupon[]> {
    return this.getCollection('coupons', offlineStorage.getCoupons, query(collection(db, 'coupons'), orderBy('code')));
  }

  // E-commerce Settings API
  async getEcommerceSettings(): Promise<EcommerceSettings | null> {
    try {
      if (!this.isOnline()) {
        return await offlineStorage.getEcommerceSettings();
      }

      const settingsDoc = await getDoc(doc(db, 'ecommerce_settings', 'settings'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data() as EcommerceSettings;
        await offlineStorage.saveEcommerceSettings(data);
        return data;
      }
      return null;
    } catch (error) {
      console.warn('Firebase permission error for e-commerce settings, using defaults:', error);
      return await offlineStorage.getEcommerceSettings();
    }
  }

  async updateEcommerceSettings(settings: Partial<EcommerceSettings>): Promise<EcommerceSettings> {
    try {
      if (this.isOnline()) {
        await setDoc(doc(db, 'ecommerce_settings', 'settings'), settings, { merge: true });
      }
      const localSettings = await offlineStorage.getEcommerceSettings();
      const updatedSettings = { ...(localSettings || {} as any), ...settings } as EcommerceSettings;
      await offlineStorage.saveEcommerceSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating e-commerce settings:', error);
      throw error;
    }
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    // Mock data for now
    return [
      {
        id: 'member-1',
        name: 'Ahmad Rahman',
        email: 'ahmad@cornman.com',
        role: 1 as any,
        avatar: '/api/placeholder/40/40',
        department: 'Operations',
        joinedAt: '2024-01-15T00:00:00Z',
        lastActive: '2024-12-10T08:30:00Z',
        status: 'active',
        permissions: ['view_sales', 'create_sales', 'manage_inventory'],
      },
      {
        id: 'member-2',
        name: 'Siti Nurhaliza',
        email: 'siti@cornman.com',
        role: 2 as any,
        avatar: '/api/placeholder/40/40',
        department: 'Sales',
        joinedAt: '2024-02-01T00:00:00Z',
        lastActive: '2024-12-10T07:45:00Z',
        status: 'active',
        permissions: ['view_sales', 'create_sales'],
      },
    ];
  }

  async inviteTeamMember(email: string, role: string): Promise<{ error?: string }> {
    // Mock implementation
    console.log(`Inviting ${email} as ${role}`);
    return {};
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<{ error?: string }> {
    // Mock implementation
    console.log(`Updating member ${id}:`, updates);
    return {};
  }

  async removeTeamMember(id: string): Promise<{ error?: string }> {
    // Mock implementation
    console.log(`Removing member ${id}`);
    return {};
  }

  // Team Tasks
  async getTeamTasks(): Promise<TeamTask[]> {
    // Mock data
    return [
      {
        id: 'task-1',
        title: 'Update inventory count for corn products',
        description: 'Conduct physical count and update system records',
        assignedTo: ['member-1', 'member-2'],
        assignedBy: 'owner-1',
        priority: 'high',
        status: 'in-progress',
        dueDate: '2024-12-15T23:59:00Z',
        createdAt: '2024-12-08T10:00:00Z',
        updatedAt: '2024-12-10T08:30:00Z',
        tags: ['inventory', 'urgent'],
      },
      {
        id: 'task-2',
        title: 'Prepare monthly sales report',
        description: 'Compile November sales data and create presentation',
        assignedTo: ['member-1'],
        assignedBy: 'owner-1',
        priority: 'medium',
        status: 'completed',
        dueDate: '2024-12-01T17:00:00Z',
        createdAt: '2024-11-25T09:00:00Z',
        updatedAt: '2024-12-01T16:30:00Z',
        tags: ['sales', 'reporting'],
      },
    ];
  }

  async createTeamTask(
    task: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ error?: string }> {
    // Mock implementation
    console.log('Creating task:', task);
    return {};
  }

  async updateTeamTask(id: string, updates: Partial<TeamTask>): Promise<{ error?: string }> {
    // Mock implementation
    console.log(`Updating task ${id}:`, updates);
    return {};
  }

  // Notifications
  async getNotifications(): Promise<TeamNotification[]> {
    // Mock data
    return [
      {
        id: 'notif-1',
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: 'You have been assigned to "Update inventory count for corn products"',
        recipientId: 'member-1',
        senderId: 'owner-1',
        relatedId: 'task-1',
        read: false,
        createdAt: '2024-12-10T08:00:00Z',
      },
      {
        id: 'notif-2',
        type: 'deadline_reminder',
        title: 'Task Due Soon',
        message: 'Task "Update inventory count" is due in 2 days',
        recipientId: 'member-1',
        relatedId: 'task-1',
        read: false,
        createdAt: '2024-12-13T09:00:00Z',
      },
    ];
  }

  async markNotificationAsRead(id: string): Promise<{ error?: string }> {
    // Mock implementation
    console.log(`Marking notification ${id} as read`);
    return {};
  }

  // Team Chat
  async getChatMessages(): Promise<TeamChat[]> {
    // Mock data
    return [
      {
        id: 'msg-1',
        senderId: 'member-1',
        senderName: 'Ahmad Rahman',
        message: 'Inventory count for Sector A completed. Moving to Sector B.',
        type: 'text',
        createdAt: '2024-12-10T14:30:00Z',
        edited: false,
      },
      {
        id: 'msg-2',
        senderId: 'member-2',
        senderName: 'Siti Nurhaliza',
        message: "Great work! I'll handle Sector C after lunch.",
        type: 'text',
        replyTo: 'msg-1',
        createdAt: '2024-12-10T14:32:00Z',
        edited: false,
      },
    ];
  }

  async sendChatMessage(message: string): Promise<{ error?: string }> {
    // Mock implementation
    console.log('Sending message:', message);
    return {};
  }

  // Performance Analytics
  async getTeamPerformance(): Promise<TeamPerformance[]> {
    // Mock data
    return [
      {
        memberId: 'member-1',
        tasksCompleted: 12,
        tasksAssigned: 15,
        avgCompletionTime: 18.5,
        onTimeCompletion: 85,
        collaborationScore: 92,
        period: 'month',
        periodStart: '2024-11-01T00:00:00Z',
        periodEnd: '2024-11-30T23:59:59Z',
      },
      {
        memberId: 'member-2',
        tasksCompleted: 8,
        tasksAssigned: 10,
        avgCompletionTime: 22.1,
        onTimeCompletion: 78,
        collaborationScore: 88,
        period: 'month',
        periodStart: '2024-11-01T00:00:00Z',
        periodEnd: '2024-11-30T23:59:59Z',
      },
    ];
  }

  // Twilio related methods
  async createRestockOrder(order: any): Promise<any> {
    // Mock implementation
    console.log('Creating restock order:', order);
    return {};
  }

  async logMessage(message: any): Promise<any> {
    // Mock implementation
    console.log('Logging message:', message);
    return {};
  }

  async getMessageLogs(limit: number): Promise<any[]> {
    // Mock data
    console.log(`Getting message logs with limit: ${limit}`);
    return [];
  }

  // Sync operations
  async syncToServer(): Promise<{ success: boolean; message: string }> {
    if (!this.isOnline()) {
      return { success: false, message: 'Device is offline' };
    }

    try {
      const offlineData = await offlineStorage.getAllData();
      const batch = writeBatch(db);

      Object.keys(offlineData).forEach(collectionName => {
        offlineData[collectionName].forEach(item => {
          const itemRef = doc(db, collectionName, item.id);
          batch.set(itemRef, item, { merge: true });
        });
      });

      await batch.commit();
      await offlineStorage.setLastSync(Date.now());

      return { success: true, message: 'Data synchronized successfully' };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, message: 'Sync failed. Will retry later.' };
    }
  }
}

export const api = new APIService();
