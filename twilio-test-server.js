#!/usr/bin/env node
// Simple test server for Twilio without Firebase complexity

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock Twilio responses for testing
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    ok: true,
    hasWhatsAppNumber: true,
    hasSmsNumber: true,
    accountSidMasked: 'AC***test***',
  });
});

app.get('/api/whatsapp/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/whatsapp/send-text', (req, res) => {
  const { to, message, type } = req.body;
  console.log(`📱 ${type.toUpperCase()} to ${to}: ${message}`);

  res.json({
    success: true,
    sid: `SM${Date.now()}`,
    status: 'queued',
  });
});

app.post('/api/whatsapp/send-template', (req, res) => {
  const { to, contentSid } = req.body;
  console.log(`📋 Template ${contentSid} to ${to}`);

  res.json({
    success: true,
    sid: `SM${Date.now()}`,
    status: 'queued',
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Twilio Test Server running on http://localhost:${PORT}`);
  console.log('✅ Ready to handle Twilio API calls');
});
