import type { MobileApp, MobileAnalytics, PushNotification, MobileUser } from '../types/mobile';

class MobileService {
  async getApps(): Promise<MobileApp[]> {
    return [
      {
        id: 'cornman-ios',
        name: 'CORNMAN iOS',
        version: '1.2.0',
        platform: 'ios',
        status: 'production',
        downloadUrl: 'https://apps.apple.com/app/cornman',
        features: [
          'Order Management',
          'Push Notifications',
          'Location Services',
          'Payment Gateway',
        ],
        lastUpdated: '2024-12-01T00:00:00Z',
        activeUsers: 1250,
        totalDownloads: 5680,
      },
      {
        id: 'cornman-android',
        name: 'CORNMAN Android',
        version: '1.1.8',
        platform: 'android',
        status: 'production',
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.cornman',
        features: [
          'Order Management',
          'Push Notifications',
          'Location Services',
          'Payment Gateway',
        ],
        lastUpdated: '2024-11-28T00:00:00Z',
        activeUsers: 2150,
        totalDownloads: 8920,
      },
    ];
  }

  async getAnalytics(): Promise<MobileAnalytics> {
    return {
      activeUsers: { daily: 850, weekly: 2100, monthly: 3400 },
      userRetention: { day1: 85, day7: 65, day30: 42 },
      sessionMetrics: { avgSessionDuration: 8.5, avgSessionsPerUser: 3.2, bounceRate: 25 },
      orderMetrics: { totalOrders: 1250, avgOrderValue: 45.5, conversionRate: 68 },
      topFeatures: [
        { name: 'Quick Order', usageCount: 2850, percentage: 85 },
        { name: 'Order Tracking', usageCount: 2100, percentage: 62 },
        { name: 'Menu Browse', usageCount: 1950, percentage: 58 },
      ],
      crashReports: { total: 12, resolved: 10, pending: 2 },
      appRatings: { average: 4.6, total: 450, breakdown: { 5: 280, 4: 120, 3: 35, 2: 10, 1: 5 } },
    };
  }

  async getNotifications(): Promise<PushNotification[]> {
    return [
      {
        id: 'notif-001',
        title: 'Your Order is Ready!',
        body: 'Order #ORD-2024-001 is ready for pickup',
        recipients: ['user-001'],
        status: 'sent',
        sentAt: '2024-12-10T14:30:00Z',
        deliveryStats: { sent: 1, delivered: 1, opened: 1, clicked: 0, failed: 0 },
      },
    ];
  }
}

export const mobileService = new MobileService();
