/*
import { NextRequest, NextResponse } from 'next/server';
import twilioService from '../services/twilioService';
import { supabase } from '../services/supabase';

// Type definitions for Twilio webhook payloads
interface TwilioWebhookPayload {
  AccountSid: string;
  ApiVersion: string;
  Body?: string;
  From: string;
  MessageSid: string;
  MessagingServiceSid?: string;
  NumMedia: string;
  NumSegments: string;
  SmsMessageSid: string;
  SmsSid: string;
  SmsStatus: string;
  To: string;
  MessageStatus?: string;
  EventType?: string;
  Timestamp?: string;
}

interface WhatsAppWebhookPayload extends TwilioWebhookPayload {
  ProfileName?: string;
  WaId?: string;
  MessageType?: string;
  ProductRetailerId?: string;
  ProductTitle?: string;
  ProductDescription?: string;
  ProductPrice?: string;
  CatalogId?: string;
  ProductItems?: string; // JSON string of product items
}

interface ProductQuestion {
  productId: string;
  question: string;
  customerPhone: string;
  customerName?: string;
  timestamp: string;
}

interface ProductOrder {
  orderId: string;
  customerPhone: string;
  customerName?: string;
  products: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
    currency: string;
  }>;
  totalAmount: number;
  timestamp: string;
}

// Webhook signature validation
export function validateTwilioSignature(
  payload: string,
  signature: string,
  authToken: string,
  url: string
): boolean {
  const crypto = require('crypto');
  
  // Create the expected signature
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(url + payload, 'utf8'))
    .digest('base64');
  
  return expectedSignature === signature;
}

// Main WhatsApp webhook handler
export async function handleWhatsAppWebhook(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const payload: WhatsAppWebhookPayload = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      payload[key] = value.toString();
    }

    console.log('📥 Received WhatsApp webhook:', payload);

    // Validate webhook signature (optional but recommended)
    const signature = request.headers.get('X-Twilio-Signature');
    if (signature && process.env.TWILIO_AUTH_TOKEN) {
      const url = request.url;
      const body = await request.text();
      
      if (!validateTwilioSignature(body, signature, process.env.TWILIO_AUTH_TOKEN, url)) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Process different message types
    const response = await processWhatsAppMessage(payload);
    
    // Log webhook event
    await logWebhookEvent(payload);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error handling WhatsApp webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Process WhatsApp messages based on type
async function processWhatsAppMessage(payload: WhatsAppWebhookPayload): Promise<any> {
  const { Body, From, MessageType, ProfileName } = payload;
  
  try {
    // Extract customer info
    const customerPhone = From.replace('whatsapp:', '');
    const customerName = ProfileName || 'Unknown Customer';

    // Handle different message types
    switch (MessageType?.toLowerCase()) {
      case 'text':
        return await handleTextMessage(payload);
      
      case 'product_inquiry':
        return await handleProductInquiry(payload);
      
      case 'order':
        return await handleProductOrder(payload);
      
      case 'interactive':
        return await handleInteractiveMessage(payload);
        
      default:
        // Handle regular text messages with business commands
        if (Body) {
          const response = await twilioService.processBusinessCommand(Body, customerPhone);
          
          // Send response back to customer
          await twilioService.sendWhatsApp(customerPhone, response);
          
          return { status: 'processed', message: 'Business command handled' };
        }
        
        return { status: 'ignored', message: 'Unknown message type' };
    }
  } catch (error) {
    console.error('❌ Error processing WhatsApp message:', error);
    return { status: 'error', error: error.message };
  }
}

// Handle text messages
async function handleTextMessage(payload: WhatsAppWebhookPayload): Promise<any> {
  const { Body, From } = payload;
  const customerPhone = From.replace('whatsapp:', '');
  
  if (!Body) {
    return { status: 'ignored', message: 'No text body' };
  }

  try {
    // Process business command
    const response = await twilioService.processBusinessCommand(Body, customerPhone);
    
    // Send response
    const result = await twilioService.sendWhatsApp(customerPhone, response);
    
    if (result.success) {
      return { 
        status: 'responded', 
        message: 'Business command processed and response sent',
        messageId: result.messageId 
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error handling text message:', error);
    return { status: 'error', error: error.message };
  }
}

// Handle product inquiries
async function handleProductInquiry(payload: WhatsAppWebhookPayload): Promise<any> {
  const { From, Body, ProductRetailerId, ProductTitle, ProductPrice } = payload;
  const customerPhone = From.replace('whatsapp:', '');
  
  try {
    // Log the product inquiry
    const inquiry: ProductQuestion = {
      productId: ProductRetailerId || 'unknown',
      question: Body || 'Product inquiry',
      customerPhone,
      customerName: payload.ProfileName,
      timestamp: new Date().toISOString()
    };

    await logProductInquiry(inquiry);

    // Generate AI response about the product
    let response = `🛍️ *Product Inquiry Received*\n\n`;
    
    if (ProductTitle) {
      response += `Product: ${ProductTitle}\n`;
    }
    
    if (ProductPrice) {
      response += `Price: ${ProductPrice}\n`;
    }
    
    response += `\nYour question: "${Body}"\n\n`;
    response += `Thank you for your interest! Our team will get back to you shortly. `;
    response += `For immediate assistance, you can also call us or visit our store.`;

    // Send response to customer
    const result = await twilioService.sendWhatsApp(customerPhone, response);

    return { 
      status: 'inquiry_logged', 
      message: 'Product inquiry logged and response sent',
      messageId: result.messageId,
      inquiry 
    };
  } catch (error) {
    console.error('❌ Error handling product inquiry:', error);
    return { status: 'error', error: error.message };
  }
}

// Handle product orders
async function handleProductOrder(payload: WhatsAppWebhookPayload): Promise<any> {
  const { From, ProductItems, CatalogId } = payload;
  const customerPhone = From.replace('whatsapp:', '');
  
  try {
    // Parse product items
    let products = [];
    let totalAmount = 0;
    
    if (ProductItems) {
      try {
        const items = JSON.parse(ProductItems);
        products = items.map((item: any) => {
          const itemTotal = item.quantity * item.item_price;
          totalAmount += itemTotal;
          
          return {
            productId: item.product_retailer_id,
            title: item.title || `Product ${item.product_retailer_id}`,
            quantity: item.quantity,
            price: item.item_price,
            currency: item.currency || 'USD'
          };
        });
      } catch (parseError) {
        console.error('❌ Error parsing product items:', parseError);
      }
    }

    // Create order record
    const order: ProductOrder = {
      orderId: `ORD-${Date.now()}`,
      customerPhone,
      customerName: payload.ProfileName,
      products,
      totalAmount,
      timestamp: new Date().toISOString()
    };

    await logProductOrder(order);

    // Send order confirmation
    let response = `🛒 *Order Received!*\n\n`;
    response += `Order ID: ${order.orderId}\n`;
    response += `Total Items: ${products.length}\n`;
    response += `Total Amount: ${totalAmount.toFixed(2)} ${products[0]?.currency || 'USD'}\n\n`;
    
    response += `*Items Ordered:*\n`;
    products.forEach(product => {
      response += `• ${product.title} x${product.quantity} - ${product.price} ${product.currency}\n`;
    });
    
    response += `\nWe'll process your order and contact you for payment and delivery details. `;
    response += `Thank you for choosing us! 🙏`;

    const result = await twilioService.sendWhatsApp(customerPhone, response);

    return { 
      status: 'order_processed', 
      message: 'Order logged and confirmation sent',
      messageId: result.messageId,
      order 
    };
  } catch (error) {
    console.error('❌ Error handling product order:', error);
    return { status: 'error', error: error.message };
  }
}

// Handle interactive messages (buttons, lists, etc.)
async function handleInteractiveMessage(payload: WhatsAppWebhookPayload): Promise<any> {
  const { From, Body } = payload;
  const customerPhone = From.replace('whatsapp:', '');
  
  try {
    // Process the interactive response as a business command
    const response = await twilioService.processBusinessCommand(Body || 'help', customerPhone);
    const result = await twilioService.sendWhatsApp(customerPhone, response);

    return { 
      status: 'interactive_handled', 
      message: 'Interactive message processed',
      messageId: result.messageId 
    };
  } catch (error) {
    console.error('❌ Error handling interactive message:', error);
    return { status: 'error', error: error.message };
  }
}

// Logging functions
async function logWebhookEvent(payload: WhatsAppWebhookPayload): Promise<void> {
  try {
    await supabase
      .from('webhook_events')
      .insert({
        event_type: 'whatsapp_message',
        payload: payload,
        from_number: payload.From,
        to_number: payload.To,
        message_sid: payload.MessageSid,
        message_type: payload.MessageType || 'text',
        processed_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('❌ Error logging webhook event:', error);
  }
}

async function logProductInquiry(inquiry: ProductQuestion): Promise<void> {
  try {
    await supabase
      .from('product_inquiries')
      .insert({
        product_id: inquiry.productId,
        customer_phone: inquiry.customerPhone,
        customer_name: inquiry.customerName,
        question: inquiry.question,
        status: 'pending',
        created_at: inquiry.timestamp
      });
  } catch (error) {
    console.error('❌ Error logging product inquiry:', error);
  }
}

async function logProductOrder(order: ProductOrder): Promise<void> {
  try {
    // Insert order record
    const { data: orderRecord } = await supabase
      .from('whatsapp_orders')
      .insert({
        order_id: order.orderId,
        customer_phone: order.customerPhone,
        customer_name: order.customerName,
        total_amount: order.totalAmount,
        currency: order.products[0]?.currency || 'USD',
        status: 'pending',
        created_at: order.timestamp
      })
      .select()
      .single();

    // Insert order items
    if (orderRecord && order.products.length > 0) {
      const orderItems = order.products.map(product => ({
        order_id: orderRecord.id,
        product_id: product.productId,
        product_title: product.title,
        quantity: product.quantity,
        unit_price: product.price,
        total_price: product.quantity * product.price,
        currency: product.currency
      }));

      await supabase
        .from('whatsapp_order_items')
        .insert(orderItems);
    }
  } catch (error) {
    console.error('❌ Error logging product order:', error);
  }
}

// Health check endpoint
export async function handleHealthCheck(): Promise<NextResponse> {
  const status = twilioService.getStatus();
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    twilio: {
      initialized: status.initialized,
      hasWhatsApp: status.hasWhatsApp,
      hasSMS: status.hasSMS
    },
    version: '1.0.0'
  });
}

// Catalog webhook handler specifically for product interactions
export async function handleCatalogWebhook(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await request.json();
    
    console.log('📦 Received catalog webhook:', payload);

    // Handle product questions and orders specifically
    let response;
    
    if (payload.MessageType === 'text' && payload.ProductRetailerId) {
      // Product question
      response = await handleProductInquiry(payload);
    } else if (payload.MessageType === 'order' || payload.product_items) {
      // Product order
      response = await handleProductOrder(payload);
    } else {
      // Regular message processing
      response = await processWhatsAppMessage(payload);
    }

    await logWebhookEvent(payload);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error handling catalog webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export default {
  handleWhatsAppWebhook,
  handleCatalogWebhook,
  handleHealthCheck,
  validateTwilioSignature
};
*/
