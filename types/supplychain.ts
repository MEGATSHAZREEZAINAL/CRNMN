export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  paymentTerms: string;
  deliveryTime: number; // days
  minimumOrder?: number;
  products: string[]; // product IDs
  certifications?: string[];
  lastOrderDate?: string;
  totalOrders: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  requestedDate: string;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity?: number;
  status: 'pending' | 'partial' | 'received';
}

export interface Procurement {
  id: string;
  category: string;
  description: string;
  requestedBy: string;
  approvedBy?: string;
  budgetAllocated: number;
  actualCost?: number;
  suppliers: string[]; // supplier IDs
  status: 'requested' | 'approved' | 'sourcing' | 'ordered' | 'received' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedDate: string;
  requiredDate: string;
  completedDate?: string;
  documents?: string[]; // file URLs
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  capacity: number;
  currentUtilization: number;
  zones: WarehouseZone[];
  active: boolean;
  createdAt: string;
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine';
  capacity: number;
  currentStock: number;
  temperature?: number;
  humidity?: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  zoneId: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  unitCost?: number;
  reference: string; // PO number, sale ID, etc.
  reason?: string;
  performedBy: string;
  timestamp: string;
}

export interface QualityCheck {
  id: string;
  type: 'incoming' | 'production' | 'outgoing' | 'random';
  productId: string;
  productName: string;
  batchNumber?: string;
  quantityChecked: number;
  passedQuantity: number;
  failedQuantity: number;
  issues?: string[];
  inspector: string;
  status: 'passed' | 'failed' | 'conditional';
  notes?: string;
  createdAt: string;
}
