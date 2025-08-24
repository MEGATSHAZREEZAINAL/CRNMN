# 🚀 CORNMAN Strategic HQ - Twilio WhatsApp Integration Guide

## Overview

This guide covers the complete setup and usage of the Twilio WhatsApp Business API integration in CORNMAN Strategic HQ. The system provides comprehensive WhatsApp messaging capabilities, template management, webhook handling, and business automation.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Twilio Console Configuration](#twilio-console-configuration)
6. [WhatsApp Business API Setup](#whatsapp-business-api-setup)
7. [Testing the Integration](#testing-the-integration)
8. [Webhook Management](#webhook-management)
9. [Template Management](#template-management)
10. [Business Commands](#business-commands)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

## 📖 Prerequisites

Before starting, ensure you have:

- ✅ Twilio Account (Sign up at [twilio.com](https://twilio.com))
- ✅ WhatsApp Business Account (for production)
- ✅ Supabase Project (for database)
- ✅ Domain with HTTPS (for webhooks)
- ✅ Node.js 18+ and npm/yarn

## 🛠️ Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/cornman---strategic-hq.git
cd cornman---strategic-hq
npm install
```

### 2. Install Additional Twilio Dependencies

```bash
npm install twilio
npm install @types/node  # If using TypeScript
```

## ⚙️ Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Update your `.env.local` file with the following:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Twilio Configuration
VITE_TWILIO_ENVIRONMENT=test      # 'test' or 'live'
VITE_TWILIO_WHATSAPP_NUMBER=+14155238886  # Twilio WhatsApp sandbox number
VITE_TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Test Environment Credentials (for development)
VITE_TWILIO_TEST_ACCOUNT_SID=YOUR_TWILIO_TEST_ACCOUNT_SID
VITE_TWILIO_TEST_AUTH_TOKEN=your-test-auth-token

# Live Environment Credentials (for production)
VITE_TWILIO_LIVE_ACCOUNT_SID=YOUR_TWILIO_LIVE_ACCOUNT_SID
VITE_TWILIO_LIVE_AUTH_TOKEN=your-live-auth-token

# For webhook validation (server-side)
TWILIO_AUTH_TOKEN=your-current-auth-token
```

### 3. Obtain Twilio Credentials

#### Test Credentials (Development)

1. Login to [Twilio Console](https://console.twilio.com/)
2. Go to **Account → API keys & tokens**
3. Copy your **Account SID** and **Auth Token**

#### Live Credentials (Production)

1. Create a new Twilio project for production
2. Upgrade your account for WhatsApp Business API access
3. Get separate credentials for production use

## 🗄️ Database Setup

### 1. Run Database Schema

1. Open [Supabase SQL Editor](https://supabase.com/dashboard)
2. Copy and execute the SQL from `database/webhook-schema.sql`
3. Verify all tables are created successfully

### 2. Verify Tables Created

The following tables should be created:

- `webhook_events` - Logs all webhook events
- `product_inquiries` - Customer product questions
- `whatsapp_orders` - Orders from WhatsApp
- `whatsapp_order_items` - Order line items
- `message_logs` - All sent messages
- `template_approvals` - Template approval tracking
- `catalog_interactions` - Product catalog interactions
- `webhook_metrics` - Daily analytics

## 📱 Twilio Console Configuration

### 1. WhatsApp Sandbox Setup (Development)

1. Go to **Console → Messaging → Try it out → WhatsApp Sandbox**
2. Follow the instructions to join the sandbox:
   - Send the provided message to `+1 415 523 8886`
   - Example: `join <your-sandbox-code>`
3. Note your sandbox number: `+1 415 523 8886`

### 2. Configure Sandbox Webhook

1. In the WhatsApp Sandbox settings
2. Set **"When a message comes in"** to:
   ```
   https://your-domain.com/api/whatsapp/webhook
   ```
3. Set HTTP method to **POST**
4. Save configuration

### 3. WhatsApp Business API (Production)

For production use:

1. Apply for [WhatsApp Business API](https://www.twilio.com/whatsapp)
2. Complete business verification process
3. Set up your WhatsApp Business phone number
4. Configure production webhooks

## 🚀 WhatsApp Business API Setup

### 1. Template Creation

WhatsApp requires pre-approved templates for outbound messages:

```typescript
// Example: Create a welcome template
const result = await twilioService.createContentTemplate(
  'welcome_message', // friendly name
  'en', // language
  {
    // variables
    '1': 'customer_name',
    '2': 'business_name',
  },
);
```

### 2. Template Approval Process

```typescript
// Submit template for WhatsApp approval
const approval = await twilioService.submitTemplateForApproval(
  'HX350d429d32e64a552466cafecbe95f3c', // content SID
  {
    category: 'utility',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        text: 'Welcome to {{1}}',
      },
      {
        type: 'BODY',
        text: 'Hi {{1}}, welcome to {{2}}! We are here to help you.',
      },
    ],
  },
);
```

## 🧪 Testing the Integration

### 1. Start Development Server

```bash
npm run dev
```

### 2. Access Dashboard

Open `http://localhost:5173` and navigate to the Twilio Dashboard

### 3. Initialize Service

1. Click **"Initialize Test Environment"**
2. Verify status shows as **Connected**

### 4. Send Test Message

1. Select **WhatsApp** as message type
2. Enter recipient number (your WhatsApp number)
3. Type a test message
4. Click **"Send Test Message"**

### 5. Test Business Commands

Try these business commands:

- `help` - Show available commands
- `status jualan` - Get sales status
- `check stok` - Check inventory levels
- `revenue harini` - Today's revenue

## 🔗 Webhook Management

### 1. Webhook Endpoints

The system provides several webhook endpoints:

| Endpoint                        | Purpose                    |
| ------------------------------- | -------------------------- |
| `/api/whatsapp/webhook`         | Main WhatsApp messages     |
| `/api/whatsapp/catalog-webhook` | Product questions & orders |
| `/api/whatsapp/health`          | Health check monitoring    |

### 2. Webhook Security

Enable webhook signature validation:

```typescript
// In your webhook handler
const signature = request.headers.get('X-Twilio-Signature');
const isValid = validateTwilioSignature(
  body,
  signature,
  process.env.TWILIO_AUTH_TOKEN,
  request.url,
);
```

### 3. Testing Webhooks

Use the dashboard to test webhook endpoints:

- **Product Question Test** - Simulates customer product inquiry
- **Order Test** - Simulates WhatsApp order placement
- **Health Check** - Verifies webhook endpoint health

## 📄 Template Management

### 1. Content Types

Twilio supports various content types:

- `twilio/text` - Plain text messages
- `twilio/media` - Images, videos, documents
- `twilio/quick-reply` - Quick reply buttons
- `twilio/list-picker` - Selection lists
- `twilio/catalog` - Product catalogs

### 2. Approval Requirements

| Content Type       | Outbound             | Inbound Reply     |
| ------------------ | -------------------- | ----------------- |
| twilio/text        | ✅ Requires approval | ✅ Always allowed |
| twilio/media       | ✅ Requires approval | ✅ Always allowed |
| twilio/catalog     | ✅ Requires approval | ✅ Always allowed |
| twilio/quick-reply | ✅ Requires approval | ✅ Always allowed |

### 3. Template Status Tracking

Monitor template approval status:

```typescript
const status = await twilioService.getTemplateApprovalStatus(contentSid);
// Returns: unsubmitted, received, pending, approved, rejected, paused, disabled
```

## 🤖 Business Commands

### Default Commands (Bahasa Melayu)

| Command             | Description       | Response                       |
| ------------------- | ----------------- | ------------------------------ |
| `help`              | Show command list | Display all available commands |
| `status jualan`     | Sales status      | Latest sales information       |
| `check stok`        | Check inventory   | Stock levels and alerts        |
| `stok rendah`       | Low stock alert   | Items below threshold          |
| `revenue harini`    | Today's revenue   | Daily revenue summary          |
| `order stok [item]` | Restock order     | Create restock request         |

### Custom Commands

Add custom business commands in `TwilioService.processBusinessCommand()`:

```typescript
case 'custom_command':
  return await this.handleCustomCommand(sender);
```

### Multi-language Support

Commands support both English and Bahasa Melayu:

- `help` or `bantuan`
- `check stok` or `semak stok`

## 📊 Monitoring & Analytics

### 1. Dashboard Metrics

The dashboard shows real-time metrics:

- Total webhook events
- Product inquiries
- Order placements
- Message success rates

### 2. Database Analytics

Query webhook metrics:

```sql
-- Daily webhook analytics
SELECT * FROM daily_webhook_analytics
ORDER BY date DESC LIMIT 7;

-- Product inquiry trends
SELECT DATE(created_at) as date, COUNT(*) as inquiries
FROM product_inquiries
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 3. Message Logs

All messages are logged for auditing:

```sql
SELECT * FROM message_logs
WHERE sent_at >= NOW() - INTERVAL '24 hours'
ORDER BY sent_at DESC;
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Failed

```
❌ Failed to initialize Twilio service
```

**Solution:**

- Verify Account SID and Auth Token in environment variables
- Check if credentials are for correct environment (test/live)

#### 2. Webhook Not Receiving Messages

```
❌ Webhook endpoint not responding
```

**Solution:**

- Verify webhook URL is publicly accessible (HTTPS required)
- Check Twilio Console webhook configuration
- Test webhook endpoint manually

#### 3. Template Not Approved

```
❌ Template message failed - not approved
```

**Solution:**

- Check template approval status
- Ensure template follows WhatsApp Business Policy
- Wait for approval (can take up to 24 hours)

#### 4. Message Delivery Failed

```
❌ Message delivery failed
```

**Solution:**

- Verify recipient has WhatsApp installed
- Check phone number format (+country_code...)
- For sandbox: ensure recipient has joined sandbox

### Debug Mode

Enable detailed logging:

```typescript
// In TwilioService
console.log('🔍 Debug:', {
  payload,
  result,
  status,
});
```

### Health Checks

Monitor system health:

```bash
curl https://your-domain.com/api/whatsapp/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-08-10T19:30:00Z",
  "twilio": {
    "initialized": true,
    "hasWhatsApp": true,
    "hasSMS": true
  }
}
```

## 🚀 Production Deployment

### 1. Environment Setup

1. Set environment to `live`:

   ```env
   VITE_TWILIO_ENVIRONMENT=live
   ```

2. Use production Twilio credentials
3. Configure production webhook URLs
4. Enable webhook signature validation

### 2. WhatsApp Business Verification

1. Complete WhatsApp Business verification
2. Submit required business documents
3. Wait for approval (can take several days)

### 3. Security Checklist

- ✅ Enable webhook signature validation
- ✅ Use HTTPS for all endpoints
- ✅ Implement rate limiting
- ✅ Monitor for suspicious activity
- ✅ Regular credential rotation
- ✅ Database access controls (RLS)

## 📞 Support

### Documentation

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Business Policy](https://developers.facebook.com/docs/whatsapp/policy)
- [Twilio Console](https://console.twilio.com/)

### Getting Help

1. Check the troubleshooting section above
2. Review Twilio Console logs
3. Test webhook endpoints manually
4. Contact Twilio Support for API issues

---

**🌽 Built with ❤️ by the CORNMAN Team**

_"Connecting businesses, one message at a time."_
