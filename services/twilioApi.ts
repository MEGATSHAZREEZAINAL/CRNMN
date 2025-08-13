import { api } from './api';

export interface ApiResult {
  success: boolean;
  message?: string;
  error?: string;
  sid?: string;
  status?: string;
}

export async function testConnection(): Promise<ApiResult> {
  try {
    const res = await fetch('/api/whatsapp/status');
    const data = await res.json().catch(() => ({}));
    console.log('🔍 testConnection debug:', {
      resOk: res.ok,
      resStatus: res.status,
      data,
      dataOk: data?.ok,
    });
    if (res.ok && data?.ok) return { success: true, message: 'Twilio backend reachable' };
    return { success: false, error: 'Twilio not configured on server' };
  } catch (e: unknown) {
    console.error('❌ testConnection error:', e);
    return { success: false, error: (e as Error)?.message || 'Network error' };
  }
}

export async function sendSMS(to: string, body: string): Promise<ApiResult> {
  try {
    const res = await fetch('/api/whatsapp/send-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message: body, type: 'sms' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success) return { success: true, sid: data.sid, status: data.status };
    return { success: false, error: data?.error || 'Failed to send SMS' };
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message || 'Network error' };
  }
}

export async function sendWhatsApp(to: string, body: string): Promise<ApiResult> {
  try {
    const res = await fetch('/api/whatsapp/send-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message: body, type: 'whatsapp' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success) return { success: true, sid: data.sid, status: data.status };
    return { success: false, error: data?.error || 'Failed to send WhatsApp message' };
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message || 'Network error' };
  }
}

export async function sendWhatsAppTemplate(
  to: string,
  contentSid: string,
  contentVariables?: Record<string, string>,
): Promise<ApiResult> {
  try {
    const res = await fetch('/api/whatsapp/send-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, contentSid, contentVariables }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success) return { success: true, sid: data.sid, status: data.status };
    return { success: false, error: data?.error || 'Failed to send template message' };
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message || 'Network error' };
  }
}

export async function getBackendStatus(): Promise<{
  ok: boolean;
  hasWhatsAppNumber: boolean;
  hasSmsNumber: boolean;
} | null> {
  try {
    const res = await fetch('/api/whatsapp/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type MessageChannel = 'whatsapp' | 'sms';

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class TwilioApiService {
  private initialized = false;
  private status: { accountSid?: string; hasWhatsApp?: boolean; hasSMS?: boolean } = {};

  async initializeTest(): Promise<boolean> {
    this.initialized = await this.fetchStatus();
    return this.initialized;
  }

  async initializeLive(): Promise<boolean> {
    this.initialized = await this.fetchStatus();
    return this.initialized;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      accountSid: this.status.accountSid || 'Not set',
      hasWhatsApp: !!this.status.hasWhatsApp,
      hasSMS: !!this.status.hasSMS,
    };
  }

  private async fetchStatus(): Promise<boolean> {
    try {
      const resp = await fetch('/api/whatsapp/status');
      if (!resp.ok) return false;
      const data = await resp.json();
      this.status = {
        accountSid: data?.accountSidMasked,
        hasWhatsApp: data?.hasWhatsAppNumber,
        hasSMS: data?.hasSmsNumber,
      };
      return !!data?.ok;
    } catch {
      return false;
    }
  }

  async sendWhatsApp(to: string, message: string): Promise<MessageResponse> {
    try {
      const resp = await fetch('/api/whatsapp/send-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, type: 'whatsapp' }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) return { success: false, error: data.error || 'send_failed' };
      await this.logMessage({
        to,
        from: 'whatsapp',
        body: message,
        messageId: data.sid,
        type: 'whatsapp',
        status: data.status || 'queued',
      });
      return { success: true, messageId: data.sid };
    } catch (e: unknown) {
      return { success: false, error: (e as Error)?.message || 'send_failed' };
    }
  }

  async sendSMS(to: string, message: string): Promise<MessageResponse> {
    try {
      const resp = await fetch('/api/whatsapp/send-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, type: 'sms' }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) return { success: false, error: data.error || 'send_failed' };
      await this.logMessage({
        to,
        from: 'sms',
        body: message,
        messageId: data.sid,
        type: 'sms',
        status: data.status || 'queued',
      });
      return { success: true, messageId: data.sid };
    } catch (e: unknown) {
      return { success: false, error: (e as Error)?.message || 'send_failed' };
    }
  }

  async sendWhatsAppTemplate(
    to: string,
    contentSid: string,
    contentVariables: Record<string, string>,
  ): Promise<MessageResponse> {
    try {
      const resp = await fetch('/api/whatsapp/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, contentSid, contentVariables }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) return { success: false, error: data.error || 'send_failed' };
      await this.logMessage({
        to,
        from: 'whatsapp',
        body: `Template: ${contentSid}`,
        messageId: data.sid,
        type: 'whatsapp',
        status: data.status || 'queued',
      });
      return { success: true, messageId: data.sid };
    } catch (e: unknown) {
      return { success: false, error: (e as Error)?.message || 'send_failed' };
    }
  }

  // Business commands (frontend helper)
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
      default:
        if (commandLower.startsWith('order stok ')) {
          const itemName = command.replace('order stok', '').trim();
          return await this.processRestockOrder(itemName);
        }
        return "❓ Arahan tidak dikenali. Taip 'help' untuk senarai arahan.";
    }
  }

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

  private async getSalesStatus(): Promise<string> {
    try {
      const sales = await api.getSales();

      if (!sales?.length) {
        return '📊 Tiada data jualan pada masa ini.';
      }

      const totalSales = sales.length;
      const latestSale = sales[0];

      return `📊 *Status Jualan*

🔥 *Jualan Terkini:*
${latestSale.product} - RM${Number(latestSale.amount).toFixed(2)}

📈 *Ringkasan:*
• Jumlah transaksi: ${totalSales}
• Masa terakhir: ${new Date(latestSale.createdAt).toLocaleString('ms-MY')}`;
    } catch (error) {
      return '❌ Gagal mendapatkan data jualan.';
    }
  }

  private async getLowStockAlert(): Promise<string> {
    try {
      const inventory = await api.getInventory();

      if (!inventory?.length) {
        return '✅ Semua stok berada pada paras selamat.';
      }

      const lowStockItems = inventory.filter((item) => item.stock < item.threshold);

      if (lowStockItems.length === 0) {
        return '✅ Semua stok berada pada paras selamat.';
      }

      const alertMessage = lowStockItems
        .map((item) => `• ${item.name}: ${item.stock} unit (perlu ${item.threshold})`)
        .join('\n');

      return `⚠️ *Amaran Stok Rendah*\n\n${alertMessage}`;
    } catch (error) {
      return '❌ Gagal menyemak stok.';
    }
  }

  private async getTodayRevenue(): Promise<string> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sales = await api.getSales();
      const todaySales = sales.filter(sale => new Date(sale.createdAt) >= today);

      const totalRevenue =
        todaySales?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
      return `💰 *Revenue Hari Ini*\n\nRM${totalRevenue.toFixed(2)}`;
    } catch (error) {
      return '❌ Gagal mengira revenue.';
    }
  }

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
        item_id: item.id,
        item_name: item.name,
        quantity: orderQuantity,
        status: 'pending',
        requested_at: new Date().toISOString(),
      });

      return `✅ *Pesanan Stok Berjaya*

📦 Item: ${item.name}
📊 Kuantiti: ${orderQuantity} unit
⏳ Status: Pending approval

Pesanan akan diproses dalam 1-2 hari bekerja.`;
    } catch (error) {
      return `❌ Gagal memproses pesanan untuk '${itemName}'.`;
    }
  }

  private async logMessage(messageData: {
    to: string;
    from: string;
    body: string;
    messageId: string;
    type: MessageChannel;
    status: string;
  }): Promise<void> {
    try {
      await api.logMessage({
        ...messageData,
        sent_at: new Date().toISOString(),
      });
    } catch (error) {
      // non-fatal
    }
  }
}

export const twilioApi = new TwilioApiService();
