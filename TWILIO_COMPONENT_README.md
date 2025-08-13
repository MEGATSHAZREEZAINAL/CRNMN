# Twilio Component - CORNMAN Strategic HQ

## Overview

The Twilio component provides a comprehensive dashboard for managing Twilio communications, including SMS, WhatsApp messaging, and webhook handling. It's designed to work with both test and live Twilio environments.

## Features

- 📱 **SMS Management**: Send and track SMS messages
- 💬 **WhatsApp Integration**: Send WhatsApp messages and handle business commands
- 🔗 **Webhook Handling**: Process incoming messages and events
- 📊 **Dashboard**: Real-time message logs and account information
- 🧪 **Testing Tools**: Connection testing and validation
- 🔐 **Security**: Webhook signature validation and secure credential management

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your Twilio credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual Twilio credentials:

```env
# Test Environment (Recommended for development)
VITE_TWILIO_ENVIRONMENT=test
VITE_TWILIO_TEST_ACCOUNT_SID=YOUR_TWILIO_TEST_ACCOUNT_SID
VITE_TWILIO_TEST_AUTH_TOKEN=your-test-auth-token
VITE_TWILIO_TEST_PHONE_NUMBER=+18126338712

# WhatsApp Bot
VITE_WHATSAPP_BOT_ENABLED=true
VITE_TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm run dev
```

### 4. Access the Dashboard

Navigate to the Twilio Dashboard component in your application.

## Configuration

### Environment Variables

| Variable                       | Description                   | Required       |
| ------------------------------ | ----------------------------- | -------------- |
| `VITE_TWILIO_ENVIRONMENT`      | Environment: 'test' or 'live' | Yes            |
| `VITE_TWILIO_TEST_ACCOUNT_SID` | Test account SID              | Yes (for test) |
| `VITE_TWILIO_TEST_AUTH_TOKEN`  | Test auth token               | Yes (for test) |
| `VITE_TWILIO_LIVE_ACCOUNT_SID` | Live account SID              | Yes (for live) |
| `VITE_TWILIO_LIVE_AUTH_TOKEN`  | Live auth token               | Yes (for live) |
| `VITE_TWILIO_WHATSAPP_NUMBER`  | WhatsApp number               | Yes            |
| `VITE_TWILIO_PHONE_NUMBER`     | SMS phone number              | Yes            |
| `VITE_WHATSAPP_BOT_ENABLED`    | Enable WhatsApp bot           | No             |

### WhatsApp Business Commands

The component supports the following business commands in Bahasa Melayu:

- `help` / `bantuan` - Show available commands
- `status jualan` - Check sales status
- `check stok` / `stok rendah` - Check inventory levels
- `revenue harini` - Get today's revenue
- `order stok [nama]` - Place restock order

## Usage

### Sending Messages

1. **SMS Message**:

   ```typescript
   const result = await twilioService.sendSMS(
     '+1234567890',
     'Hello from CORNMAN!',
     '+18126338712', // Optional from number
   );
   ```

2. **WhatsApp Message**:

   ```typescript
   const result = await twilioService.sendWhatsApp('+1234567890', 'Hello from CORNMAN WhatsApp!');
   ```

3. **WhatsApp Template**:
   ```typescript
   const result = await twilioService.sendWhatsAppTemplate('+1234567890', 'template_sid', {
     variable1: 'value1',
   });
   ```

### Webhook Handling

The component automatically handles incoming webhooks for:

- Text messages
- Product inquiries
- Product orders
- Interactive messages

### Testing Connections

```typescript
// Test Twilio connection
const twilioResult = await twilioService.testConnection();

// Test WhatsApp connection
const whatsappResult = await whatsappService.testConnection();
```

## Architecture

### Services

- **`twilioService.ts`**: Core Twilio functionality
- **`whatsappService.ts`**: WhatsApp-specific features
- **`webhookHandlers.ts`**: Webhook processing logic

### Components

- **`TwilioDashboard.tsx`**: Main dashboard interface
- **Webhook Routes**: API endpoints for handling webhooks

### Configuration

- **`twilio.config.ts`**: Centralized configuration management
- **Environment Variables**: Secure credential storage

## Security Features

- 🔐 Webhook signature validation
- 🛡️ Environment-based credential management
- 🚫 Rate limiting for WhatsApp messages
- 📝 Comprehensive logging and monitoring

## Troubleshooting

### Common Issues

1. **"Service not initialized"**
   - Check environment variables
   - Verify Twilio credentials
   - Run connection test

2. **"Phone number not configured"**
   - Set `VITE_TWILIO_PHONE_NUMBER`
   - Check environment configuration

3. **"WhatsApp service not initialized"**
   - Enable `VITE_WHATSAPP_BOT_ENABLED`
   - Verify WhatsApp number configuration

### Debug Mode

Enable debug logging by setting:

```env
VITE_DEBUG=true
```

### Testing

Run the validation script:

```bash
node test-twilio-simple.js
```

## Development

### Adding New Features

1. **New Message Types**: Extend `processWhatsAppMessage` in webhook handlers
2. **Business Commands**: Add to `processBusinessCommand` in Twilio service
3. **Webhook Endpoints**: Create new routes in `app/api/whatsapp/`

### Code Style

- Use TypeScript for type safety
- Follow existing error handling patterns
- Add comprehensive logging
- Include error boundaries

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review environment configuration
3. Test with the validation script
4. Check Twilio console for account status

## License

This component is part of CORNMAN Strategic HQ and follows the project's licensing terms.

---

🌽 **CORNMAN Strategic HQ** - Empowering strategic business operations through intelligent communication tools.
