export interface Region {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  regulations: string[];
  supported: boolean;
  launchedAt?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  region: string;
  category: 'data-privacy' | 'tax' | 'food-safety' | 'financial' | 'environmental';
  description: string;
  requirements: string[];
  deadline?: string;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-applicable';
  lastAssessment: string;
  responsible: string;
  evidence?: string[]; // document URLs
}

export interface DataPrivacy {
  id: string;
  regulation: 'GDPR' | 'CCPA' | 'PDPA' | 'LGPD' | 'PIPEDA';
  consentRecords: ConsentRecord[];
  dataRequests: DataRequest[];
  breaches: DataBreach[];
  policies: PrivacyPolicy[];
  complianceScore: number; // 0-100
}

export interface ConsentRecord {
  id: string;
  userId: string;
  type: 'marketing' | 'analytics' | 'functional' | 'essential';
  granted: boolean;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  source: string;
}

export interface DataRequest {
  id: string;
  userId: string;
  type: 'access' | 'deletion' | 'portability' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  reason?: string;
}

export interface DataBreach {
  id: string;
  type: 'unauthorized-access' | 'data-loss' | 'system-compromise' | 'human-error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedRecords: number;
  affectedUsers: string[];
  discoveredAt: string;
  reportedAt?: string;
  resolvedAt?: string;
  notificationsSent: boolean;
  authoritiesNotified: boolean;
  description: string;
  mitigationSteps: string[];
}

export interface PrivacyPolicy {
  id: string;
  version: string;
  effectiveDate: string;
  region: string;
  content: string;
  changes?: string[];
  approvedBy: string;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface TaxConfiguration {
  id: string;
  region: string;
  taxType: string;
  rate: number;
  threshold?: number;
  exemptions?: string[];
  calculationMethod: 'inclusive' | 'exclusive';
  reportingFrequency: 'monthly' | 'quarterly' | 'annually';
  filingDeadline: string;
  active: boolean;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userRole: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: { [key: string]: unknown };
}

export interface SecurityCompliance {
  id: string;
  standard: 'ISO27001' | 'SOC2' | 'PCI-DSS' | 'NIST' | 'OWASP';
  controls: SecurityControl[];
  assessmentDate: string;
  nextAssessment: string;
  certificationStatus: 'certified' | 'in-progress' | 'expired' | 'not-applicable';
  auditor?: string;
  complianceScore: number; // 0-100
}

export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: string;
  implemented: boolean;
  effectiveDate?: string;
  evidence?: string[];
  responsible: string;
  reviewFrequency: 'monthly' | 'quarterly' | 'annually';
  lastReview: string;
  nextReview: string;
}
