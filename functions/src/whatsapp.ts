import express, { Request, Response, NextFunction } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { defineSecret } from 'firebase-functions/params';
import twilio from 'twilio';
import { GoogleGenAI } from '@google/genai';

// Secrets: Twilio sandbox/account for WhatsApp without Meta app
export const WHATSAPP_SECRETS = [
  defineSecret('TWILIO_ACCOUNT_SID'),
  defineSecret('TWILIO_AUTH_TOKEN'),
  defineSecret('TWILIO_WHATSAPP_NUMBER'),
];

const router = express.Router();
// Initialize Firebase Admin once
if (getApps().length === 0) {
  initializeApp();
}
const adminDb = getFirestore();

// Twilio signature validation middleware (optional but recommended)
function validateTwilioSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    const signature = req.headers['x-twilio-signature'];
    if (typeof signature !== 'string') {
      return res.status(400).send('Invalid signature header');
    }
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const params = req.body || {};
    const valid = twilio.validateRequest(authToken, signature, url, params);
    if (!valid) return res.status(403).send('Invalid signature');
    next();
  } catch (e: unknown) {
    return res.status(400).send('Bad request');
  }
}

// Health check
router.get('/health', (_req, res) => res.json({ ok: true }));

// Status endpoint to expose minimal configuration info (non-sensitive)
router.get('/status', async (_req, res) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
    const smsNumber = process.env.TWILIO_SMS_NUMBER || '';
    return res.json({
      ok: true,
      accountSidMasked: accountSid
        ? `${accountSid.slice(0, 4)}********${accountSid.slice(-4)}`
        : '',
      hasWhatsAppNumber: !!whatsappNumber,
      hasSmsNumber: !!smsNumber,
    });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
});

// Helper to create Twilio client
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const authToken = process.env.TWILIO_AUTH_TOKEN || '';
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  return twilio(accountSid, authToken);
}

// Send plain text message (WhatsApp or SMS)
router.post('/send-text', async (req, res) => {
  try {
    const { to, message, type } =
      req.body || ({} as { to?: string; message?: string; type?: 'whatsapp' | 'sms' });
    if (!to || !message) return res.status(400).json({ error: 'to_and_message_required' });
    const client = getTwilioClient();

    if (type === 'sms') {
      const fromNumber = process.env.TWILIO_SMS_NUMBER || '';
      if (!fromNumber) return res.status(400).json({ error: 'sms_not_configured' });
      const msg = await client.messages.create({ from: fromNumber, to, body: message });
      return res.json({ success: true, sid: msg.sid, status: msg.status });
    }

    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
    if (!whatsappNumber) return res.status(400).json({ error: 'whatsapp_not_configured' });
    const msg = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    return res.json({ success: true, sid: msg.sid, status: msg.status });
  } catch (e: unknown) {
    console.error('send-text error:', (e as Error)?.message || e);
    return res.status(500).json({ error: 'internal_error', details: (e as Error)?.message || e });
  }
});

// Send WhatsApp template message
router.post('/send-template', async (req, res) => {
  try {
    const { to, contentSid, contentVariables } =
      req.body ||
      ({} as { to?: string; contentSid?: string; contentVariables?: Record<string, string> });
    if (!to || !contentSid) return res.status(400).json({ error: 'to_and_contentSid_required' });
    const client = getTwilioClient();
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
    if (!whatsappNumber) return res.status(400).json({ error: 'whatsapp_not_configured' });

    const msg = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
      contentSid,
      contentVariables: contentVariables ? JSON.stringify(contentVariables) : undefined,
    });
    return res.json({ success: true, sid: msg.sid, status: msg.status });
  } catch (e: unknown) {
    console.error('send-template error:', (e as Error)?.message || e);
    return res.status(500).json({ error: 'internal_error', details: (e as Error)?.message || e });
  }
});

// Webhook for catalog interactions (product questions and orders)
router.post('/catalog-webhook', async (req, res) => {
  try {
    const { Messagetype, Body, ProductRetailerId, catalog_id, product_items, From } = req.body;

    console.log('🛍️ Catalog Webhook received:', {
      messageType: Messagetype,
      body: Body,
      productRetailerId: ProductRetailerId,
      catalogId: catalog_id,
      productItems: product_items,
      from: From,
    });

    // Store webhook data for analytics
    await storeWebhookData({
      type: Messagetype,
      from: From,
      body: Body,
      productRetailerId: ProductRetailerId,
      catalogId: catalog_id,
      productItems: product_items,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Catalog webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get webhook analytics
router.get('/webhook-analytics', async (req, res) => {
  try {
    const snap = await adminDb.collection('whatsapp_webhooks').orderBy('timestamp', 'desc').limit(50).get();
    const recentActivity = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const totalsAgg = await adminDb.collection('whatsapp_analytics').doc('totals').get();
    const totals = totalsAgg.exists ? (totalsAgg.data() as any) : null;
    res.json({
      totalWebhooks: totals?.totalWebhooks ?? recentActivity.length,
      productQuestions: totals?.productQuestions ?? 0,
      orders: totals?.orders ?? 0,
      recentActivity,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle template approval webhooks from Twilio
router.post('/approval-webhook', async (req, res) => {
  try {
    const { EventType, ContentSid, Status, RejectionReason, Category, Language, Components } =
      req.body;

    console.log('📋 Template Approval Webhook received:', {
      eventType: EventType,
      contentSid: ContentSid,
      status: Status,
      rejectionReason: RejectionReason,
      category: Category,
      language: Language,
      components: Components,
    });

    // Store approval status update
    await storeWebhookData({
      type: 'template_approval',
      from: 'twilio',
      body: `Template ${ContentSid} status: ${Status}`,
      productRetailerId: ContentSid,
      catalogId: Category,
      productItems: [],
      timestamp: new Date().toISOString(),
      metadata: {
        eventType: EventType,
        status: Status,
        rejectionReason: RejectionReason,
        category: Category,
        language: Language,
        components: Components,
      },
    });

    // Log the approval status change
    console.log(`📋 Template ${ContentSid} approval status: ${Status}`);

    if (Status === 'rejected' && RejectionReason) {
      console.log(`❌ Rejection reason: ${RejectionReason}`);
    } else if (Status === 'approved') {
      console.log(`✅ Template ${ContentSid} approved successfully!`);
    }

    res.json({ success: true, message: 'Approval webhook processed' });
  } catch (error) {
    console.error('Approval webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get template approval status
router.get('/template-status/:contentSid', async (req, res) => {
  try {
    const { contentSid } = req.params;

    // TODO: Integrate Twilio Content API to fetch real status
    const statusDoc = await adminDb.collection('whatsapp_templates').doc(contentSid).get();
    if (statusDoc.exists) {
      return res.json(statusDoc.data());
    }
    return res.json({
      contentSid,
      status: 'unknown',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Template status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit template for approval
router.post('/submit-template', async (req, res) => {
  try {
    const { contentSid, category, language, components } = req.body;

    console.log('📋 Submitting template for approval:', {
      contentSid,
      category,
      language,
      components,
    });

    // TODO: Call Twilio Content API to submit for approval
    const mockApprovalId = `approval_${Date.now()}`;

    // Store submission record
    await storeWebhookData({
      type: 'template_submission',
      from: 'system',
      body: `Template ${contentSid} submitted for ${category} approval`,
      productRetailerId: contentSid,
      catalogId: category,
      productItems: [],
      timestamp: new Date().toISOString(),
      metadata: {
        approvalId: mockApprovalId,
        category,
        language,
        components,
      },
    });

    await adminDb.collection('whatsapp_templates').doc(contentSid).set({
      contentSid,
      status: 'submitted',
      lastUpdated: new Date().toISOString(),
      category,
      language,
      components,
      approvalId: mockApprovalId,
    }, { merge: true });

    res.json({ success: true, approvalId: mockApprovalId, message: 'Template submitted for approval' });
  } catch (error) {
    console.error('Template submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inbound webhook from Twilio WhatsApp Sandbox
router.post('/webhook', validateTwilioSignature, async (req, res) => {
  try {
    const from = req.body.From as string | undefined; // 'whatsapp:+60123456789'
    const body = req.body.Body as string | undefined;
    const messageType = req.body.Messagetype as string | undefined;
    const productRetailerId = req.body.ProductRetailerId as string | undefined;

    console.log('📱 WhatsApp Webhook received:', {
      from,
      body,
      messageType,
      productRetailerId,
      fullBody: req.body,
    });

    if (!from) return res.status(200).type('text/xml').send('<Response></Response>');

    let reply = 'Terima kasih! Kami akan hubungi anda semula sebentar lagi.';

    // Handle different message types
    if (messageType === 'text' && productRetailerId && body) {
      // Product question webhook
      reply = await handleProductQuestion(from, body, productRetailerId);
    } else if (messageType === 'order') {
      // Order webhook
      reply = await handleOrder(from, body || '', req.body);
    } else if (body) {
      // Regular text message
      reply = await handleRegularMessage(from, body);
    }

    // Create TwiML Response using Twilio helper library
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    
    // Add message to TwiML response
    twiml.message(reply);

    // Return proper TwiML XML response
    return res.status(200).type('text/xml').send(twiml.toString());
  } catch (e) {
    console.error('WhatsApp webhook error:', e);
    // Return empty TwiML response on error
    return res.status(200).type('text/xml').send('<Response></Response>');
  }
});

// Handle product questions
async function handleProductQuestion(
  from: string,
  body: string,
  productRetailerId: string,
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

    const prompt = `Customer ${from} asked about product ${productRetailerId}: "${body}". 
    Provide a helpful, friendly response in Bahasa Melayu (1-2 sentences) that:
    1. Acknowledges their question
    2. Provides relevant product information
    3. Offers to help further or direct them to place an order
    
    Keep it conversational and helpful.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    return (
      result.text ||
      `Terima kasih atas soalan anda tentang produk ${productRetailerId}. Kami akan bantu anda dengan maklumat lanjut.`
    );
  } catch (e) {
    console.warn('Gemini product question fallback:', e);
    return `Terima kasih atas soalan anda tentang produk ${productRetailerId}. Kami akan bantu anda dengan maklumat lanjut.`;
  }
}

// Handle orders
interface OrderData {
  catalog_id?: string;
  product_items?: ProductItem[];
}

interface ProductItem {
  product_retailer_id: string;
  quantity: number;
  item_price: number;
}

async function handleOrder(from: string, body: string, orderData: OrderData): Promise<string> {
  try {
    console.log('🛒 Processing order:', orderData);

    // Extract order information
    const catalogId = orderData.catalog_id;
    const productItems = orderData.product_items || [];

    if (productItems.length === 0) {
      return 'Terima kasih! Pesanan anda sedang diproses.';
    }

    // Generate order summary
    const totalItems = productItems.reduce(
      (sum: number, item: ProductItem) => sum + (item.quantity || 0),
      0,
    );
    const totalAmount = productItems.reduce((sum: number, item: ProductItem) => {
      return sum + (item.quantity || 0) * (item.item_price || 0);
    }, 0);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

    const prompt = `Customer ${from} placed an order with ${totalItems} items totaling ${totalAmount} USD. 
    Order details: ${JSON.stringify(productItems)}.
    
    Generate a friendly confirmation message in Bahasa Melayu that:
    1. Thanks them for their order
    2. Confirms the order details
    3. Provides next steps (order processing, delivery timeline, etc.)
    
    Keep it warm and professional.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    return (
      result.text ||
      `Terima kasih atas pesanan anda! Pesanan dengan ${totalItems} item sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.`
    );
  } catch (e) {
    console.warn('Gemini order fallback:', e);
    return 'Terima kasih atas pesanan anda! Pesanan anda sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.';
  }
}

// Handle regular text messages
async function handleRegularMessage(from: string, body: string): Promise<string> {
  const customerPhone = from.replace('whatsapp:', '');
  const lowerBody = body.toLowerCase();
  
  console.log(`📱 Processing regular message from ${customerPhone}: "${body}"`);
  
  // Help commands
  if (lowerBody.includes('help') || lowerBody.includes('tolong') || lowerBody === '/help') {
    return `🤖 *CORNMAN Strategic HQ*\n\n💬 *Business Commands:*\n• stock - Check inventory\n• sales - Today's sales\n• order - Place order\n• catalog - View products\n• hours - Operating hours\n• contact - Contact info\n\n🎯 *Quick Actions:*\n• "restock [item]" - Auto restock\n• "invoice [sale-id]" - Generate invoice\n• "status" - Business status\n\nHantar mesej anda untuk bantuan lanjut!`;
  }
  
  // Business hours
  if (lowerBody.includes('hours') || lowerBody.includes('masa') || lowerBody.includes('buka')) {
    return `🕒 *Waktu Operasi CORNMAN HQ*\n\nIsnin - Jumaat: 9:00am - 6:00pm\nSabtu: 10:00am - 4:00pm\nAhad: Tutup\n\n📱 WhatsApp Support: 24/7\n📧 Email: hello@cornman.my\n🌐 Website: cornman.my`;
  }
  
  // Inventory/Stock commands
  if (lowerBody.includes('stock') || lowerBody.includes('inventory') || lowerBody.includes('stok')) {
    return `📦 *Current Inventory Status*\n\n🔥 Top Items:\n• Urban Tee - 45 units\n• Street Hoodie - 32 units\n• Denim Jacket - 18 units\n\n⚠️ Low Stock:\n• Cargo Pants - 8 units\n• Baseball Cap - 5 units\n\nNeed specific item? Reply with product name!`;
  }
  
  // Sales commands
  if (lowerBody.includes('sales') || lowerBody.includes('jualan') || lowerBody.includes('pendapatan')) {
    return `💰 *Today's Business Update*\n\n📊 Sales: RM 2,847.50\n🛒 Orders: 23 completed\n👥 New customers: 8\n📈 Goal progress: 84%\n\n🎯 Monthly target: RM 10,000\n📅 Days remaining: 12\n\nStrong performance today! 🚀`;
  }
  
  // Order/Purchase commands
  if (lowerBody.includes('order') || lowerBody.includes('beli') || lowerBody.includes('purchase')) {
    return `🛒 *Place Your Order*\n\n📋 *How to order:*\n1. Browse catalog: Reply "catalog"\n2. Select items: "[item] x [qty]"\n3. Confirm order: We'll send invoice\n4. Payment: Bank transfer/TNG\n5. Delivery: 1-3 working days\n\n💳 *Payment Methods:*\n• Maybank: 512345678901\n• Touch 'n Go: 01168444656\n• Cash on delivery (+RM5)\n\nReady to order? Reply "catalog"!`;
  }
  
  // Product catalog
  if (lowerBody.includes('catalog') || lowerBody.includes('catalogue') || lowerBody.includes('produk')) {
    return `🛍️ *CORNMAN Product Catalog*\n\n👕 *Apparel*\n• Urban Tee - RM 45\n• Street Hoodie - RM 89\n• Cargo Pants - RM 125\n• Denim Jacket - RM 149\n\n👒 *Accessories*\n• Baseball Cap - RM 35\n• Street Bag - RM 65\n• Chain Necklace - RM 55\n\n🔥 *Best Sellers*\n• Complete Street Set - RM 199\n• Urban Bundle - RM 159\n\nTo order: "[item name] x [quantity]"`;
  }
  
  // Restock commands
  if (lowerBody.includes('restock') || lowerBody.includes('tambah stok')) {
    const itemMatch = body.match(/restock\s+(.+)/i);
    if (itemMatch) {
      const itemName = itemMatch[1].trim();
      return `📦 *Auto Restock Initiated*\n\nItem: ${itemName}\nQuantity: 50 units\nSupplier: Contacted\nETA: 2-3 working days\n\n✅ Restock order placed!\nOrder ID: REST-${Date.now()}\n\nWe'll notify when stock arrives.`;
    }
    return `📦 *Restock Command*\n\nUsage: "restock [item name]"\nExample: "restock Urban Tee"\n\nCurrent low stock items:\n• Cargo Pants (8 units)\n• Baseball Cap (5 units)`;
  }
  
  // Business status
  if (lowerBody.includes('status') || lowerBody.includes('laporan')) {
    return `📊 *CORNMAN Business Status*\n\n💰 Revenue: RM 2,847.50 (today)\n📦 Inventory: 485 items total\n🚚 Pending orders: 3\n⭐ Customer rating: 4.8/5\n\n🎯 *Goals*\n• Monthly: 84% achieved\n• Daily: Target exceeded ✅\n• Growth: +15% vs last month\n\n🚀 Business is thriving!`;
  }
  
  // Contact information
  if (lowerBody.includes('contact') || lowerBody.includes('hubungi') || lowerBody.includes('telefon')) {
    return `📞 *Contact CORNMAN HQ*\n\n📱 WhatsApp: +601168444656\n📧 Email: hello@cornman.my\n🌐 Website: www.cornman.my\n📍 Address: Jalan Sultan, KL\n\n💬 *Social Media*\n• Instagram: @cornman.streetwear\n• TikTok: @cornman.my\n• Facebook: CORNMAN Malaysia\n\n🕒 Response time: < 30 minutes`;
  }
  
  // AI-powered fallback with Gemini for unrecognized commands
  try {
    // First check for common keywords
    if (lowerBody.includes('price') || lowerBody.includes('harga')) {
      return `💰 *Pricing Info*\n\nOur prices range from RM 35-149\nBest value: Urban Bundle (RM 159)\n\nFor specific pricing, reply:\n"catalog" - Full price list\n"[item name]" - Specific item\n\nBulk orders get 10% discount! 🎉`;
    }
    
    if (lowerBody.includes('delivery') || lowerBody.includes('shipping') || lowerBody.includes('hantar')) {
      return `🚚 *Delivery Information*\n\n📍 *Coverage Areas:*\n• Klang Valley: RM 8\n• West Malaysia: RM 12\n• East Malaysia: RM 18\n\n⚡ *Delivery Time:*\n• Same day: KL area (+RM 15)\n• Next day: Klang Valley\n• 2-3 days: Other states\n\n📦 Free delivery for orders > RM 200!`;
    }
    
    // Use Gemini AI for complex queries
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const prompt = `Sebagai CORNMAN Business Assistant, balas pertanyaan pelanggan WhatsApp ini dalam Bahasa Melayu yang mesra dan profesional: "${body}". Jika berkaitan business/produk, berikan maklumat berguna. Jika soalan am, jawab ringkas dan arahkan ke command "help" untuk bantuan lanjut.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    return result.text || `🤖 *CORNMAN Assistant*\n\nTerima kasih untuk mesej: "${body}"\n\n💬 Untuk bantuan lanjut, taip "help"\n⚡ Team kami akan reply dalam 30 minit.`;
    
  } catch (e) {
    console.warn('Gemini regular message fallback:', e);
    return `🤖 *CORNMAN Assistant*\n\nTerima kasih untuk mesej anda: "${body}"\n\n🎯 *Popular Commands:*\n• help - Full command list\n• catalog - Browse products\n• order - Place order\n• stock - Check inventory\n\n⚡ Team kami akan reply dalam 30 minit.`;
  }
}

// Helper function to store webhook data (placeholder for database integration)
interface WebhookData {
  type: string;
  from: string;
  body: string;
  productRetailerId?: string;
  catalogId?: string;
  productItems?: ProductItem[];
  timestamp: string;
  metadata?: Record<string, unknown>;
}

async function storeWebhookData(data: WebhookData) {
  try {
    await adminDb.collection('whatsapp_webhooks').add(data);
    await adminDb
      .collection('whatsapp_analytics')
      .doc('totals')
      .set(
        {
          totalWebhooks: (adminDb as any).FieldValue?.increment
            ? (adminDb as any).FieldValue.increment(1)
            : undefined,
        },
        { merge: true },
      );
    return true;
  } catch (e) {
    console.log('📊 Storing webhook data (fallback log):', data);
    return true;
  }
}

// Minimal logs endpoint for dashboard (recent messages)
router.get('/logs', async (_req, res) => {
  try {
    const snap = await adminDb.collection('whatsapp_webhooks').orderBy('timestamp', 'desc').limit(100).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json([]);
  }
});

// Utility function to format product information
function formatProductInfo(productRetailerId: string, productItems: ProductItem[] = []) {
  if (productItems.length > 0) {
    const summary = productItems
      .map((item: ProductItem) => `${item.product_retailer_id} x${item.quantity}`)
      .join(', ');
    return `Products: ${summary}`;
  }
  return `Product: ${productRetailerId}`;
}

// Utility function to calculate order totals
function calculateOrderTotals(productItems: ProductItem[]) {
  const totalItems = productItems.reduce((sum: number, item: ProductItem) => sum + (item.quantity || 0), 0);
  const totalAmount = productItems.reduce(
    (sum: number, item: ProductItem) => sum + (item.quantity || 0) * (item.item_price || 0),
    0,
  );

  return { totalItems, totalAmount };
}

export const whatsappRouter = router;
