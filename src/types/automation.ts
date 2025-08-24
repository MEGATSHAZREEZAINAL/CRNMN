export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  status: 'active' | 'inactive' | 'draft';
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  config: {
    schedule?: string; // cron expression
    event?: string; // event name
    webhook?: string; // webhook URL
  };
}

export interface WorkflowAction {
  id: string;
  type: 'email' | 'sms' | 'webhook' | 'database' | 'notification' | 'api-call';
  name: string;
  config: { [key: string]: unknown };
  order: number;
  enabled: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'greater' | 'less' | 'contains' | 'exists';
  value: unknown;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'inventory' | 'orders' | 'customers' | 'marketing' | 'finance';
  trigger: {
    event: string;
    conditions: WorkflowCondition[];
  };
  actions: {
    type: string;
    config: { [key: string]: unknown };
  }[];
  enabled: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  schedule: string; // cron expression
  action: string;
  config: { [key: string]: unknown };
  status: 'active' | 'paused' | 'failed';
  nextRun: string;
  lastRun?: string;
  lastResult?: {
    success: boolean;
    message?: string;
    duration: number; // milliseconds
  };
  createdAt: string;
}
