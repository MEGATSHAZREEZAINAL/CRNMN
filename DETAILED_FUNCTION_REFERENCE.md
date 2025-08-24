# 📚 CORNMAN STRATEGIC HQ - DETAILED FUNCTION REFERENCE

## 🔥 **AUTHENTICATION & SECURITY FUNCTIONS**

### **🔐 Firebase Services (`src/services/firebase.ts`)**

```typescript
// Firebase Configuration
const firebaseConfig = {
  apiKey: string,
  authDomain: string,
  projectId: string,
  // ... other config
}

// Exported Services
export const auth = getAuth(app)          // Firebase Auth instance
export const db = getFirestore(app)      // Firestore database
export const storage = getStorage(app)   // File storage
export const functions = getFunctions(app) // Cloud functions
export const rtdb = getDatabase(app)     // Realtime database
```

**📝 Purpose**: Initialize dan export semua Firebase services untuk app
**🎯 Usage**: Import anywhere yang perlu Firebase functionality
**⚠️ Status**: DISABLED EMULATORS (production-like mode)

### **👤 Authentication Context (`src/contexts/AuthContext.tsx`)**

#### **Main Functions:**

```typescript
// Hook untuk access auth state
export const useAuth = (): AuthContextType
```
- **Return**: User state, loading, error, dan semua auth methods
- **Error**: Throws error kalau used outside AuthProvider

```typescript
// Main auth provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children })
```
- **Props**: `children: React.ReactNode`
- **Purpose**: Wrap app dengan authentication context
- **Features**: Auto-login check, demo mode fallback

```typescript
// Protected route wrapper
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = <div>Access denied</div>
})
```
- **Purpose**: Protect pages berdasarkan role/permission
- **Example**: `<ProtectedRoute requiredRoles={[UserRole.OWNER]}>`

#### **Auth Methods:**

```typescript
signIn(email: string, password: string): Promise<{ error?: string }>
signUp(email: string, password: string, businessName: string, role?: UserRole): Promise<{ error?: string }>
signOut(): Promise<void>
resetPassword(email: string): Promise<{ error?: string }>
```

#### **Permission Checks:**

```typescript
hasPermission(permission: Permission): boolean
hasAnyPermission(permissions: Permission[]): boolean
hasRole(role: UserRole): boolean
```

#### **User Roles & Permissions:**

```typescript
enum UserRole {
  OWNER = 'owner',     // Full access
  MANAGER = 'manager', // Most features
  CREW = 'crew'        // Limited access
}

enum Permission {
  VIEW_SALES = 'view_sales',
  CREATE_SALES = 'create_sales',
  MANAGE_INVENTORY = 'manage_inventory',
  USE_AI = 'use_ai',
  // ... 15+ more permissions
}
```

**🎯 Usage Examples:**
```typescript
const { user, signIn, hasPermission } = useAuth()
if (hasPermission(Permission.MANAGE_INVENTORY)) {
  // Show inventory management
}
```

---

## 🎨 **UI COMPONENTS FUNCTIONS**

### **📦 Card Components (`src/components/primitives/Card.tsx`)**

```typescript
export const Card: React.FC<CardProps> = ({
  variant = 'default',        // 'default' | 'glass' | 'elevated' | 'brand' | 'ghost'
  padding = 'md',            // 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover = false,             // Enable hover effects
  glow = false,              // Enable glow animation
  className,                 // Additional CSS classes
  children,                  // Card content
  ...props                   // HTML div props
})
```

**🎨 Variants Available:**
- `default`: Dark background with border
- `glass`: Glass morphism effect
- `elevated`: Shadow elevation
- `brand`: Electric brand colors
- `ghost`: Transparent background

```typescript
export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props })
export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props })
export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props })
```

**🎯 Usage Example:**
```jsx
<Card variant="brand" hover glow>
  <CardHeader>
    <h3>Sales Dashboard</h3>
  </CardHeader>
  <CardContent>
    <p>Revenue: RM 15,000</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### **🔘 UI Elements (`src/components/UI.tsx`)**

#### **Button Functions:**

```typescript
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',       // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',              // 'sm' | 'md' | 'lg' | 'xl'
  loading = false,          // Show loading spinner
  disabled = false,         // Disable button
  leftIcon,                 // Icon on left
  rightIcon,                // Icon on right
  className,                // Additional classes
  children,                 // Button text/content
  onClick,                  // Click handler
  ...props
})

// Specialized Button Variants
export const AiButton = ({ children, className, ...props })      // AI-themed button
export const PostButton = ({ children, className, ...props })    // Social post button
export const ScheduleButton = ({ children, className, ...props }) // Schedule button
export const RestockButton = ({ children, className, ...props }) // Inventory restock
```

#### **Input Functions:**

```typescript
export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,                    // Input label
  error,                    // Error message
  placeholder,              // Placeholder text
  value,                    // Controlled value
  onChange,                 // Change handler
  disabled = false,
  required = false,
  className,
  ...props
})

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
})

export const ComposerTextarea = ({
  placeholder = "What's on your mind?",
  value,
  onChange,
  className,
  ...props
})
```

#### **Other UI Functions:**

```typescript
export const Toggle: React.FC<ToggleProps> = ({
  checked,                  // Toggle state
  onChange,                 // Change handler
  label,                    // Toggle label
  size = 'md'              // 'sm' | 'md' | 'lg'
})

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',      // 'default' | 'success' | 'warning' | 'danger' | 'info'
  size = 'md',             // 'sm' | 'md' | 'lg'
  children,                // Badge content
  className
})
```

**🎯 Usage Examples:**
```jsx
<Button variant="primary" size="lg" loading={isLoading} onClick={handleSubmit}>
  Save Changes
</Button>

<Input 
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>

<Badge variant="success">Active</Badge>
```

---

## 📊 **ANALYTICS & BUSINESS INTELLIGENCE**

### **📈 Analytics Service (`src/services/analytics.ts`)**

#### **Main Analytics Functions:**

```typescript
class AnalyticsService {
  // Revenue Analytics
  async getRevenueAnalytics(): Promise<RevenueAnalytics>
  
  // Sales Performance
  async getSalesAnalytics(): Promise<SalesAnalytics>
  
  // Inventory Insights
  async getInventoryAnalytics(): Promise<InventoryAnalytics>
  
  // Customer Analytics
  async getCustomerAnalytics(): Promise<CustomerAnalytics>
  
  // AI-powered Business Insights
  async getBusinessInsights(): Promise<BusinessInsights>
  
  // Real-time Dashboard Metrics
  async getRealTimeMetrics(): Promise<{
    todayRevenue: number,
    monthRevenue: number,
    todaySalesCount: number,
    lowStockAlerts: number,
    lastUpdated: string
  }>
}

export const analyticsService = new AnalyticsService()
```

#### **Return Types Detailed:**

```typescript
interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  dailyRevenue: number
  revenueGrowth: number           // Percentage growth
  averageOrderValue: number
  revenueByProduct: Array<{       // Top products by revenue
    product: string,
    revenue: number,
    percentage: number
  }>
  monthlyTrend: Array<{           // 12-month trend
    month: string,
    revenue: number,
    orders: number
  }>
}

interface SalesAnalytics {
  totalSales: number
  monthlySales: number
  dailySales: number
  salesGrowth: number
  conversionRate: number
  topProducts: Array<{
    product: string,
    sales: number,
    revenue: number
  }>
  salesByCustomer: Array<{
    customer: string,
    sales: number,
    totalValue: number
  }>
  performanceTrend: Array<{       // 30-day trend
    date: string,
    sales: number,
    revenue: number
  }>
}

interface InventoryAnalytics {
  totalItems: number
  lowStockItems: number
  outOfStockItems: number
  inventoryValue: number
  turnoverRate: number
  fastMovingItems: Array<{
    item: string,
    velocity: number,
    stock: number
  }>
  slowMovingItems: Array<{
    item: string,
    daysInStock: number,
    stock: number
  }>
  stockAlerts: Array<{
    item: string,
    currentStock: number,
    reorderPoint: number,
    status: 'low' | 'out'
  }>
}

interface BusinessInsights {
  profitMargin: number
  operatingExpenses: number
  netProfit: number
  cashFlow: number
  breakEvenPoint: number
  seasonalTrends: Array<{
    period: string,
    trend: 'up' | 'down' | 'stable',
    impact: number
  }>
  recommendations: Array<{
    category: string,
    priority: 'high' | 'medium' | 'low',
    suggestion: string,
    impact: string
  }>
  kpis: Array<{
    metric: string,
    current: number,
    target: number,
    status: 'above' | 'below' | 'on-track'
  }>
}
```

#### **Private Helper Functions:**

```typescript
// Calculate growth rates
private calculateGrowthRate(data: Order[], type: 'revenue' | 'count'): number

// Monthly trends
private calculateMonthlyTrend(sales: Order[]): MonthlyTrend[]

// Customer analysis
private calculateSalesByCustomer(sales: Order[]): CustomerSales[]

// Performance tracking
private calculatePerformanceTrend(sales: Order[]): PerformanceTrend[]

// Cache management
private getFromCache(key: string): any | null
private setCache(key: string, data: any): void
clearCache(): void
```

**🎯 Usage Examples:**
```typescript
// Get revenue insights
const revenue = await analyticsService.getRevenueAnalytics()
console.log(`Total Revenue: RM ${revenue.totalRevenue}`)
console.log(`Growth: ${revenue.revenueGrowth}%`)

// Real-time dashboard data
const metrics = await analyticsService.getRealTimeMetrics()
console.log(`Today's Sales: ${metrics.todaySalesCount}`)

// AI business recommendations
const insights = await analyticsService.getBusinessInsights()
insights.recommendations.forEach(rec => {
  console.log(`${rec.priority}: ${rec.suggestion}`)
})
```

---

## 🤖 **WHATSAPP & COMMUNICATION**

### **📱 WhatsApp Service (`src/services/whatsappService.ts`)**

#### **Main WhatsApp Functions:**

```typescript
class WhatsAppService {
  // Send WhatsApp message
  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse>
  
  // Bot management
  async startBot(): Promise<{ success: boolean; qrCode?: string; error?: string }>
  async disconnect(): Promise<void>
  
  // Connection monitoring
  getConnectionStatus(): boolean
  onConnectionChange(callback: (status: boolean) => void): () => void
  
  // Service status
  getStatus(): { initialized: boolean; queueLength: number; sessions: number }
  
  // Message queue management
  getMessageQueue(): WhatsAppMessage[]
  clearMessageQueue(): void
  
  // Session management
  getActiveSessions(): WhatsAppSession[]
  
  // Connection testing
  async testConnection(): Promise<{ success: boolean; message: string }>
}

const whatsappService = new WhatsAppService()
export default whatsappService
```

#### **Interface Types:**

```typescript
interface WhatsAppMessage {
  to: string                    // Phone number with country code
  from: string                  // Sender phone number
  body: string                  // Message content
  mediaUrl?: string            // Optional media attachment
  templateName?: string        // WhatsApp template name
  language?: string            // Template language
  components?: unknown[]       // Template components
  retryCount?: number          // Auto-retry counter
}

interface WhatsAppResponse {
  success: boolean
  messageId?: string           // Message tracking ID
  error?: string              // Error message if failed
}

interface WhatsAppSession {
  id: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastActivity: Date
  phoneNumber: string
}
```

#### **Private Queue Management:**

```typescript
// Queue processing with rate limiting
private async processQueue(): Promise<void>

// Start background queue processor
private startQueueProcessor(): void

// Connection status management
private setConnectionStatus(status: ConnectionStatus): void
```

**⚙️ Features:**
- **Message Queuing**: Automatic message queue with retry logic
- **Rate Limiting**: Human-like delays (400-1200ms) between messages  
- **Connection Management**: Auto-reconnect and status monitoring
- **Error Handling**: Retry failed messages up to 3 times
- **Baileys Integration**: Uses local Baileys server (non-Twilio)

**🎯 Usage Examples:**
```typescript
// Send a message
const response = await whatsappService.sendMessage({
  to: '+60123456789',
  from: '+60198765432',
  body: 'Hello from CORNMAN! Your order is ready for pickup.'
})

// Start WhatsApp bot
const result = await whatsappService.startBot()
if (result.success) {
  console.log('Bot started successfully!')
} else {
  console.log('Error:', result.error)
}

// Monitor connection status
whatsappService.onConnectionChange((isConnected) => {
  if (isConnected) {
    console.log('WhatsApp connected!')
  } else {
    console.log('WhatsApp disconnected!')
  }
})

// Check service status
const status = whatsappService.getStatus()
console.log(`Queue: ${status.queueLength} messages`)
console.log(`Sessions: ${status.sessions} active`)
```

---

## 🔧 **UTILITY & HELPER FUNCTIONS**

### **🎨 Class Name Utility (`src/utils/cn.ts`)**

```typescript
export function cn(...classes: (string | undefined | null | boolean)[]): string
```
- **Purpose**: Merge and deduplicate Tailwind CSS classes
- **Features**: Handles conditional classes, removes duplicates
- **Example**: `cn('bg-blue-500', 'p-4', condition && 'hover:bg-blue-600')`

### **📊 Business Calculations**

```typescript
// From constants.tsx
export const getBestSeller = (sales: Sale[]): string => {
  // Calculate best selling product from sales data
  // Returns product name with highest sales count
}
```

### **🎪 Loading & Feedback (`src/components/feedback/LoadingStates.tsx`)**

```typescript
export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rounded'          // 'rounded' | 'circular'
})

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',                 // 'sm' | 'md' | 'lg' | 'xl'
  color = 'primary',           // 'primary' | 'secondary' | 'white'
  className = ''
})

export const ContentLoader: React.FC<ContentLoaderProps> = ({ 
  type = 'default',           // 'default' | 'card' | 'table' | 'chart'
  rows = 3,                   // Number of skeleton rows
  className = ''
})

export const CardLoader: React.FC<CardLoaderProps> = ({ className })
```

**🎯 Usage Examples:**
```jsx
// Show loading while data loads
{isLoading ? (
  <Skeleton height="2rem" width="200px" />
) : (
  <h2>{title}</h2>
)}

// Loading spinner
<LoadingSpinner size="lg" color="primary" />

// Card loading state
<CardLoader />
```

---

## 🗃️ **DATA CONSTANTS & MOCK DATA**

### **📦 Business Data (`src/constants.tsx`)**

```typescript
// Product generator cards configuration
export const PRODUCT_CARDS: ProductCardData[] = [
  {
    id: 'signature-crnmn',
    title: 'CRNMN Signature',
    description: 'Our flagship corn-based snack',
    price: 'RM 8.50',
    category: 'snacks',
    image: '/api/placeholder/300/200',
    ingredients: ['corn', 'spices', 'seasoning'],
    nutrition: { calories: 150, protein: 3, carbs: 22 }
  }
  // ... more products
]

// Growth strategy cards
export const GROWTH_CARDS: GeneratorCardData[] = [
  {
    title: 'Social Media Campaign',
    description: 'Viral content strategy for TikTok & Instagram',
    category: 'marketing',
    estimatedReach: '50K views',
    difficulty: 'medium'
  }
  // ... more strategies
]

// Business operations cards
export const BIZ_OPS_CARDS: GeneratorCardData[] = [
  {
    title: 'Inventory Management',
    description: 'Smart stock tracking and reorder alerts',
    category: 'operations',
    automationLevel: 'high'
  }
  // ... more operations
]

// Marketing tools
export const MARKETING_CARDS: Omit<ComposerCardData, 'onSchedule'>[] = [
  {
    title: 'Instagram Story',
    description: 'Create engaging stories for your audience',
    category: 'social',
    platform: 'instagram'
  }
  // ... more marketing tools
]

// Development roadmap
export const ROADMAP_DATA: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'completed',
    items: ['Basic dashboard', 'User authentication', 'Inventory tracking'],
    completedAt: '2024-01-15'
  }
  // ... more phases
]

// Mock data for development
export const MOCK_INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'crnmn-001',
    name: 'CRNMN Signature',
    stock: 150,
    cost: 3.50,
    price: 8.50,
    category: 'snacks',
    supplier: 'Local Farm Co',
    threshold: 20
  }
  // ... more inventory items
]

export const MOCK_INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Ahmad Rahman',
    email: 'ahmad@example.com',
    phone: '+60123456789',
    totalSpent: 850.00,
    orderCount: 12,
    lastOrder: '2024-01-20'
  }
  // ... more customers
]

export const MOCK_INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    customerId: 'cust-001',
    items: [
      { productId: 'crnmn-001', quantity: 2, price: 8.50 }
    ],
    total: 17.00,
    status: 'completed',
    createdAt: '2024-01-20T10:30:00Z'
  }
  // ... more sales
]
```

---

## 🎮 **PAGE & DASHBOARD FUNCTIONS**

### **📱 Dashboard Page (`src/features/dashboard/DashboardPage.tsx`)**

```typescript
const DashboardPage: React.FC = () => {
  // Main dashboard with KPIs, charts, and quick actions
  // Integrates with all major services
}

// Helper functions
const getBestSeller = (sales: Sale[]): string => {
  // Calculate best selling product
}
```

### **📊 Analytics Page (`src/features/analytics/AnalyticsPage.tsx`)**

```typescript
const AnalyticsPage: React.FC = () => {
  // Comprehensive analytics dashboard
  // Revenue, sales, inventory, customer insights
}
```

### **💰 Sales Page (`src/features/sales/SalesPage.tsx`)**

```typescript
const SalesPage: React.FC = () => {
  // Sales management interface
  // Create, view, edit sales records
}
```

### **📦 Inventory Page (`src/features/inventory/InventoryPage.tsx`)**

```typescript
const InventoryPage: React.FC = () => {
  // Inventory management dashboard
  // Stock levels, reorder alerts, product management
}
```

### **📱 WhatsApp Page (`src/features/whatsapp/WhatsAppPage.tsx`)**

```typescript
const WhatsAppPage: React.FC = () => {
  // WhatsApp bot management interface
  // Bot status, message queue, connection management
}
```

### **🎯 Projects Page (`src/features/projects/ProjectsPage.tsx`)**

```typescript
const ProjectsPage: React.FC = () => {
  // Project management dashboard
  // Track business initiatives and goals
}
```

### **⚙️ Settings Page (`src/features/settings/SettingsPage.tsx`)**

```typescript
const SettingsPage: React.FC = () => {
  // App configuration interface
  // User settings, business settings, integrations
}
```

---

## 🎯 **SUMMARY: FUNCTION STATUS**

### **✅ WORKING FUNCTIONS (Ready to use):**

1. **UI Components**: `Card`, `Button`, `Input`, `Badge` - All working
2. **Utilities**: `cn()`, `getBestSeller()` - Fully functional
3. **Constants**: All mock data and configuration - Available
4. **Loading States**: `Skeleton`, `LoadingSpinner` - Working
5. **Basic Pages**: All page components render correctly

### **🟡 PARTIALLY WORKING (May have issues):**

1. **Auth Context**: Works but Firebase may fail → Falls back to demo mode
2. **Analytics Service**: Core logic works, but depends on data availability
3. **WhatsApp Service**: Queue system works, but needs Baileys server running

### **❌ PROBLEMATIC FUNCTIONS (Likely to fail):**

1. **Firebase Functions**: `auth`, `db`, `storage` - Connection issues
2. **AI Services**: `generateGeminiContent()`, `generateImage()` - API dependent
3. **Real-time Features**: WebSocket connections, live sync
4. **Complex Integrations**: Twilio, external APIs

---

## 💡 **RECOMMENDATION FOR SUCCESS:**

### **🎯 Start With These Working Functions:**

```typescript
// 1. Basic UI Setup
import { Card, Button, Input, Badge } from './components/primitives'
import { Skeleton, LoadingSpinner } from './components/feedback'

// 2. Mock Data & Constants
import { MOCK_INITIAL_INVENTORY, PRODUCT_CARDS } from './constants'

// 3. Utility Functions
import { cn } from './utils/cn'

// 4. Auth (with demo fallback)
import { useAuth, AuthProvider } from './contexts/AuthContext'
```

### **🔧 Build Progressive Enhancement:**

1. **Phase 1**: Static UI dengan mock data
2. **Phase 2**: Local state management
3. **Phase 3**: Add working integrations one by one
4. **Phase 4**: Complex features (AI, real-time)

**🌽 Focus on the WORKING FOUNDATIONS first, then add complexity!**
