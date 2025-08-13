import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

// The API key is provided via environment variable at deploy time using Secret Manager binding
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Make sure to bind the secret before deploying.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    return res.json({ text: response.text || '' });
  } catch (err: unknown) {
    console.error('Error /api/generate:', (err as Error)?.message || err);
    if (String(err).includes('429')) return res.status(429).json({ error: 'rate_limited' });
    return res.status(500).json({ error: 'internal_error' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
    });

    const image0 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!image0) return res.status(500).json({ error: 'no_image_returned' });
    return res.json({ imageDataUrl: `data:image/jpeg;base64,${image0}` });
  } catch (err: unknown) {
    console.error('Error /api/generate-image:', (err as Error)?.message || err);
    if (String(err).includes('429')) return res.status(429).json({ error: 'rate_limited' });
    return res.status(500).json({ error: 'internal_error' });
  }
});

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { whatsappRouter, WHATSAPP_SECRETS } from './whatsapp.js';

// Declare secret so Firebase injects it securely at runtime
const GEMINI_API_KEY_SECRET = defineSecret('GEMINI_API_KEY');

// Mount WhatsApp router
app.use('/api/whatsapp', whatsappRouter);

export const api = onRequest(
  {
    region: 'asia-southeast1',
    secrets: [GEMINI_API_KEY_SECRET, ...WHATSAPP_SECRETS],
    invoker: 'public',
  },
  app,
);
