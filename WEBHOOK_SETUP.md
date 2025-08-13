# WhatsApp Webhook Setup Guide

## Overview

This guide explains how to set up WhatsApp webhooks to handle product questions and orders from your Twilio integration.

## Webhook Types

### 1. Product Questions (`Messagetype: "text"`)

When customers ask questions about products, Twilio sends a webhook with:

- `Messagetype`: "text"
- `Body`: The customer's question
- `ProductRetailerId`: Product identifier
- `From`: Customer's WhatsApp number

### 2. Orders (`Messagetype: "order"`)

When customers place orders, Twilio sends a webhook with:

- `Messagetype`: "order"
- `Body`: Order comments
- `catalog_id`: Catalog identifier
- `product_items`: Array of ordered products
- `From`: Customer's WhatsApp number

## Webhook Endpoints

### Main Webhook

```
POST /api/whatsapp/webhook
```

Handles all incoming WhatsApp messages and routes them appropriately.

### Catalog Webhook

```
POST /api/whatsapp/catalog-webhook
```

Specifically handles product questions and orders.

### Health Check

```
GET /api/whatsapp/health
```

Returns service health status.

## Setup Instructions

### 1. Configure Twilio Console

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to Messaging > Settings > WhatsApp Sandbox
3. Set your webhook URL to: `https://your-domain.com/api/whatsapp/webhook`

### 2. Test Webhooks

Use the dashboard buttons to test:

- 🛍️ **Test Product Question**: Simulates a product inquiry
- 🛒 **Test Order Webhook**: Simulates an order placement
- 🔍 **Test Health Check**: Verifies service status

### 3. Monitor Webhooks

The dashboard shows:

- Total webhooks received
- Product questions count
- Orders count
- Recent activity

## Webhook Payload Examples

### Product Question

```json
{
  "Messagetype": "text",
  "Body": "What is the price of this product?",
  "ProductRetailerId": "PROD123",
  "From": "whatsapp:+601168444656"
}
```

### Order

```json
{
  "Messagetype": "order",
  "Body": "I want to order these products",
  "catalog_id": "CAT001",
  "product_items": [
    {
      "product_retailer_id": "PROD123",
      "quantity": 2,
      "item_price": 29.99,
      "currency": "USD"
    }
  ],
  "From": "whatsapp:+601168444656"
}
```

## Response Handling

### Product Questions

- AI generates helpful responses in Bahasa Melayu
- Acknowledges the question
- Provides relevant product information
- Offers further assistance

### Orders

- Confirms order details
- Calculates totals
- Provides next steps
- Thanks the customer

## Integration Points

### Database Storage

Webhook data is logged for analytics:

- Message type and content
- Product information
- Order details
- Timestamps

### AI Responses

Uses Google Gemini AI to generate:

- Contextual responses
- Multilingual support (Bahasa Melayu)
- Professional tone
- Actionable next steps

## Troubleshooting

### Common Issues

1. **Webhook not receiving**: Check Twilio console configuration
2. **Signature validation**: Ensure proper authentication
3. **Response format**: Always return 200 status
4. **Rate limiting**: Monitor API usage

### Testing

1. Use dashboard test buttons
2. Check Firebase Functions logs
3. Verify webhook URLs
4. Test with sample payloads

## Next Steps

1. **Deploy Functions**: Upgrade to Firebase Blaze plan
2. **Database Integration**: Connect to Supabase/Firestore
3. **Analytics Dashboard**: Real-time webhook monitoring
4. **Automated Responses**: Enhanced AI processing
5. **Order Management**: Full e-commerce integration

## Support

For issues or questions:

- Check Firebase Functions logs
- Review webhook payloads
- Test individual endpoints
- Monitor Twilio console status
