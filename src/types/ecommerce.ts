export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  category: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string }; // e.g., color: "red", size: "L"
  image?: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Address {
  id?: string;
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit-card' | 'online-banking' | 'e-wallet' | 'cod' | 'bank-transfer';
  icon?: string;
  active: boolean;
  config?: { [key: string]: unknown };
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed-amount' | 'free-shipping';
  value: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface EcommerceSettings {
  id: string;
  businessName: string;
  businessAddress: Address;
  currency: string;
  taxRate: number;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  autoStockManagement: boolean;
  lowStockNotifications: boolean;
  orderConfirmationEmail: boolean;
  shippingConfirmationEmail: boolean;
}

export interface EcommerceDashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  topSellingProducts: {
    productId: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  recentOrders: Order[];
}
