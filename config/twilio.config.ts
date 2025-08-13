export const twilioConfig = {
  // Default Twilio configuration
  default: {
    accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
    authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
    whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || '+14155238886',
    phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '+18126338712',
    environment: (import.meta.env.VITE_TWILIO_ENVIRONMENT as 'test' | 'live') || 'test',
  },

  // Test environment configuration
  test: {
    accountSid: import.meta.env.VITE_TWILIO_TEST_ACCOUNT_SID || '',
    authToken: import.meta.env.VITE_TWILIO_TEST_AUTH_TOKEN || '',
    whatsappNumber: '+14155238886', // Twilio WhatsApp sandbox
    phoneNumber: import.meta.env.VITE_TWILIO_TEST_PHONE_NUMBER || '',
    environment: 'test' as const,
  },

  // Live environment configuration
  live: {
    accountSid: import.meta.env.VITE_TWILIO_LIVE_ACCOUNT_SID || '',
    authToken: import.meta.env.VITE_TWILIO_LIVE_AUTH_TOKEN || '',
    whatsappNumber: import.meta.env.VITE_TWILIO_LIVE_WHATSAPP_NUMBER || '',
    phoneNumber: import.meta.env.VITE_TWILIO_LIVE_PHONE_NUMBER || '',
    environment: 'live' as const,
  },

  // WhatsApp Bot configuration
  whatsapp: {
    enabled: import.meta.env.VITE_WHATSAPP_BOT_ENABLED === 'true',
    sessionPath: import.meta.env.VITE_WHATSAPP_SESSION_PATH || './whatsapp-sessions',
    messagePerMinute: 20,
    minDelayMs: 800,
    maxDelayMs: 2400,
    reconnectAttempts: 5,
  },

  // Webhook configuration
  webhook: {
    secret: import.meta.env.VITE_WEBHOOK_SECRET || 'default-secret-change-in-production',
    endpoints: {
      main: '/api/whatsapp/webhook',
      catalog: '/api/whatsapp/catalog-webhook',
      health: '/api/whatsapp/health',
      template: '/api/whatsapp/submit-template',
      status: '/api/whatsapp/template-status',
    },
  },

  // Content API configuration
  content: {
    baseUrl: 'https://content.twilio.com/v1',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'ms', 'zh'],
  },
};

export default twilioConfig;
