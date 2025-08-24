export interface MobileApp {
  id: string;
  name: string;
  version: string;
  platform: 'ios' | 'android' | 'web';
  status: 'development' | 'testing' | 'production' | 'maintenance';
  downloadUrl?: string;
  features: string[];
  lastUpdated: string;
  activeUsers: number;
  totalDownloads: number;
}

export interface MobileUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  deviceInfo: {
    model: string;
    osVersion: string;
    appVersion: string;
  };
  lastActive: string;
  pushTokens: string[];
  preferences: {
    notifications: boolean;
    location: boolean;
    biometric: boolean;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  registeredAt: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: { [key: string]: unknown };
  recipients: string[]; // user IDs or 'all'
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  platform?: 'ios' | 'android' | 'web' | 'all';
  badge?: number;
  sound?: string;
  image?: string;
  clickAction?: string;
  deliveryStats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
}

export interface MobileOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryMethod: 'pickup' | 'delivery' | 'dine-in';
  deliveryAddress?: string;
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationData {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address?: string;
  accuracy: number;
  timestamp: string;
  purpose: 'order-tracking' | 'store-locator' | 'delivery';
}

export interface MobileAnalytics {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  userRetention: {
    day1: number; // percentage
    day7: number;
    day30: number;
  };
  sessionMetrics: {
    avgSessionDuration: number; // minutes
    avgSessionsPerUser: number;
    bounceRate: number; // percentage
  };
  orderMetrics: {
    totalOrders: number;
    avgOrderValue: number;
    conversionRate: number; // percentage
  };
  topFeatures: {
    name: string;
    usageCount: number;
    percentage: number;
  }[];
  crashReports: {
    total: number;
    resolved: number;
    pending: number;
  };
  appRatings: {
    average: number;
    total: number;
    breakdown: {
      [stars: number]: number;
    };
  };
}

export interface MobileFeature {
  id: string;
  name: string;
  description: string;
  type: 'core' | 'premium' | 'experimental';
  platforms: ('ios' | 'android' | 'web')[];
  enabled: boolean;
  configurable: boolean;
  config?: { [key: string]: unknown };
  requiredVersion: string;
  usageStats: {
    totalUsers: number;
    activeUsers: number;
    engagementRate: number;
  };
}

export interface AppUpdate {
  id: string;
  version: string;
  platform: 'ios' | 'android' | 'web';
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  title: string;
  description: string;
  features: string[];
  bugFixes: string[];
  breaking: boolean;
  required: boolean;
  releaseDate: string;
  downloadUrl?: string;
  rolloutPercentage: number;
  status: 'draft' | 'testing' | 'rolling-out' | 'completed' | 'paused';
}
