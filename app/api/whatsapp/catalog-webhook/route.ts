/*
// Catalog webhook endpoint for product questions and orders
// File: app/api/whatsapp/catalog-webhook/route.ts

import { NextRequest } from 'next/server';
import { handleCatalogWebhook } from '../../../../utils/webhookHandlers';

export async function POST(request: NextRequest) {
  return await handleCatalogWebhook(request);
}

export async function GET() {
  return new Response('WhatsApp Catalog Webhook Endpoint', { status: 200 });
}
*/
