# WhatsApp Business Platform with Twilio - Implementation Guide

## Overview

This guide covers the implementation of WhatsApp Business Platform using Twilio, including template approval, webhook handling, and best practices for business messaging.

## Key Concepts

### WhatsApp Messaging Products

- **WhatsApp Consumer app**: Global user messaging
- **WhatsApp Business app**: Small business messaging
- **WhatsApp Business Platform**: Enterprise API access (via Twilio)

### Opt-in Requirements

⚠️ **Critical**: WhatsApp requires explicit user opt-ins for business-initiated messages

- Gather opt-ins via web pages, mobile apps, SMS, or account settings
- Respect opt-out requests to maintain account quality
- Sending without opt-in may result in account suspension

## Phone Number Configuration

### E.164 Format

All WhatsApp addresses use the format: `whatsapp:<E.164 phone number>`

### Enabling WhatsApp on Twilio Numbers

1. **Self-Signup Process**: Follow Twilio's Self-Signup Guide for WhatsApp
2. **ISV Program**: For third-party implementations, follow WhatsApp Tech Provider Program
3. **Meta Business Manager**: Connect your Meta Business Manager account for scaling

### Phone Number Limits (as of January 2023)

- **Unverified Meta Business Manager**: Max 2 phone numbers per Meta Business Manager
- **Verified Meta Business Manager**: Max 20 phone numbers (can request up to 50)
- **Official Business Account (OBA)**: Up to 1000 WABAs

## Template Approval System

### Approval Statuses

| Status        | Description                            |
| ------------- | -------------------------------------- |
| `unsubmitted` | Not submitted for approval             |
| `received`    | Received by Twilio, not yet reviewed   |
| `pending`     | Under WhatsApp review (up to 24 hours) |
| `approved`    | Approved and ready for use             |
| `rejected`    | Rejected during review                 |
| `paused`      | Paused due to user feedback            |
| `disabled`    | Disabled due to policy violations      |

### Content Type Approval Requirements

#### Always Allowed for Inbound Replies

- `twilio/text` - Text messages
- `twilio/media` - Media messages
- `twilio/quick-reply` - Quick reply buttons
- `twilio/list-picker` - List selection
- `twilio/catalog` - Product catalogs
- `twilio/pay` - Payment messages

#### Requires Approval for Outbound

- All content types require approval for business-initiated messages
- Review process takes up to 24 hours
- Categories: Utility, Marketing, Authentication

#### Conditional Approval for Inbound

- `twilio/call-to-action` - Based on button types
- `twilio/card` - Based on button types
- `whatsapp/card` - Based on button types

#### Always Requires Approval

- `twilio/carousel` - Carousel messages
- `twilio/flows` - Flow-based messages
- `whatsapp/authentication` - Authentication messages

## Implementation Components

### 1. Template Submission

```typescript
// Submit template for WhatsApp approval
const submitTemplate = async (
  contentSid: string,
  approvalData: {
    category: 'authentication' | 'utility' | 'marketing';
    language: string;
    components: Array<{
      type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
      text?: string;
      format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
      buttons?: Array<{
        type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'COPY_CODE';
        text: string;
        url?: string;
        phone?: string;
      }>;
    }>;
  },
) => {
  // Implementation using Twilio Content API
};
```

### 2. Approval Status Monitoring

```typescript
// Check template approval status
const checkStatus = async (contentSid: string) => {
  const status = await twilioService.getTemplateApprovalStatus(contentSid);
  return status;
};

// Setup webhook for real-time status updates
const setupWebhook = async (webhookUrl: string, events: string[]) => {
  return await twilioService.setupApprovalWebhook(webhookUrl, events);
};
```

### 3. Message Sending Logic

```typescript
// Check if template can be used
const canSendOutbound = (templateStatus: string, contentType: string) => {
  return twilioService.canUseTemplateForOutbound(templateStatus, contentType);
};

const canReplyInbound = (templateStatus: string, contentType: string) => {
  return twilioService.canUseTemplateForInboundReply(templateStatus, contentType);
};
```

## Webhook Configuration

### Inbound Message Webhooks

Configure webhook URLs for receiving customer messages:

- **Sandbox**: Configure on Sandbox page
- **Production**: Configure on WhatsApp-enabled number settings
- **Messaging Service**: Configure under Integration section

### Status Callback Webhooks

Monitor outbound message status in real-time:

- Set `StatusCallback` URL when sending messages
- Receive status updates: queued → sent → delivered/failed
- Handle error codes and delivery confirmations

### Approval Webhooks

Monitor template approval status changes:

- `approval.status.updated` - Status changes
- `approval.created` - New approval requests
- `approval.completed` - Approval process completed

## Message Types and Examples

### Freeform Messages (Within 24-hour session)

```typescript
// Send text message
const message = await client.messages.create({
  body: 'Hello, there!',
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+15005550006',
});

// Send media message
const mediaMessage = await client.messages.create({
  body: "Here's that picture you requested.",
  from: 'whatsapp:+14155238886',
  mediaUrl: ['https://demo.twilio.com/owl.png'],
  to: 'whatsapp:+15017122661',
});
```

### Template Messages (Out of session)

```typescript
// Send approved template
const templateMessage = await client.messages.create({
  contentSid: 'HX...', // Approved template SID
  contentVariables: JSON.stringify({
    '1': 'John',
    '2': 'Order #12345',
  }),
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+15005550006',
});
```

## Best Practices

### 1. Opt-in Management

- Implement clear opt-in collection
- Provide easy opt-out mechanism
- Track opt-in/opt-out status in database
- Respect user preferences

### 2. Template Design

- Keep messages concise and relevant
- Use appropriate categories (Utility, Marketing, Authentication)
- Test templates thoroughly before submission
- Follow WhatsApp's content policies

### 3. Error Handling

- Handle webhook failures gracefully
- Implement retry logic for failed messages
- Monitor delivery status and error codes
- Log all interactions for debugging

### 4. Rate Limiting

- Respect WhatsApp's rate limits
- Implement message queuing for high volume
- Monitor account health and quality scores
- Avoid spam-like behavior

## Security Considerations

### Webhook Validation

```typescript
// Validate Twilio webhook signatures
import { validateRequest } from 'twilio';

const isValidRequest = validateRequest(authToken, signature, url, params);
```

### Environment Variables

```bash
# Store sensitive data securely
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886
```

## Monitoring and Analytics

### Key Metrics to Track

- Message delivery rates
- Template approval success rates
- User engagement and response rates
- Webhook response times
- Error rates and types

### Dashboard Implementation

```typescript
// Real-time monitoring
const analytics = {
  totalWebhooks: 0,
  productQuestions: 0,
  orders: 0,
  templateApprovals: 0,
  recentActivity: [],
};
```

## Troubleshooting

### Common Issues

1. **Template Rejection**: Review content against WhatsApp policies
2. **Webhook Failures**: Check URL accessibility and response times
3. **Rate Limiting**: Implement proper queuing and throttling
4. **Authentication Errors**: Verify credentials and permissions

### Support Resources

- Twilio Console documentation
- WhatsApp Business Platform policies
- Twilio support tickets for complex issues
- Community forums and developer resources

## Next Steps

1. **Complete Template Submission**: Implement full approval workflow
2. **Webhook Integration**: Connect approval webhooks to your system
3. **User Management**: Implement opt-in/opt-out tracking
4. **Analytics Dashboard**: Build comprehensive monitoring system
5. **Production Deployment**: Move from sandbox to production environment

## API Endpoints

### Template Management

- `POST /api/whatsapp/submit-template` - Submit for approval
- `GET /api/whatsapp/template-status/:contentSid` - Check status
- `POST /api/whatsapp/approval-webhook` - Handle approval updates

### Webhook Management

- `POST /api/whatsapp/webhook` - Main webhook endpoint
- `POST /api/whatsapp/catalog-webhook` - Catalog interactions
- `GET /api/whatsapp/webhook-analytics` - Webhook analytics

This implementation provides a solid foundation for WhatsApp Business Platform integration with proper template approval workflows, webhook handling, and user management.
