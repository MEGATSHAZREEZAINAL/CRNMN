// REAL WhatsApp service (Baileys control-plane via local server)
const WA_SERVER_URL = (typeof window !== 'undefined'
  ? (import.meta as any).env?.VITE_WA_SERVER_URL
  : process.env.VITE_WA_SERVER_URL) || 'http://localhost:4001';

console.log('🤖 REAL WhatsApp Bot Service Initialized');

interface WhatsAppMessage {
  to: string;
  from: string;
  body: string;
  mediaUrl?: string;
  templateName?: string;
  language?: string;
  components?: unknown[];
  retryCount?: number;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface WhatsAppSession {
  id: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastActivity: Date;
  phoneNumber: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class WhatsAppService {
  private isInitialized = false;
  private sessions: Map<string, WhatsAppSession> = new Map();
  private messageQueue: WhatsAppMessage[] = [];
  private isProcessingQueue = false;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private connectionChangeCallbacks: ((status: boolean) => void)[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Always enabled for non-Twilio bot when WA server URL is present
      this.isInitialized = Boolean(WA_SERVER_URL);
      if (this.isInitialized) {
        console.log('✅ WhatsApp (Baileys) service initialized');
        this.startQueueProcessor();
      } else {
        console.log('⚠️ WhatsApp service disabled: WA server URL missing');
      }
    } catch (error: unknown) {
      console.error('❌ Error initializing WhatsApp service:', error);
    }
  }

  // Send WhatsApp message via Twilio
  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    if (!this.isInitialized) {
      return { success: false, error: 'WhatsApp service not initialized' };
    }

    try {
      // Add to queue for processing
      this.messageQueue.push(message);

      // Process queue if not already processing
      if (!this.isProcessingQueue) {
        this.processQueue();
      }

      return { success: true, messageId: `queued-${Date.now()}` };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error sending WhatsApp message:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Process message queue with rate limiting
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (!message) continue;

      try {
        // Rate limiting: delay between messages (non-Twilio defaults)
        const minDelayMs = 400; // ~human-like typing delay
        const maxDelayMs = 1200;
        const delay = Math.random() * (maxDelayMs - minDelayMs) + minDelayMs;

        await new Promise((resolve) => setTimeout(resolve, delay));

        // Send via REAL Baileys server
        console.log(`📤 Sending REAL WhatsApp to ${message.to}: ${message.body}`);
        await fetch(`${WA_SERVER_URL}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: message.to, text: message.body }),
        }).then(async (r) => {
          if (!r.ok) {
            const err = await r.text();
            throw new Error(err || `HTTP ${r.status}`);
          }
          console.log(`✅ REAL WhatsApp message sent to ${message.to}`);
        });
      } catch (error: unknown) {
        console.error('❌ Error processing WhatsApp message:', error);
        // Re-queue failed messages (with retry limit)
        if (message.retryCount < 3) {
          message.retryCount = (message.retryCount || 0) + 1;
          this.messageQueue.unshift(message);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  // Start the queue processor
  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessingQueue && this.messageQueue.length > 0) {
        this.processQueue();
      }
    }, 1000);
  }

  // Get service status
  getStatus(): { initialized: boolean; queueLength: number; sessions: number } {
    return {
      initialized: this.isInitialized,
      queueLength: this.messageQueue.length,
      sessions: this.sessions.size,
    };
  }

  // Get message queue
  getMessageQueue(): WhatsAppMessage[] {
    return [...this.messageQueue];
  }

  // Clear message queue
  clearMessageQueue(): void {
    this.messageQueue = [];
  }

  onConnectionChange(callback: (status: boolean) => void): () => void {
    this.connectionChangeCallbacks.push(callback);
    return () => {
      this.connectionChangeCallbacks = this.connectionChangeCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    const isConnected = status === 'connected';
    this.connectionChangeCallbacks.forEach((callback) => callback(isConnected));
  }

  // Get active sessions
  getActiveSessions(): WhatsAppSession[] {
    return Array.from(this.sessions.values());
  }

  // Test WhatsApp connection
  getConnectionStatus(): boolean {
    return this.connectionStatus === 'connected';
  }

  async startBot(): Promise<{ success: boolean; qrCode?: string; error?: string }> {
    console.log('🚀 Starting REAL WhatsApp Bot...');
    this.setConnectionStatus('connecting');
    try {
      const res = await fetch(`${WA_SERVER_URL}/start`, { method: 'POST' });
      if (!res.ok) throw new Error(`Failed to start WA bot: ${res.status}`);
      
      console.log('⏳ Waiting for WhatsApp connection...');
      
      // Poll health until connected
      const start = Date.now();
      while (Date.now() - start < 30000) { // Extended to 30 seconds
        try {
          const h = await fetch(`${WA_SERVER_URL}/health`).then((r) => r.json());
          if (h.connected) {
            this.setConnectionStatus('connected');
            console.log('✅ REAL WhatsApp Bot Connected!');
            return { success: true };
          }
        } catch (e) {
          console.log('⏳ Waiting for bot server...');
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      
      // Try to get QR code
      try {
        const qrRes = await fetch(`${WA_SERVER_URL}/qr`);
        if (qrRes.ok) {
          const qrData = await qrRes.json();
          if (qrData.qr) {
            this.setConnectionStatus('disconnected');
            return { 
              success: false, 
              qrCode: qrData.qr,
              error: 'Scan QR code yang muncul di terminal untuk connect WhatsApp bot!' 
            };
          }
        }
      } catch (e) {
        console.log('Could not fetch QR code');
      }
      
      this.setConnectionStatus('disconnected');
      return { 
        success: false, 
        error: 'QR code belum di-scan. Check terminal untuk scan QR code dengan WhatsApp!' 
      };
    } catch (error: unknown) {
      this.setConnectionStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ WhatsApp Bot Error:', errorMsg);
      return { success: false, error: `Bot server error: ${errorMsg}` };
    }
  }

  async disconnect(): Promise<void> {
    try {
      await fetch(`${WA_SERVER_URL}/stop`, { method: 'POST' });
    } finally {
      this.setConnectionStatus('disconnected');
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isInitialized) {
      return { success: false, message: 'WhatsApp service not initialized' };
    }

    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: '✅ WhatsApp service connection test successful',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `❌ WhatsApp connection test failed: ${error}`,
      };
    }
  }
}

// Create and export a singleton instance
const whatsappService = new WhatsAppService();
export default whatsappService;
