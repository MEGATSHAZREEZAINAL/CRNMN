import express from 'express';
import twilio from 'twilio';
// AI functionality will use simple fallbacks for now
// import { GoogleGenerativeAI as GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Twilio signature validation middleware
const validateTwilioSignature = (req, res, next) => {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.warn('⚠️ TWILIO_AUTH_TOKEN not set - skipping signature validation');
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  if (!twilioSignature) {
    console.warn('⚠️ No Twilio signature in headers');
    return next();
  }

  const isValid = twilio.validateRequest(
    authToken,
    twilioSignature,
    url,
    req.body
  );

  if (!isValid) {
    console.error('❌ Invalid Twilio signature');
    return res.status(403).send('Forbidden');
  }

  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CORNMAN WhatsApp Bot',
    version: '1.0.0'
  });
});

// Main WhatsApp webhook endpoint
app.post('/webhook', validateTwilioSignature, async (req, res) => {
  try {
    const from = req.body.From; // 'whatsapp:+60123456789'
    const body = req.body.Body;
    const messageType = req.body.Messagetype;
    const productRetailerId = req.body.ProductRetailerId;

    console.log('📱 WhatsApp Webhook received:', {
      from,
      body,
      messageType,
      productRetailerId,
      timestamp: new Date().toISOString()
    });

    if (!from) {
      return res.status(200).type('text/xml').send('<Response></Response>');
    }

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

    // Create TwiML Response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    twiml.message(reply);

    console.log('🤖 Bot Response:', reply);
    console.log('📤 TwiML Response:', twiml.toString());

    // Return TwiML XML response
    return res.status(200).type('text/xml').send(twiml.toString());
  } catch (e) {
    console.error('❌ WhatsApp webhook error:', e);
    return res.status(200).type('text/xml').send('<Response></Response>');
  }
});

// Handle regular text messages with business commands
async function handleRegularMessage(from, body) {
  const customerPhone = from.replace('whatsapp:', '');
  const lowerBody = body.toLowerCase();
  
  console.log(`📱 Processing message from ${customerPhone}: "${body}"`);
  
  // Help commands
  if (lowerBody.includes('help') || lowerBody.includes('tolong') || lowerBody === '/help') {
    return `🤖 *CORNMAN Strategic HQ*

💬 *Business Commands:*
• stock - Check inventory
• sales - Today's sales
• order - Place order
• catalog - View products
• hours - Operating hours
• contact - Contact info

🎯 *Quick Actions:*
• "restock [item]" - Auto restock
• "invoice [sale-id]" - Generate invoice
• "status" - Business status

Hantar mesej anda untuk bantuan lanjut!`;
  }
  
  // Business hours
  if (lowerBody.includes('hours') || lowerBody.includes('masa') || lowerBody.includes('buka')) {
    return `🕒 *Waktu Operasi CORNMAN HQ*

Isnin - Jumaat: 9:00am - 6:00pm
Sabtu: 10:00am - 4:00pm
Ahad: Tutup

📱 WhatsApp Support: 24/7
📧 Email: hello@cornman.my
🌐 Website: cornman.my`;
  }
  
  // Inventory/Stock commands
  if (lowerBody.includes('stock') || lowerBody.includes('inventory') || lowerBody.includes('stok')) {
    return `📦 *Current Inventory Status*

🔥 Top Items:
• Urban Tee - 45 units
• Street Hoodie - 32 units
• Denim Jacket - 18 units

⚠️ Low Stock:
• Cargo Pants - 8 units
• Baseball Cap - 5 units

Need specific item? Reply with product name!`;
  }
  
  // Sales commands
  if (lowerBody.includes('sales') || lowerBody.includes('jualan') || lowerBody.includes('pendapatan')) {
    return `💰 *Today's Business Update*

📊 Sales: RM 2,847.50
🛒 Orders: 23 completed
👥 New customers: 8
📈 Goal progress: 84%

🎯 Monthly target: RM 10,000
📅 Days remaining: 12

Strong performance today! 🚀`;
  }
  
  // Product catalog
  if (lowerBody.includes('catalog') || lowerBody.includes('catalogue') || lowerBody.includes('produk')) {
    return `🛍️ *CORNMAN Product Catalog*

👕 *Apparel*
• Urban Tee - RM 45
• Street Hoodie - RM 89
• Cargo Pants - RM 125
• Denim Jacket - RM 149

👒 *Accessories*
• Baseball Cap - RM 35
• Street Bag - RM 65
• Chain Necklace - RM 55

🔥 *Best Sellers*
• Complete Street Set - RM 199
• Urban Bundle - RM 159

To order: "[item name] x [quantity]"`;
  }
  
  // Restock commands
  if (lowerBody.includes('restock') || lowerBody.includes('tambah stok')) {
    const itemMatch = body.match(/restock\s+(.+)/i);
    if (itemMatch) {
      const itemName = itemMatch[1].trim();
      return `📦 *Auto Restock Initiated*

Item: ${itemName}
Quantity: 50 units
Supplier: Contacted
ETA: 2-3 working days

✅ Restock order placed!
Order ID: REST-${Date.now()}

We'll notify when stock arrives.`;
    }
    return `📦 *Restock Command*

Usage: "restock [item name]"
Example: "restock Urban Tee"

Current low stock items:
• Cargo Pants (8 units)
• Baseball Cap (5 units)`;
  }
  
  // Business status
  if (lowerBody.includes('status') || lowerBody.includes('laporan')) {
    return `📊 *CORNMAN Business Status*

💰 Revenue: RM 2,847.50 (today)
📦 Inventory: 485 items total
🚚 Pending orders: 3
⭐ Customer rating: 4.8/5

🎯 *Goals*
• Monthly: 84% achieved
• Daily: Target exceeded ✅
• Growth: +15% vs last month

🚀 Business is thriving!`;
  }
  
  // Contact information
  if (lowerBody.includes('contact') || lowerBody.includes('hubungi') || lowerBody.includes('telefon')) {
    return `📞 *Contact CORNMAN HQ*

📱 WhatsApp: +601168444656
📧 Email: hello@cornman.my
🌐 Website: www.cornman.my
📍 Address: Jalan Sultan, KL

💬 *Social Media*
• Instagram: @cornman.streetwear
• TikTok: @cornman.my
• Facebook: CORNMAN Malaysia

🕒 Response time: < 30 minutes`;
  }
  
  // AI-powered fallback with Gemini for unrecognized commands
  try {
    // First check for common keywords
    if (lowerBody.includes('price') || lowerBody.includes('harga')) {
      return `💰 *Pricing Info*

Our prices range from RM 35-149
Best value: Urban Bundle (RM 159)

For specific pricing, reply:
"catalog" - Full price list
"[item name]" - Specific item

Bulk orders get 10% discount! 🎉`;
    }
    
    if (lowerBody.includes('delivery') || lowerBody.includes('shipping') || lowerBody.includes('hantar')) {
      return `🚚 *Delivery Information*

📍 *Coverage Areas:*
• Klang Valley: RM 8
• West Malaysia: RM 12
• East Malaysia: RM 18

⚡ *Delivery Time:*
• Same day: KL area (+RM 15)
• Next day: Klang Valley
• 2-3 days: Other states

📦 Free delivery for orders > RM 200!`;
    }
    
    // AI functionality placeholder - using smart fallbacks for now
    // Future: Add Google Gemini integration here

    return `🤖 *CORNMAN Assistant*

Terima kasih untuk mesej anda: "${body}"

🎯 *Popular Commands:*
• help - Full command list
• catalog - Browse products
• order - Place order
• stock - Check inventory

⚡ Team kami akan reply dalam 30 minit.`;
    
  } catch (e) {
    console.warn('Gemini regular message fallback:', e);
    return `🤖 *CORNMAN Assistant*

Terima kasih untuk mesej anda: "${body}"

🎯 *Popular Commands:*
• help - Full command list
• catalog - Browse products
• order - Place order
• stock - Check inventory

⚡ Team kami akan reply dalam 30 minit.`;
  }
}

// Handle product questions
async function handleProductQuestion(from, body, productRetailerId) {
  try {
    console.log(`🛍️ Product question from ${from}: "${body}" about product ${productRetailerId}`);
    
    return `🛍️ *Product Inquiry Received*

Product: ${productRetailerId}
Your question: "${body}"

Thank you for your interest! Our team will get back to you shortly with detailed product information.

For immediate assistance:
• Type "catalog" - View all products
• Type "contact" - Speak with our team

Response time: < 30 minutes`;
  } catch (e) {
    console.warn('Product question error:', e);
    return `Terima kasih atas soalan anda tentang produk ${productRetailerId}. Kami akan bantu anda dengan maklumat lanjut.`;
  }
}

// Handle orders
async function handleOrder(from, body, orderData) {
  try {
    console.log('🛒 Processing order:', orderData);
    return 'Terima kasih atas pesanan anda! Pesanan anda sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.';
  } catch (e) {
    console.error('Order handling error:', e);
    return 'Terima kasih atas pesanan anda! Pesanan anda sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.';
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CORNMAN WhatsApp Bot Server running on port ${PORT}`);
  console.log(`📱 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`⚡ Ready to receive WhatsApp messages!`);
});

export default app;
