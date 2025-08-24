import twilio from 'twilio';
import { api } from './api';
import twilioConfig from '../config/twilio.config';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
  phoneNumber: string;
  environment: 'test' | 'live';
}

interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface MessageLog {
  to: string;
  from: string;
  body: string;
  messageId: string;
  type: 'whatsapp' | 'sms';
  status: string;
  sent_at: string;
}

// Moved type declarations to top-level (cannot declare interfaces inside a class)
interface AccountInfo {
  accountSid: string;
  accountName: string;
  status: string;
  type: string;
  dateCreated: string | Date;
  dateUpdated: string | Date;
}

interface PhoneNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms: boolean;
    whatsapp: boolean;
  };
  status: string;
}

interface UsageRecord {
  sid: string;
  category: string;
  description: string;
  usage: string;
  usageUnit: string;
  price: string;
  priceUnit: string;
  date: string | Date;
}

class TwilioService {
  private client: twilio.Twilio | null = null;
  private config: TwilioConfig;
  private isInitialized = false;
  private messageLogs: MessageLog[] = [];

  constructor() {
    // Initialize with default config
    this.config = {
      accountSid: twilioConfig.default.accountSid,
      authToken: twilioConfig.default.authToken,
      whatsappNumber: twilioConfig.default.whatsappNumber,
      phoneNumber: twilioConfig.default.phoneNumber,
      environment: twilioConfig.default.environment,
    };

    // Try to initialize if credentials are available
    if (this.config.accountSid && this.config.authToken) {
      this.initializeClient();
    }
  }

  private initializeClient(): void {
    try {
      if (this.config.accountSid && this.config.authToken) {
        this.client = twilio(this.config.accountSid, this.config.authToken);
        this.isInitialized = true;
        console.log('✅ Twilio client initialized');
      }
    } catch (error: unknown) {
      console.error('❌ Failed to initialize Twilio client:', error);
      this.isInitialized = false;
    }
  }

  // Initialize the service with proper credentials
  async initialize(
    accountSid: string,
    authToken: string,
    environment: 'test' | 'live' = 'test',
    whatsappNumber?: string,
    phoneNumber?: string,
  ): Promise<boolean> {
    try {
      // Update credentials based on parameters
      this.config.accountSid = accountSid;
      this.config.authToken = authToken;
      this.config.environment = environment;

      if (whatsappNumber) {
        this.config.whatsappNumber = whatsappNumber;
      } else if (environment === 'test') {
        this.config.whatsappNumber = twilioConfig.test.whatsappNumber;
      }

      if (phoneNumber) {
        this.config.phoneNumber = phoneNumber;
      }

      // Recreate client with new credentials
      this.client = twilio(this.config.accountSid, this.config.authToken);

      // Test the connection
      await this.client.api.accounts(this.config.accountSid).fetch();

      this.isInitialized = true;
      console.log(
        `✅ Twilio service initialized successfully (${this.config.environment} environment)`,
      );
      return true;
    } catch (error: unknown) {
      console.error('❌ Failed to initialize Twilio service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Quick initialization with test credentials from environment
  async initializeTest(): Promise<boolean> {
    const accountSid = twilioConfig.test.accountSid;
    const authToken = twilioConfig.test.authToken;

    if (!accountSid || !authToken) {
      console.error('❌ Test credentials not found in configuration');
      return false;
    }

    return this.initialize(accountSid, authToken, 'test');
  }

  // Quick initialization with live credentials from environment
  async initializeLive(): Promise<boolean> {
    const accountSid = twilioConfig.live.accountSid;
    const authToken = twilioConfig.live.authToken;

    if (!accountSid || !authToken) {
      console.error('❌ Live credentials not found in configuration');
      return false;
    }

    return this.initialize(accountSid, authToken, 'live');
  }

  // Send WhatsApp message
  async sendWhatsApp(to: string, message: string): Promise<MessageResponse> {
    if (!this.isInitialized || !this.client) {
      return { success: false, error: 'Twilio service not initialized' };
    }

    if (!this.config.whatsappNumber) {
      return { success: false, error: 'WhatsApp number not configured' };
    }

    try {
      const messageInstance = await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.config.whatsappNumber}`,
        to: `whatsapp:${to}`,
      });

      // Log message to local state and database
      const messageLog: MessageLog = {
        to,
        from: this.config.whatsappNumber,
        body: message,
        messageId: messageInstance.sid,
        type: 'whatsapp',
        status: messageInstance.status,
        sent_at: new Date().toISOString(),
      };

      this.messageLogs.unshift(messageLog);
      await this.logMessage(messageLog);

      return { success: true, messageId: messageInstance.sid };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: errorMessage };
    }
  }

  // Send WhatsApp message with content template
  async sendWhatsAppTemplate(
    to: string,
    contentSid: string,
    contentVariables: Record<string, string>,
  ): Promise<MessageResponse> {
    if (!this.isInitialized || !this.client) {
      return { success: false, error: 'Twilio service not initialized' };
    }

    if (!this.config.whatsappNumber) {
      return { success: false, error: 'WhatsApp number not configured' };
    }

    try {
      const messageInstance = await this.client.messages.create({
        contentSid: contentSid,
        contentVariables: JSON.stringify(contentVariables),
        from: `whatsapp:${this.config.whatsappNumber}`,
        to: `whatsapp:${to}`,
      });

      // Log message to local state and database
      const messageLog: MessageLog = {
        to,
        from: this.config.whatsappNumber,
        body: `Template: ${contentSid}`,
        messageId: messageInstance.sid,
        type: 'whatsapp',
        status: messageInstance.status,
        sent_at: new Date().toISOString(),
      };

      this.messageLogs.unshift(messageLog);
      await this.logMessage(messageLog);

      return { success: true, messageId: messageInstance.sid };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending WhatsApp template message:', error);
      return { success: false, error: errorMessage };
    }
  }

  // Send SMS
  async sendSMS(to: string, message: string, fromNumber?: string): Promise<MessageResponse> {
    if (!this.isInitialized || !this.client) {
      return { success: false, error: 'Twilio service not initialized' };
    }

    const fromPhone = fromNumber || this.config.phoneNumber;
    if (!fromPhone) {
      return { success: false, error: 'Phone number not configured' };
    }

    try {
      const messageInstance = await this.client.messages.create({
        body: message,
        from: fromPhone,
        to,
      });

      // Log message to local state and database
      const messageLog: MessageLog = {
        to,
        from: fromPhone,
        body: message,
        messageId: messageInstance.sid,
        type: 'sms',
        status: messageInstance.status,
        sent_at: new Date().toISOString(),
      };

      this.messageLogs.unshift(messageLog);
      await this.logMessage(messageLog);

      return { success: true, messageId: messageInstance.sid };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending SMS:', error);
      return { success: false, error: errorMessage };
    }
  }

  // Make voice call
  async makeCall(to: string, from: string, twimlUrl?: string): Promise<MessageResponse> {
    if (!this.isInitialized || !this.client) {
      return { success: false, error: 'Twilio client not initialized' };
    }

    try {
      const call = await this.client.calls.create({
        to,
        from: from || this.config.phoneNumber,
        twiml: twimlUrl
          ? `<Response><Play>${twimlUrl}</Play></Response>`
          : '<Response><Say>Hello from Twilio!</Say></Response>',
        statusCallback: `${process.env.VITE_BASE_URL}/api/twilio/call-status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      });

      // Log the call
      await this.logMessage({
        to,
        from: from || this.config.phoneNumber,
        body: 'Voice call initiated',
        messageId: call.sid,
        type: 'sms', // Using SMS type for calls as well
        status: call.status,
      });

      return { success: true, messageId: call.sid };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error making call:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Business-specific WhatsApp commands
  async processBusinessCommand(command: string, sender: string): Promise<string> {
    const commandLower = command.toLowerCase().trim();

    switch (commandLower) {
      case 'help':
      case 'bantuan':
        return this.getHelpMessage();

      case 'status jualan':
        return await this.getSalesStatus();

      case 'check stok':
      case 'stok rendah':
        return await this.getLowStockAlert();

      case 'revenue harini':
        return await this.getTodayRevenue();

      case 'order stok':
        return "📦 Untuk order stok, sila nyatakan nama item. Contoh: 'order stok jagung'";

      default:
        if (commandLower.startsWith('order stok ')) {
          const itemName = command.replace('order stok', '').trim();
          return await this.processRestockOrder(itemName);
        }
        return "❓ Arahan tidak dikenali. Taip 'help' untuk senarai arahan.";
    }
  }

  // Get help message
  private getHelpMessage(): string {
    return `🤖 *STRATEGIC HQ WhatsApp Bot*

📋 *Arahan yang tersedia:*
• status jualan - Status jualan terkini
• check stok - Semak status stok
• stok rendah - Lihat stok yang rendah
• revenue harini - Jumlah revenue hari ini  
• order stok [nama] - Tempah stok baru
• help - Papar mesej ini

💡 *Tip:* Semua arahan dalam Bahasa Melayu
🔗 *Powered by Twilio*`;
  }

  // Get sales status
  private async getSalesStatus(): Promise<string> {
    try {
      const sales = await api.getSales();

      if (!sales?.length) {
        return '📊 Tiada data jualan pada masa ini.';
      }

      const totalSales = sales.length;
      const latestSale = sales[0] as any;

      return `📊 *Status Jualan*

🔥 *Jualan Terkini:*
${latestSale.product} - RM${Number(latestSale.amount).toFixed(2)}

📈 *Ringkasan:*
• Jumlah transaksi: ${totalSales}
• Masa terakhir: ${new Date(latestSale.createdAt ?? latestSale.created_at).toLocaleString('ms-MY')}`;
    } catch (error: unknown) {
      console.error('Error getting sales status:', error);
      return '❌ Gagal mendapatkan data jualan.';
    }
  }

  // Get low stock alert
  private async getLowStockAlert(): Promise<string> {
    try {
      const inventory = await api.getInventory();

      if (!inventory?.length) {
        return '✅ Semua stok berada pada paras selamat.';
      }

      // Filter items with low stock
      const lowStockItems = inventory.filter((item) => item.stock < item.threshold);

      if (lowStockItems.length === 0) {
        return '✅ Semua stok berada pada paras selamat.';
      }

      const alertMessage = lowStockItems
        .map((item) => `• ${item.name}: ${item.stock} unit (perlu ${item.threshold})`)
        .join('\n');

      return `⚠️ *Amaran Stok Rendah*\n\n${alertMessage}`;
    } catch (error: unknown) {
      console.error('Error getting low stock alert:', error);
      return '❌ Gagal menyemak stok.';
    }
  }

  // Get today's revenue
  private async getTodayRevenue(): Promise<string> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sales = await api.getSales();
      const todaySales = sales.filter(sale => new Date((sale as any).createdAt ?? (sale as any).created_at) >= today);

      const totalRevenue = todaySales?.reduce((sum, sale) => sum + Number((sale as any).amount ?? (sale as any).total ?? 0), 0) || 0;

      return `💰 *Revenue Hari Ini*\n\nRM${totalRevenue.toFixed(2)}`;
    } catch (error: unknown) {
      console.error('Error getting today revenue:', error);
      return '❌ Gagal mengira revenue.';
    }
  }

  // Process restock order
  private async processRestockOrder(itemName: string): Promise<string> {
    if (!itemName) {
      return "❓ Sila nyatakan nama item. Contoh: 'order stok jagung'";
    }

    try {
      const inventory = await api.getInventory();
      const item = inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));

      if (!item) {
        return `❌ Item '${itemName}' tidak dijumpai dalam inventori.`;
      }

      const orderQuantity = item.threshold * 2;

      await api.createRestockOrder({
        item_id: (item as any).id,
        item_name: (item as any).name,
        quantity: orderQuantity,
        status: 'pending',
        requested_at: new Date().toISOString(),
      });

      return `✅ *Pesanan Stok Berjaya*\n\n📦 Item: ${(item as any).name}\n📊 Kuantiti: ${orderQuantity} unit\n⏳ Status: Pending approval\n\nPesanan akan diproses dalam 1-2 hari bekerja.`;
    } catch (error: unknown) {
      console.error('Error processing restock order:', error);
      return `❌ Gagal memproses pesanan untuk '${itemName}'.`;
    }
  }

  // Log message to database
  private async logMessage(messageData: Omit<MessageLog, 'sent_at'>): Promise<void> {
    try {
      await api.logMessage({
        ...messageData,
        sent_at: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error('Error logging message:', error);
    }
  }

  // Get service status
  getStatus(): {
    initialized: boolean;
    accountSid: string;
    hasWhatsApp: boolean;
    hasSMS: boolean;
    environment: string;
  } {
    return {
      initialized: this.isInitialized,
      accountSid: this.config.accountSid,
      hasWhatsApp: !!this.config.whatsappNumber,
      hasSMS: !!this.config.phoneNumber,
      environment: this.config.environment,
    };
  }

  // Get message logs
  async getMessageLogs(limit = 50): Promise<MessageLog[]> {
    try {
      return await api.getMessageLogs(limit);
    } catch (error: unknown) {
      console.error('❌ Error fetching message logs:', error);
      return this.messageLogs.slice(0, limit); // Fallback to local logs
    }
  }

  async getAccountInfo(): Promise<AccountInfo | { error: string }> {
    if (!this.isInitialized || !this.client) {
      return { error: 'Twilio client not initialized' };
    }

    try {
      const account = await this.client.api.accounts(this.config.accountSid).fetch();
      return {
        accountSid: account.sid,
        accountName: account.friendlyName,
        status: account.status,
        type: account.type,
        dateCreated: account.dateCreated,
        dateUpdated: account.dateUpdated,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error fetching account info:', errorMessage);
      return { error: errorMessage };
    }
  }

  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    if (!this.isInitialized || !this.client) {
      return [];
    }

    try {
      const incomingPhoneNumbers = await this.client.incomingPhoneNumbers.list();
      return incomingPhoneNumbers.map((phone) => ({
        sid: phone.sid,
        phoneNumber: (phone as any).phoneNumber,
        friendlyName: (phone as any).friendlyName,
        capabilities: {
          sms: Boolean((phone as any).capabilities?.sms),
          voice: Boolean((phone as any).capabilities?.voice),
          mms: Boolean((phone as any).capabilities?.mms),
          whatsapp: Boolean((phone as any).capabilities?.whatsapp),
        },
        status: (phone as any).status,
      }));
    } catch (error: unknown) {
      console.error('❌ Error fetching phone numbers:', error);
      return [];
    }
  }

  async getUsageRecords(category?: string, startDate?: string, endDate?: string): Promise<UsageRecord[]> {
    if (!this.isInitialized || !this.client) {
      return [];
    }

    try {
      const usageRecords = await this.client.usage.records.list();
      return usageRecords.map((record: any) => ({
        sid: record.sid,
        category: record.category,
        description: String(record.description ?? ''),
        usage: String(record.usage ?? ''),
        usageUnit: String(record.usageUnit ?? ''),
        price: String(record.price ?? '0'),
        priceUnit: String(record.priceUnit ?? ''),
        date: record.dateCreated ?? record.dateUpdated ?? new Date().toISOString(),
      }));
    } catch (error: unknown) {
      console.error('❌ Error fetching usage records:', error);
      return [];
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isInitialized || !this.client) {
      return { success: false, error: 'Service not initialized' };
    }

    try {
      await this.client.api.accounts(this.config.accountSid).fetch();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  // Get configuration
  getConfig(): TwilioConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<TwilioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.isInitialized = false;
    this.initializeClient();
  }

  // Get initialization status
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Create and export a singleton instance
const twilioService = new TwilioService();
export default twilioService;
