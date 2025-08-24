# 🗂️ PROJECT REORGANIZATION PLAN

## 📋 **Current Issues Identified**

1. **Duplicate Structure**: `components/` exists in both root and `src/`
2. **Scattered Files**: Configuration and documentation files are mixed in root
3. **Inconsistent Organization**: Some folders in root, some in `src/`
4. **Test Files Scattered**: Test files are not properly organized
5. **Excessive Documentation**: Too many markdown files in root directory

## 🎯 **Target Structure**

```
cornman-strategic-hq/
├── 📁 src/                    # Main source code
│   ├── 📁 components/         # All React components
│   ├── 📁 contexts/           # React contexts
│   ├── 📁 hooks/              # Custom hooks
│   ├── 📁 services/           # Business logic & API services
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📁 utils/              # Utility functions
│   ├── 📁 features/           # Feature-based organization
│   ├── 📁 layouts/            # Layout components
│   ├── 📁 app/                # App-level components
│   └── 📁 __tests__/          # All test files
├── 📁 docs/                   # Documentation
│   ├── 📁 setup/              # Setup guides
│   ├── 📁 api/                # API documentation
│   ├── 📁 deployment/         # Deployment guides
│   └── 📁 architecture/       # Architecture documentation
├── 📁 config/                 # Configuration files
├── 📁 scripts/                # Build and utility scripts
├── 📁 tests/                  # Test configuration and utilities
├── 📁 public/                 # Static assets
├── 📁 functions/              # Firebase functions
└── 📁 .github/                # GitHub workflows and templates
```

## 🔄 **Migration Steps**

### **Phase 1: Consolidate Source Code**
- Move all components from root `components/` to `src/components/`
- Consolidate all contexts, hooks, services, types, and utils
- Ensure no duplicate files exist

### **Phase 2: Organize Documentation**
- Create `docs/` folder structure
- Move relevant markdown files to appropriate subfolders
- Keep only essential files in root (README, LICENSE, etc.)

### **Phase 3: Clean Configuration**
- Move configuration files to `config/` folder
- Organize test files in `tests/` folder
- Clean up root directory

### **Phase 4: Update Imports**
- Fix all import paths after reorganization
- Update build configurations
- Ensure tests still pass

## 📝 **Files to Move**

### **From Root to src/components/**
- All files in `components/` folder

### **From Root to src/contexts/**
- All files in `contexts/` folder

### **From Root to src/hooks/**
- All files in `hooks/` folder

### **From Root to src/services/**
- All files in `services/` folder

### **From Root to src/types/**
- All files in `types/` folder

### **From Root to src/utils/**
- All files in `utils/` folder

### **From Root to docs/setup/**
- `SETUP_COMPLETE.md`
- `SUPABASE_SETUP.md`
- `TWILIO_INTEGRATION_GUIDE.md`
- `WHATSAPP_SETUP_STATUS.md`
- `whatsapp-sandbox-setup.md`

### **From Root to docs/architecture/**
- `ARCHITECTURE_IMPROVEMENTS.md`
- `CODE_QUALITY_IMPROVEMENTS.md`
- `DESIGN-SYSTEM.md`
- `PERFORMANCE_IMPROVEMENTS.md`
- `UX-AUDIT-REPORT.md`
- `UX_IMMEDIATE_FIXES.md`

### **From Root to docs/api/**
- `GEMINI.md`
- `QWEN.md`
- `VIRAL_SYSTEM_README.md`
- `WHATSAPP_BOT_REVIEW.md`
- `WHATSAPP_BUSINESS_PLATFORM.md`

### **From Root to config/**
- `twilio.config.ts`
- `firebase.json`
- `firestore.rules`
- `.firebaserc`

### **From Root to tests/**
- All test files (`test-*.js`, `test-*.html`)
- `vitest.config.ts`
- `cypress.config.js` (if exists)

### **From Root to scripts/**
- All `.bat` files
- `start-server.ps1`
- `local-webhook-server.js`
- `twilio-*.js`

## 🚫 **Files to Keep in Root**
- `package.json`
- `package-lock.json`
- `README.md`
- `LICENSE`
- `.gitignore`
- `.eslintrc.cjs`
- `.prettierrc.cjs`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.cjs`
- `index.html`
- `index.css`
- `index.tsx`
- `App.tsx`
- `constants.tsx`
- `types.ts`

## ✅ **Benefits of Reorganization**

1. **Cleaner Root Directory**: Easier to navigate and understand
2. **Better Separation of Concerns**: Clear distinction between source, docs, and config
3. **Easier Maintenance**: Related files are grouped together
4. **Better Developer Experience**: Clear structure for new developers
5. **Professional Appearance**: More organized and maintainable codebase

## ⚠️ **Risks & Mitigation**

### **Risks**
- Import path breaks
- Build failures
- Test failures
- Git history complexity

### **Mitigation**
- Test thoroughly after each phase
- Update all import paths systematically
- Keep git history clean with proper commits
- Run full test suite after reorganization
