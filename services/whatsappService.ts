import twilioConfig from '../config/twilio.config';

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
      if (twilioConfig.whatsapp.enabled) {
        this.isInitialized = true;
        console.log('✅ WhatsApp service initialized');
        this.startQueueProcessor();
      } else {
        console.log('⚠️ WhatsApp service disabled in configuration');
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
        // Rate limiting: delay between messages
        const delay =
          Math.random() * (twilioConfig.whatsapp.maxDelayMs - twilioConfig.whatsapp.minDelayMs) +
          twilioConfig.whatsapp.minDelayMs;

        await new Promise((resolve) => setTimeout(resolve, delay));

        // Here you would integrate with Twilio's WhatsApp API
        // For now, we'll simulate the message sending
        console.log(`📱 Sending WhatsApp message to ${message.to}: ${message.body}`);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(`✅ WhatsApp message sent successfully to ${message.to}`);
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
    this.setConnectionStatus('connecting');
    try {
      // Simulate bot startup and QR code generation
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation

      const simulatedSuccess = Math.random() > 0.2; // 80% chance of success
      if (simulatedSuccess) {
        this.setConnectionStatus('connected');
        return { success: true };
      } else {
        // Simulate QR code generation
        const dummyQrCode =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWKcDAAAAAXNSR0IArs4c6QAA... (truncated for brevity)'; // Replace with actual QR code generation
        this.setConnectionStatus('disconnected'); // Still disconnected, waiting for QR scan
        return {
          success: false,
          qrCode: dummyQrCode,
          error: 'QR code generated, waiting for scan',
        };
      }
    } catch (error: unknown) {
      this.setConnectionStatus('error');
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async disconnect(): Promise<void> {
    this.setConnectionStatus('disconnected');
    // Simulate disconnection
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
