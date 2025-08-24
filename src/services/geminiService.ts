import { GoogleGenAI } from '@google/genai';
import { offlineStorage } from './offlineStorage';
import type {
  RevenueAnalytics,
  SalesAnalytics,
  InventoryAnalytics,
  CustomerAnalytics,
  BusinessInsights,
} from './analytics';

// In backend mode, calls are proxied through Firebase Functions.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL || '';

if (!API_KEY) {
  // This is a check to ensure the API key is available.
  // In the target environment, process.env.GEMINI_API_KEY will be set.
  console.warn('API_KEY environment variable not set. Using a placeholder.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY_IS_NOT_SET' });

// Offline cache for AI responses
const responseCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const hashPrompt = async (prompt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(prompt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const getCachedResponse = async (prompt: string): Promise<string | null> => {
  try {
    const hash = await hashPrompt(prompt);
    const cached = responseCache.get(hash);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached response for prompt');
      return cached.data;
    }

    // Clean up expired cache entries
    if (cached && Date.now() - cached.timestamp >= CACHE_DURATION) {
      responseCache.delete(hash);
    }

    return null;
  } catch (error) {
    console.error('Error accessing cache:', error);
    return null;
  }
};

const setCachedResponse = async (prompt: string, response: string): Promise<void> => {
  try {
    const hash = await hashPrompt(prompt);
    responseCache.set(hash, {
      data: response,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

// Offline fallback responses for common business scenarios
const offlineFallbacks: Record<string, string> = {
  strategic:
    'CADANGAN STRATEGIK: Fokus pada produk terlaris dan pastikan stok mencukupi. Monitor cash flow dan customer feedback untuk growth strategy seterusnya.',
  inventory:
    'AMARAN OPERASI: Semak stok item popular dan buat restock plan. Pastikan supply chain tidak terganggu untuk mengelakkan lost sales.',
  marketing:
    'CADANGAN MARKETING: Gunakan social media untuk promote produk trending. Focus pada customer engagement dan feedback untuk improve brand loyalty.',
  sales:
    'INSIGHT JUALAN: Analyze peak hours dan customer behavior. Optimize pricing strategy dan explore upselling opportunities untuk maximize revenue.',
  general:
    'SISTEM OFFLINE: Data tersimpan secara lokal. Semua maklumat akan sync automatically bila connection pulih. Teruskan operasi seperti biasa.',
};

const getOfflineFallback = (prompt: string): string => {
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes('strategic') || promptLower.includes('strategi')) {
    return offlineFallbacks.strategic;
  }
  if (promptLower.includes('inventory') || promptLower.includes('stok')) {
    return offlineFallbacks.inventory;
  }
  if (promptLower.includes('marketing') || promptLower.includes('social')) {
    return offlineFallbacks.marketing;
  }
  if (promptLower.includes('sales') || promptLower.includes('jualan')) {
    return offlineFallbacks.sales;
  }

  return offlineFallbacks.general;
};

const handleApiError = (
  error: unknown,
  defaultMessage: string,
  rateLimitMessage: string,
): string => {
  console.error('Error calling Google AI API:', error);
  const errorMessage = JSON.stringify(error);
  if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
    return rateLimitMessage;
  }
  return defaultMessage;
};

export const generateBusinessInsights = async (
  revenue: RevenueAnalytics,
  sales: SalesAnalytics,
  inventory: InventoryAnalytics,
  customers: CustomerAnalytics,
): Promise<BusinessInsights> => {
  const prompt = `
    Analyze the following business data and provide actionable insights and recommendations.
    Format the output as a JSON object with the following structure:
    {
      "profitMargin": number,
      "operatingExpenses": number,
      "netProfit": number,
      "cashFlow": number,
      "breakEvenPoint": number,
      "seasonalTrends": Array<{
        "period": string,
        "trend": "up" | "down" | "stable",
        "impact": number
      }>,
      "recommendations": Array<{
        "category": string,
        "priority": "high" | "medium" | "low",
        "suggestion": string,
        "impact": string
      }>,
      "kpis": Array<{
        "metric": string,
        "current": number,
        "target": number,
        "status": "above" | "below" | "on-track"
      }>
    }

    Here is the data:
    Revenue: ${JSON.stringify(revenue)}
    Sales: ${JSON.stringify(sales)}
    Inventory: ${JSON.stringify(inventory)}
    Customers: ${JSON.stringify(customers)}
  `;

  try {
    const response = await generateGeminiContent(prompt);
    // In a real app, you would have more robust parsing and error handling
    const insights = JSON.parse(response);
    return insights;
  } catch (error) {
    console.error('Error parsing business insights:', error);
    // Return a default or cached version of insights
    return {
      profitMargin: 0,
      operatingExpenses: 0,
      netProfit: 0,
      cashFlow: 0,
      breakEvenPoint: 0,
      seasonalTrends: [],
      recommendations: [],
      kpis: [],
    };
  }
};

export const generateGeminiContent = async (prompt: string): Promise<string> => {
  // If backend proxy is available, use it and avoid exposing the key
  if (import.meta.env.VITE_USE_BACKEND === 'true') {
    try {
      const resp = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!resp.ok) throw new Error('backend_error');
      const data = await resp.json();
      return String(data.text || '');
    } catch (e) {
      console.warn('Backend proxy failed, falling back to client mode', e);
    }
  }

  if (!API_KEY) {
    return Promise.resolve(
      'Ralat: API Key tidak ditetapkan. Sila tetapkan VITE_GEMINI_API_KEY atau aktifkan backend proxy.',
    );
  }

  // Check in-memory cache first
  const cachedResponse = await getCachedResponse(prompt);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Check offline storage for persistent cache
  try {
    const offlineCached = await offlineStorage.getCachedAIResponse(prompt);
    if (offlineCached) {
      // Update in-memory cache
      await setCachedResponse(prompt, offlineCached);
      return `[CACHE] ${offlineCached}`;
    }
  } catch (error) {
    console.warn('Failed to check offline cache:', error);
  }

  // If offline, return contextual fallback
  if (!navigator.onLine) {
    const fallback = getOfflineFallback(prompt);
    return `[OFFLINE] ${fallback}`;
  }

  // Always use fallback content to avoid API key issues in demo
  console.log('Using fallback AI content (API disabled for demo)');
  const fallbackContent = getOfflineFallback(prompt);
  
  // Cache the fallback response
  await setCachedResponse(prompt, fallbackContent);
  try {
    await offlineStorage.saveAIInsight(prompt, fallbackContent);
  } catch (error) {
    console.warn('Failed to save AI response to offline storage:', error);
  }
  
  return fallbackContent;

  // Original API code disabled for demo mode - using fallback only
};

export const generateImage = async (prompt: string): Promise<string> => {
  // Prefer backend proxy for image generation to avoid exposing key and large payloads
  if (import.meta.env.VITE_USE_BACKEND === 'true') {
    try {
      const resp = await fetch(`${API_BASE}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!resp.ok) throw new Error('backend_error');
      const data = await resp.json();
      return String(data.imageDataUrl || '');
    } catch (e) {
      console.warn('Backend proxy failed, falling back to client mode', e);
    }
  }

  // Demo mode - always return placeholder
  console.log('Demo mode: Image generation requested for:', prompt);
  return '/api/placeholder/400/300';
};
