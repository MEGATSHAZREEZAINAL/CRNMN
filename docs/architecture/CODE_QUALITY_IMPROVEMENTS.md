# 🛡️ Code Quality & Testing Improvements

## 1. TypeScript Strict Mode

### Current Issues:
- Many `any` types
- Missing proper type definitions
- No strict mode enabled

### Implementation:

```typescript
// tsconfig.json improvements
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}

// Better type definitions
interface APIResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}

// Strict service typing
class SalesService {
  async createSale(sale: CreateSaleRequest): Promise<APIResponse<Sale>> {
    try {
      const response = await this.api.post<Sale>('/sales', sale);
      return { data: response.data };
    } catch (error) {
      return { 
        error: {
          message: error.message || 'Failed to create sale',
          code: 'SALE_CREATE_FAILED',
          details: { originalError: error }
        }
      };
    }
  }
}
```

## 2. Error Handling Strategy

### Current: Silent failures and console.error
### Improved: Comprehensive error boundaries and user feedback

```typescript
// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// Error handling hook
const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const handleError = useCallback((error: Error) => {
    setError(error);
    reportError(error);
    toast.error(error.message);
  }, []);
  
  const clearError = useCallback(() => setError(null), []);
  
  return { error, handleError, clearError };
};
```

## 3. Input Validation

### Current: No validation
### Improved: Zod schema validation

```typescript
// schemas/validation.ts
import { z } from 'zod';

export const CreateSaleSchema = z.object({
  product: z.string().min(1, 'Product name is required'),
  amount: z.number().positive('Amount must be positive'),
  customerId: z.string().uuid('Invalid customer ID'),
  date: z.date().max(new Date(), 'Date cannot be in the future'),
});

export const CustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
});

// Usage in components
const AddSaleForm = () => {
  const [formData, setFormData] = useState<CreateSaleInput>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (data: unknown) => {
    try {
      const validatedData = CreateSaleSchema.parse(data);
      await createSale(validatedData);
      toast.success('Sale created successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="product"
        error={errors.product?.[0]}
        onChange={(e) => setFormData({...formData, product: e.target.value})}
      />
    </form>
  );
};
```

## 4. Testing Strategy

### Comprehensive Testing Setup:

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// Example component tests
// __tests__/components/SalesCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SalesCard } from '../SalesCard';

describe('SalesCard', () => {
  const mockSales = [
    { id: '1', product: 'Jagung Manis', amount: 15.50, time: '10:30' },
  ];
  
  it('displays sales data correctly', () => {
    render(<SalesCard sales={mockSales} />);
    
    expect(screen.getByText('Jagung Manis')).toBeInTheDocument();
    expect(screen.getByText('RM15.50')).toBeInTheDocument();
  });
  
  it('calls onAddSale when add button clicked', () => {
    const mockAddSale = jest.fn();
    render(<SalesCard sales={mockSales} onAddSale={mockAddSale} />);
    
    fireEvent.click(screen.getByText('Add Sale'));
    expect(mockAddSale).toHaveBeenCalled();
  });
});

// Service tests
// __tests__/services/salesService.test.ts
import { SalesService } from '../salesService';

describe('SalesService', () => {
  let salesService: SalesService;
  
  beforeEach(() => {
    salesService = new SalesService();
  });
  
  it('creates sale successfully', async () => {
    const saleData = {
      product: 'Test Product',
      amount: 25.00,
      customerId: 'customer-123',
    };
    
    const result = await salesService.createSale(saleData);
    
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });
  
  it('handles API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(salesService.api, 'post').mockRejectedValue(new Error('Network error'));
    
    const result = await salesService.createSale({} as any);
    
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('SALE_CREATE_FAILED');
  });
});
```

## 5. Code Quality Tools

### ESLint Configuration:

```javascript
// .eslintrc.cjs (Enhanced)
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
  ],
  rules: {
    // Strict TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    
    // React best practices
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'complexity': ['warn', 10],
  },
};
```

## 6. Pre-commit Hooks

### Husky + Lint-staged:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests --bail"
    ]
  }
}
```

## 7. API Mocking for Development

### MSW (Mock Service Worker):

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/sales', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          { id: '1', product: 'Jagung Manis', amount: 15.50 },
        ]
      })
    );
  }),
  
  rest.post('/api/sales', (req, res, ctx) => {
    return res(
      ctx.json({
        data: { id: '2', ...req.body }
      })
    );
  }),
];
```

## Implementation Timeline:

1. **Week 1**: TypeScript strict mode + error boundaries
2. **Week 2**: Input validation with Zod
3. **Week 3**: Unit testing setup and key component tests
4. **Week 4**: Integration tests and API mocking
5. **Week 5**: E2E tests with Playwright
6. **Week 6**: Code quality tools and CI/CD integration
