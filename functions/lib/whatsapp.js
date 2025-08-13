import express from 'express';
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
// Twilio signature validation middleware (optional but recommended)
function validateTwilioSignature(req, res, next) {
    try {
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        const signature = req.headers['x-twilio-signature'];
        if (typeof signature !== 'string') {
            return res.status(400).send('Invalid signature header');
        }
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const params = req.body || {};
        const valid = twilio.validateRequest(authToken, signature, url, params);
        if (!valid)
            return res.status(403).send('Invalid signature');
        next();
    }
    catch (e) {
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
    }
    catch (e) {
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
        const { to, message, type } = req.body || {};
        if (!to || !message)
            return res.status(400).json({ error: 'to_and_message_required' });
        const client = getTwilioClient();
        if (type === 'sms') {
            const fromNumber = process.env.TWILIO_SMS_NUMBER || '';
            if (!fromNumber)
                return res.status(400).json({ error: 'sms_not_configured' });
            const msg = await client.messages.create({ from: fromNumber, to, body: message });
            return res.json({ success: true, sid: msg.sid, status: msg.status });
        }
        const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
        if (!whatsappNumber)
            return res.status(400).json({ error: 'whatsapp_not_configured' });
        const msg = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`,
            to: `whatsapp:${to}`,
            body: message,
        });
        return res.json({ success: true, sid: msg.sid, status: msg.status });
    }
    catch (e) {
        console.error('send-text error:', e?.message || e);
        return res.status(500).json({ error: 'internal_error', details: e?.message || e });
    }
});
// Send WhatsApp template message
router.post('/send-template', async (req, res) => {
    try {
        const { to, contentSid, contentVariables } = req.body ||
            {};
        if (!to || !contentSid)
            return res.status(400).json({ error: 'to_and_contentSid_required' });
        const client = getTwilioClient();
        const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
        if (!whatsappNumber)
            return res.status(400).json({ error: 'whatsapp_not_configured' });
        const msg = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`,
            to: `whatsapp:${to}`,
            contentSid,
            contentVariables: contentVariables ? JSON.stringify(contentVariables) : undefined,
        });
        return res.json({ success: true, sid: msg.sid, status: msg.status });
    }
    catch (e) {
        console.error('send-template error:', e?.message || e);
        return res.status(500).json({ error: 'internal_error', details: e?.message || e });
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
    }
    catch (error) {
        console.error('Catalog webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get webhook analytics
router.get('/webhook-analytics', async (req, res) => {
    try {
        // This would typically fetch from a database
        // For now, return mock data structure
        const analytics = {
            totalWebhooks: 0,
            productQuestions: 0,
            orders: 0,
            recentActivity: [],
        };
        res.json(analytics);
    }
    catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Handle template approval webhooks from Twilio
router.post('/approval-webhook', async (req, res) => {
    try {
        const { EventType, ContentSid, Status, RejectionReason, Category, Language, Components } = req.body;
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
        }
        else if (Status === 'approved') {
            console.log(`✅ Template ${ContentSid} approved successfully!`);
        }
        res.json({ success: true, message: 'Approval webhook processed' });
    }
    catch (error) {
        console.error('Approval webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get template approval status
router.get('/template-status/:contentSid', async (req, res) => {
    try {
        const { contentSid } = req.params;
        // This would typically fetch from Twilio API
        // For now, return mock status
        const status = {
            contentSid,
            status: 'pending', // Mock status
            lastUpdated: new Date().toISOString(),
            category: 'utility',
            language: 'en',
            components: [],
        };
        res.json(status);
    }
    catch (error) {
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
        // This would typically call Twilio API to submit for approval
        // For now, simulate the process
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
        res.json({
            success: true,
            approvalId: mockApprovalId,
            message: 'Template submitted for approval',
        });
    }
    catch (error) {
        console.error('Template submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Inbound webhook from Twilio WhatsApp Sandbox
router.post('/webhook', validateTwilioSignature, async (req, res) => {
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
            fullBody: req.body,
        });
        if (!from)
            return res.status(200).send('<Response></Response>'); // Twilio expects 200
        let reply = 'Terima kasih! Kami akan hubungi anda semula sebentar lagi.';
        // Handle different message types
        if (messageType === 'text' && productRetailerId && body) {
            // Product question webhook
            reply = await handleProductQuestion(from, body, productRetailerId);
        }
        else if (messageType === 'order') {
            // Order webhook
            reply = await handleOrder(from, body || '', req.body);
        }
        else if (body) {
            // Regular text message
            reply = await handleRegularMessage(from, body);
        }
        // Reply back to user via Twilio
        const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
        const client = twilio(accountSid, authToken);
        await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to: from,
            body: reply,
        });
        return res.status(200).send('<Response></Response>');
    }
    catch (e) {
        console.error('WhatsApp webhook error:', e);
        return res.status(200).send('<Response></Response>');
    }
});
// Handle product questions
async function handleProductQuestion(from, body, productRetailerId) {
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
        return (result.text ||
            `Terima kasih atas soalan anda tentang produk ${productRetailerId}. Kami akan bantu anda dengan maklumat lanjut.`);
    }
    catch (e) {
        console.warn('Gemini product question fallback:', e);
        return `Terima kasih atas soalan anda tentang produk ${productRetailerId}. Kami akan bantu anda dengan maklumat lanjut.`;
    }
}
async function handleOrder(from, body, orderData) {
    try {
        console.log('🛒 Processing order:', orderData);
        // Extract order information
        const catalogId = orderData.catalog_id;
        const productItems = orderData.product_items || [];
        if (productItems.length === 0) {
            return 'Terima kasih! Pesanan anda sedang diproses.';
        }
        // Generate order summary
        const totalItems = productItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalAmount = productItems.reduce((sum, item) => {
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
        return (result.text ||
            `Terima kasih atas pesanan anda! Pesanan dengan ${totalItems} item sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.`);
    }
    catch (e) {
        console.warn('Gemini order fallback:', e);
        return 'Terima kasih atas pesanan anda! Pesanan anda sedang diproses. Kami akan hubungi anda untuk pengesahan lanjut.';
    }
}
// Handle regular text messages
async function handleRegularMessage(from, body) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const prompt = `Pengguna WhatsApp (${from}) bertanya: ${body}. Balas ringkas (1-2 ayat) dalam Bahasa Melayu, nada mesra, dan berikan tindakan seterusnya jika sesuai.`;
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } },
        });
        return result.text || 'Terima kasih! Kami akan hubungi anda semula sebentar lagi.';
    }
    catch (e) {
        console.warn('Gemini regular message fallback:', e);
        return 'Terima kasih! Kami akan hubungi anda semula sebentar lagi.';
    }
}
async function storeWebhookData(data) {
    // TODO: Integrate with your database (Supabase, Firebase Firestore, etc.)
    console.log('📊 Storing webhook data:', data);
    // For now, just log the data
    // In production, you'd want to store this in a database for analytics
    return true;
}
// Utility function to format product information
function formatProductInfo(productRetailerId, productItems = []) {
    if (productItems.length > 0) {
        const summary = productItems
            .map((item) => `${item.product_retailer_id} x${item.quantity}`)
            .join(', ');
        return `Products: ${summary}`;
    }
    return `Product: ${productRetailerId}`;
}
// Utility function to calculate order totals
function calculateOrderTotals(productItems) {
    const totalItems = productItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = productItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.item_price || 0), 0);
    return { totalItems, totalAmount };
}
export const whatsappRouter = router;
