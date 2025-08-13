#!/usr/bin/env node
// Real Twilio server with actual API integration

import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

// Twilio configuration - use environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'; // Sandbox
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER || '';

let twilioClient = null;

// Initialize Twilio client if credentials are provided
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error.message);
  }
} else {
  console.log('⚠️  Twilio credentials not set - running in mock mode');
  console.log('💡 Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables');
}

// Health check
app.get('/api/whatsapp/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    twilioConnected: !!twilioClient,
  });
});

// Status endpoint
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    ok: !!twilioClient,
    hasWhatsAppNumber: !!TWILIO_WHATSAPP_NUMBER,
    hasSmsNumber: !!TWILIO_SMS_NUMBER,
    accountSidMasked: TWILIO_ACCOUNT_SID ? `${TWILIO_ACCOUNT_SID.substring(0, 8)}***` : 'Not set',
  });
});

// Send message endpoint
app.post('/api/whatsapp/send-text', async (req, res) => {
  const { to, message, type } = req.body;

  if (!twilioClient) {
    return res.status(500).json({
      success: false,
      error:
        'Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.',
    });
  }

  try {
    let messageInstance;

    if (type === 'whatsapp') {
      // WhatsApp message using Twilio Sandbox
      if (!TWILIO_WHATSAPP_NUMBER) {
        return res.status(400).json({
          success: false,
          error: 'WhatsApp number not configured',
        });
      }

      // Ensure phone number has whatsapp: prefix if not already
      const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      messageInstance = await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: toNumber,
      });

      console.log(`📱 WhatsApp sent to ${to}: ${message}`);
    } else {
      // SMS message
      if (!TWILIO_SMS_NUMBER) {
        return res.status(400).json({
          success: false,
          error: 'SMS number not configured',
        });
      }

      messageInstance = await twilioClient.messages.create({
        body: message,
        from: TWILIO_SMS_NUMBER,
        to: to,
      });

      console.log(`📨 SMS sent to ${to}: ${message}`);
    }

    res.json({
      success: true,
      sid: messageInstance.sid,
      status: messageInstance.status,
    });
  } catch (error) {
    console.error(`❌ Failed to send ${type}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send template endpoint
app.post('/api/whatsapp/send-template', async (req, res) => {
  const { to, contentSid, contentVariables } = req.body;

  if (!twilioClient) {
    return res.status(500).json({
      success: false,
      error: 'Twilio not configured',
    });
  }

  try {
    const messageInstance = await twilioClient.messages.create({
      contentSid: contentSid,
      contentVariables: contentVariables ? JSON.stringify(contentVariables) : undefined,
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    console.log(`📋 Template ${contentSid} sent to ${to}`);

    res.json({
      success: true,
      sid: messageInstance.sid,
      status: messageInstance.status,
    });
  } catch (error) {
    console.error('❌ Failed to send template:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Twilio Server running on http://localhost:${PORT}`);
  console.log(`📱 Twilio Status: ${twilioClient ? 'CONNECTED' : 'NOT CONFIGURED'}`);
  console.log(`📞 WhatsApp Number: ${TWILIO_WHATSAPP_NUMBER}`);
  console.log(`📨 SMS Number: ${TWILIO_SMS_NUMBER || 'Not set'}`);

  if (!twilioClient) {
    console.log('\n⚠️  TO SEND REAL MESSAGES:');
    console.log('1. Get Twilio credentials from https://console.twilio.com');
    console.log('2. Set environment variables:');
    console.log('   TWILIO_ACCOUNT_SID=your_account_sid');
    console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
    console.log('   TWILIO_SMS_NUMBER=your_twilio_phone_number');
    console.log('3. Restart this server');
  }
});
