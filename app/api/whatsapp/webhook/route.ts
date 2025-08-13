/*
// Main WhatsApp webhook endpoint
// File: app/api/whatsapp/webhook/route.ts

import { NextRequest } from 'next/server';
import { handleWhatsAppWebhook } from '../../../../utils/webhookHandlers';

export async function POST(request: NextRequest) {
  return await handleWhatsAppWebhook(request);
}

export async function GET(request: NextRequest) {
  // Webhook verification for Twilio
  const { searchParams } = new URL(request.url);
  const hubChallenge = searchParams.get('hub.challenge');
  
  if (hubChallenge) {
    return new Response(hubChallenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  return new Response('WhatsApp Webhook Endpoint', { status: 200 });
}
*/
