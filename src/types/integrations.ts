export interface Integration {
  id: string;
  name: string;
  type: 'accounting' | 'crm' | 'erp' | 'payment' | 'shipping' | 'marketing' | 'api';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'configuring';
  config: { [key: string]: unknown };
  features: string[];
  lastSync?: string;
  syncFrequency?: string; // cron expression
  dataMapping?: { [key: string]: string };
  webhookUrl?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  description?: string;
  headers?: { [key: string]: string };
  authentication: {
    type: 'none' | 'api-key' | 'bearer' | 'basic' | 'oauth';
    config: { [key: string]: unknown };
  };
  rateLimit?: {
    requests: number;
    period: string; // '1m', '1h', '1d'
  };
  active: boolean;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
}

export interface DataSync {
  id: string;
  integrationId: string;
  integrationName: string;
  type: 'import' | 'export' | 'bidirectional';
  entity: string; // 'products', 'orders', 'customers', etc.
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors?: string[];
  progress: number; // 0-100
  triggeredBy: 'manual' | 'schedule' | 'webhook';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  headers?: { [key: string]: string };
  retryConfig: {
    maxRetries: number;
    retryDelay: number; // milliseconds
  };
  deliveryStats: {
    total: number;
    successful: number;
    failed: number;
    lastDelivery?: string;
  };
  createdAt: string;
}

export interface ThirdPartyService {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  websiteUrl: string;
  documentationUrl?: string;
  pricingModel: 'free' | 'freemium' | 'paid' | 'enterprise';
  features: string[];
  integrationComplexity: 'simple' | 'moderate' | 'complex';
  requiredFields: {
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }[];
  supportedEvents?: string[];
  rateLimit?: string;
  status: 'available' | 'beta' | 'deprecated';
}

export interface DataTransformation {
  id: string;
  name: string;
  description?: string;
  sourceFormat: string;
  targetFormat: string;
  rules: TransformationRule[];
  active: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransformationRule {
  id: string;
  field: string;
  operation: 'map' | 'transform' | 'filter' | 'validate' | 'calculate';
  config: { [key: string]: unknown };
  order: number;
}
