# 🗂️ PROJECT STRUCTURE DIAGRAM

## 📊 **CURRENT STRUCTURE (BEFORE REORGANIZATION)**

```
cornman---strategic-hq/
├── 📁 .git/                     # Git repository
├── 📁 .firebase/                # Firebase cache
├── 📁 .vscode/                  # VS Code settings
├── 📁 app/                      # API routes
│   └── 📁 api/
│       └── 📁 whatsapp/
├── 📁 components/               # ⚠️ DUPLICATE: React components (ROOT)
│   ├── 📁 analytics/
│   ├── 📁 auth/
│   ├── 📁 ecommerce/
│   ├── 📁 feedback/
│   ├── 📁 layouts/
│   ├── 📁 primitives/
│   ├── 📁 team/
│   ├── 📁 whatsapp/
│   ├── 📄 AiStrategicBriefing.tsx
│   ├── 📄 BusinessOS.tsx
│   ├── 📄 Card.tsx
│   ├── 📄 CompleteDashboard.tsx
│   ├── 📄 ComposerCard.tsx
│   ├── 📄 ContentScheduler.tsx
│   ├── 📄 ContextStatusMonitor.tsx
│   ├── 📄 CustomerHub.tsx
│   ├── 📄 FinanceHub.tsx
│   ├── 📄 GeneratorCard.tsx
│   ├── 📄 Header.tsx
│   ├── 📄 Icons.tsx
│   ├── 📄 ImageGeneratorCard.tsx
│   ├── 📄 OperationsDashboard.tsx
│   ├── 📄 PhoneShell.tsx
│   ├── 📄 ProjectCrew.tsx
│   ├── 📄 Roadmap.tsx
│   ├── 📄 Section.tsx
│   ├── 📄 SystemHandover.tsx
│   ├── 📄 SystemStatus.tsx
│   ├── 📄 TestPage.tsx
│   ├── 📄 TikTokPreviewScreen.tsx
│   ├── 📄 TwilioDashboard.tsx
│   ├── 📄 UI.tsx
│   ├── 📄 WebsiteHub.tsx
│   └── 📄 WhatsappScreen.tsx
├── 📁 config/                   # Configuration files
│   └── 📄 twilio.config.ts
├── 📁 contexts/                 # ⚠️ DUPLICATE: React contexts (ROOT)
│   ├── 📄 AnalyticsContext.tsx
│   ├── 📄 AppStateContext.tsx
│   ├── 📄 AuthContext.tsx
│   ├── 📄 ConfigContext.tsx
│   ├── 📄 ContextComposer.tsx
│   ├── 📄 ContextDevTools.tsx
│   ├── 📄 DataSyncContext.tsx
│   ├── 📄 EcommerceContext.tsx
│   ├── 📄 EnhancedContextComposer.tsx
│   ├── 📄 ErrorBoundaryContext.tsx
│   ├── 📄 FeatureFlagContext.tsx
│   ├── 📄 InventoryContext.tsx
│   ├── 📄 NotificationContext.tsx
│   ├── 📄 PerformanceContext.tsx
│   ├── 📄 PhoneShellContext.tsx
│   ├── 📄 SalesContext.tsx
│   ├── 📄 TeamContext.tsx
│   └── 📄 ThemeContext.tsx
├── 📁 database/                 # Database files
├── 📁 dev-dist/                 # Development distribution
├── 📁 functions/                # Firebase functions
│   ├── 📁 lib/
│   ├── 📁 src/
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
├── 📁 hooks/                    # ⚠️ DUPLICATE: Custom hooks (ROOT)
│   ├── 📄 useOffline.ts
│   └── 📄 useRealTimeSync.ts
├── 📁 public/                   # Static assets
│   ├── 📄 404.html
│   ├── 📄 apple-touch-icon.png
│   ├── 📄 favicon.ico
│   ├── 📄 manifest.json
│   └── 📄 manifest.webmanifest
├── 📁 scripts/                  # Build scripts
│   └── 📄 wa-bot.mjs
├── 📁 services/                 # ⚠️ DUPLICATE: Business services (ROOT)
│   ├── 📄 analytics.ts
│   ├── 📄 api.ts
│   ├── 📄 ecommerceService.ts
│   ├── 📄 firebase.ts
│   ├── 📄 geminiService.ts
│   ├── 📄 mobileService.ts
│   ├── 📄 offlineStorage.ts
│   ├── 📄 teamService.ts
│   ├── 📄 twilioApi.ts
│   ├── 📄 twilioService.ts
│   └── 📄 whatsappService.ts
├── 📁 src/                      # ⚠️ DUPLICATE: Source code
│   ├── 📁 __tests__/            # Test files
│   ├── 📁 app/                  # App components
│   ├── 📁 components/           # ⚠️ DUPLICATE: React components (SRC)
│   ├── 📁 features/             # Feature components
│   ├── 📁 hooks/                # ⚠️ DUPLICATE: Custom hooks (SRC)
│   ├── 📁 layouts/              # Layout components
│   ├── 📁 services/             # ⚠️ DUPLICATE: Business services (SRC)
│   ├── 📁 types/                # ⚠️ DUPLICATE: TypeScript types (SRC)
│   ├── 📁 utils/                # ⚠️ DUPLICATE: Utility functions (SRC)
│   ├── 📄 App.tsx               # ⚠️ DUPLICATE: Main App component
│   ├── 📄 App.css               # ⚠️ DUPLICATE: App styles
│   └── 📄 index.tsx             # ⚠️ DUPLICATE: Entry point
├── 📁 types/                    # ⚠️ DUPLICATE: TypeScript types (ROOT)
│   ├── 📄 automation.ts
│   ├── 📄 ecommerce.ts
│   ├── 📄 global.ts
│   ├── 📄 integrations.ts
│   ├── 📄 mobile.ts
│   ├── 📄 supplychain.ts
│   └── 📄 team.ts
├── 📁 utils/                    # ⚠️ DUPLICATE: Utility functions (ROOT)
│   ├── 📄 cn.ts
│   └── 📄 webhookHandlers.ts
├── 📄 .eslintrc.cjs             # ESLint configuration
├── 📄 .firebaserc               # Firebase configuration
├── 📄 .gitignore                # Git ignore rules
├── 📄 .prettierrc.cjs           # Prettier configuration
├── 📄 ADVANCED_CONTEXT_ENGINEERING.md
├── 📄 App.tsx                   # ⚠️ DUPLICATE: Main App component (ROOT)
├── 📄 ARCHITECTURE_IMPROVEMENTS.md
├── 📄 CODE_QUALITY_IMPROVEMENTS.md
├── 📄 constants.tsx             # Constants file
├── 📄 DESIGN-SYSTEM.md
├── 📄 env.example               # Environment variables example
├── 📄 FINAL-WHATSAPP-SETUP.md
├── 📄 firebase.json             # Firebase configuration
├── 📄 firestore-debug.log       # Firestore debug log
├── 📄 firestore.rules           # Firestore security rules
├── 📄 GEMINI.md                 # Gemini API documentation
├── 📄 IMPLEMENTATION-ROADMAP.md
├── 📄 IMPROVEMENT_SUMMARY.md
├── 📄 IMPROVEMENTS_IMPLEMENTED.md
├── 📄 index.css                 # Global styles
├── 📄 index.html                # HTML template
├── 📄 index.tsx                 # ⚠️ DUPLICATE: Entry point (ROOT)
├── 📄 local-webhook-server.js   # Local webhook server
├── 📄 MASTER_IMPROVEMENT_PLAN.md
├── 📄 metadata.json             # Project metadata
├── 📄 ORGANIZATION_PLAN.md      # This reorganization plan
├── 📄 package.json              # Dependencies
├── 📄 package-lock.json         # Locked dependencies
├── 📄 PERFORMANCE_IMPROVEMENTS.md
├── 📄 postcss.config.cjs        # PostCSS configuration
├── 📄 PROJECT_STRUCTURE_DIAGRAM.md # This file
├── 📄 QWEN.md                   # QWEN API documentation
├── 📄 README.md                 # Project documentation
├── 📄 reorganize.ps1            # Reorganization script
├── 📄 request.json              # Sample request
├── 📄 SETUP_COMPLETE.md
├── 📄 setup-twilio.bat          # Twilio setup script
├── 📄 setup-whatsapp-complete.bat # WhatsApp setup script
├── 📄 start-server.ps1          # Server start script
├── 📄 start-twilio-server.bat   # Twilio server start
├── 📄 SUPABASE_SETUP.md
├── 📄 tailwind.config.js        # ⚠️ DUPLICATE: Tailwind config
├── 📄 tailwind.config.ts        # ⚠️ DUPLICATE: Tailwind config
├── 📄 test-api.html             # API test page
├── 📄 test-twilio.js            # Twilio test
├── 📄 test-twilio-setup.js      # Twilio setup test
├── 📄 test-twilio-simple.js     # Simple Twilio test
├── 📄 test-whatsapp-connection.js # WhatsApp connection test
├── 📄 TODO.md                   # Todo list
├── 📄 tsconfig.eslint.json      # TypeScript ESLint config
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 TWILIO_COMPONENT_README.md
├── 📄 TWILIO_INTEGRATION_GUIDE.md
├── 📄 TWILIO_SECURITY_GUIDE.md
├── 📄 twilio-real-server.js     # Twilio server
├── 📄 twilio-test-server.js     # Twilio test server
├── 📄 types.ts                  # ⚠️ DUPLICATE: Types file (ROOT)
├── 📄 UX-AUDIT-REPORT.md
├── 📄 UX_IMMEDIATE_FIXES.md
├── 📄 VIRAL_SYSTEM_README.md
├── 📄 vite-env.d.ts             # Vite environment types
├── 📄 vite.config.ts            # Vite configuration
├── 📄 vitest.config.ts          # Vitest configuration
├── 📄 webhookHandlers.ts        # Webhook handlers
├── 📄 WHATSAPP_BOT_REVIEW.md
├── 📄 WHATSAPP_BUSINESS_PLATFORM.md
├── 📄 WHATSAPP_SETUP_STATUS.md
├── 📄 whatsapp-sandbox-setup.md
└── 📄 whatsapp-test-commands.md
```

## 🎯 **TARGET STRUCTURE (AFTER REORGANIZATION)**

```
cornman---strategic-hq/
├── 📁 .git/                     # Git repository
├── 📁 .firebase/                # Firebase cache
├── 📁 .vscode/                  # VS Code settings
├── 📁 config/                   # ⭐ ALL Configuration files
│   ├── 📄 twilio.config.ts
│   ├── 📄 firebase.json
│   ├── 📄 firestore.rules
│   ├── 📄 .firebaserc
│   ├── 📄 .eslintrc.cjs
│   ├── 📄 .prettierrc.cjs
│   ├── 📄 tsconfig.json
│   ├── 📄 tsconfig.eslint.json
│   ├── 📄 vite.config.ts
│   ├── 📄 vite-env.d.ts
│   ├── 📄 vitest.config.ts
│   ├── 📄 tailwind.config.ts
│   └── 📄 postcss.config.cjs
├── 📁 src/                      # ⭐ MAIN Source code (CONSOLIDATED)
│   ├── 📁 components/           # ⭐ ALL React components
│   │   ├── 📁 analytics/
│   │   ├── 📁 auth/
│   │   ├── 📁 ecommerce/
│   │   ├── 📁 feedback/
│   │   ├── 📁 layouts/
│   │   ├── 📁 primitives/
│   │   ├── 📁 team/
│   │   ├── 📁 whatsapp/
│   │   ├── 📄 AiStrategicBriefing.tsx
│   │   ├── 📄 BusinessOS.tsx
│   │   ├── 📄 Card.tsx
│   │   ├── 📄 CompleteDashboard.tsx
│   │   ├── 📄 ComposerCard.tsx
│   │   ├── 📄 ContentScheduler.tsx
│   │   ├── 📄 ContextStatusMonitor.tsx
│   │   ├── 📄 CustomerHub.tsx
│   │   ├── 📄 FinanceHub.tsx
│   │   ├── 📄 GeneratorCard.tsx
│   │   ├── 📄 Header.tsx
│   │   ├── 📄 Icons.tsx
│   │   ├── 📄 ImageGeneratorCard.tsx
│   │   ├── 📄 OperationsDashboard.tsx
│   │   ├── 📄 PhoneShell.tsx
│   │   ├── 📄 ProjectCrew.tsx
│   │   ├── 📄 Roadmap.tsx
│   │   ├── 📄 Section.tsx
│   │   ├── 📄 SystemHandover.tsx
│   │   ├── 📄 SystemStatus.tsx
│   │   ├── 📄 TestPage.tsx
│   │   ├── 📄 TikTokPreviewScreen.tsx
│   │   ├── 📄 TwilioDashboard.tsx
│   │   ├── 📄 UI.tsx
│   │   ├── 📄 WebsiteHub.tsx
│   │   └── 📄 WhatsappScreen.tsx
│   ├── 📁 contexts/             # ⭐ ALL React contexts
│   │   ├── 📄 AnalyticsContext.tsx
│   │   ├── 📄 AppStateContext.tsx
│   │   ├── 📄 AuthContext.tsx
│   │   ├── 📄 ConfigContext.tsx
│   │   ├── 📄 ContextComposer.tsx
│   │   ├── 📄 ContextDevTools.tsx
│   │   ├── 📄 DataSyncContext.tsx
│   │   ├── 📄 EcommerceContext.tsx
│   │   ├── 📄 EnhancedContextComposer.tsx
│   │   ├── 📄 ErrorBoundaryContext.tsx
│   │   ├── 📄 FeatureFlagContext.tsx
│   │   ├── 📄 InventoryContext.tsx
│   │   ├── 📄 NotificationContext.tsx
│   │   ├── 📄 PerformanceContext.tsx
│   │   ├── 📄 PhoneShellContext.tsx
│   │   ├── 📄 SalesContext.tsx
│   │   ├── 📄 TeamContext.tsx
│   │   └── 📄 ThemeContext.tsx
│   ├── 📁 hooks/                # ⭐ ALL Custom hooks
│   │   ├── 📄 useOffline.ts
│   │   └── 📄 useRealTimeSync.ts
│   ├── 📁 services/             # ⭐ ALL Business services
│   │   ├── 📄 analytics.ts
│   │   ├── 📄 api.ts
│   │   ├── 📄 ecommerceService.ts
│   │   ├── 📄 firebase.ts
│   │   ├── 📄 geminiService.ts
│   │   ├── 📄 mobileService.ts
│   │   ├── 📄 offlineStorage.ts
│   │   ├── 📄 teamService.ts
│   │   ├── 📄 twilioApi.ts
│   │   ├── 📄 twilioService.ts
│   │   └── 📄 whatsappService.ts
│   ├── 📁 types/                # ⭐ ALL TypeScript types
│   │   ├── 📄 automation.ts
│   │   ├── 📄 ecommerce.ts
│   │   ├── 📄 global.ts
│   │   ├── 📄 integrations.ts
│   │   ├── 📄 mobile.ts
│   │   ├── 📄 supplychain.ts
│   │   └── 📄 team.ts
│   ├── 📁 utils/                # ⭐ ALL Utility functions
│   │   ├── 📄 cn.ts
│   │   └── 📄 webhookHandlers.ts
│   ├── 📁 features/             # Feature components
│   ├── 📁 layouts/              # Layout components
│   ├── 📁 app/                  # App components
│   ├── 📁 __tests__/            # Test files
│   ├── 📄 App.tsx               # Main App component
│   ├── 📄 App.css               # App styles
│   └── 📄 index.tsx             # Entry point
├── 📁 docs/                     # ⭐ ALL Documentation (ORGANIZED)
│   ├── 📁 setup/                # Setup guides
│   │   ├── 📄 SETUP_COMPLETE.md
│   │   ├── 📄 SUPABASE_SETUP.md
│   │   ├── 📄 TWILIO_INTEGRATION_GUIDE.md
│   │   ├── 📄 WHATSAPP_SETUP_STATUS.md
│   │   └── 📄 whatsapp-sandbox-setup.md
│   ├── 📁 architecture/         # Architecture documentation
│   │   ├── 📄 ARCHITECTURE_IMPROVEMENTS.md
│   │   ├── 📄 CODE_QUALITY_IMPROVEMENTS.md
│   │   ├── 📄 DESIGN-SYSTEM.md
│   │   ├── 📄 PERFORMANCE_IMPROVEMENTS.md
│   │   ├── 📄 UX-AUDIT-REPORT.md
│   │   └── 📄 UX_IMMEDIATE_FIXES.md
│   ├── 📁 api/                  # API documentation
│   │   ├── 📄 GEMINI.md
│   │   ├── 📄 QWEN.md
│   │   ├── 📄 VIRAL_SYSTEM_README.md
│   │   ├── 📄 WHATSAPP_BOT_REVIEW.md
│   │   └── 📄 WHATSAPP_BUSINESS_PLATFORM.md
│   └── 📁 deployment/           # Deployment guides
│       ├── 📄 FINAL-WHATSAPP-SETUP.md
│       ├── 📄 MASTER_IMPROVEMENT_PLAN.md
│       ├── 📄 IMPROVEMENT_SUMMARY.md
│       ├── 📄 IMPROVEMENTS_IMPLEMENTED.md
│       ├── 📄 IMPLEMENTATION-ROADMAP.md
│       └── 📄 PHASE-*.md
├── 📁 tests/                    # ⭐ ALL Test files (ORGANIZED)
│   ├── 📄 test-api.html
│   ├── 📄 test-twilio.js
│   ├── 📄 test-twilio-setup.js
│   ├── 📄 test-twilio-simple.js
│   ├── 📄 test-whatsapp-connection.js
│   └── 📄 vitest.config.ts
├── 📁 scripts/                  # ⭐ ALL Scripts (ORGANIZED)
│   ├── 📄 wa-bot.mjs
│   ├── 📄 setup-twilio.bat
│   ├── 📄 setup-whatsapp-complete.bat
│   ├── 📄 start-server.ps1
│   ├── 📄 start-twilio-server.bat
│   ├── 📄 local-webhook-server.js
│   ├── 📄 twilio-real-server.js
│   └── 📄 twilio-test-server.js
├── 📁 app/                      # API routes
│   └── 📁 api/
│       └── 📁 whatsapp/
├── 📁 functions/                # Firebase functions
├── 📁 public/                   # Static assets
├── 📁 database/                 # Database files
├── 📁 dev-dist/                 # Development distribution
├── 📄 package.json              # Dependencies
├── 📄 package-lock.json         # Locked dependencies
├── 📄 README.md                 # Project documentation
├── 📄 LICENSE                   # License file
├── 📄 .gitignore                # Git ignore rules
├── 📄 index.html                # HTML template
├── 📄 index.css                 # Global styles
├── 📄 constants.tsx             # Constants file
├── 📄 types.ts                  # Types file
├── 📄 env.example               # Environment variables example
├── 📄 metadata.json             # Project metadata
├── 📄 TODO.md                   # Todo list
├── 📄 request.json              # Sample request
└── 📄 firestore-debug.log       # Firestore debug log
```

## 🔍 **KEY CHANGES SUMMARY**

### **✅ What Will Be Consolidated:**
1. **Components**: Merge root `components/` → `src/components/`
2. **Contexts**: Merge root `contexts/` → `src/contexts/`
3. **Hooks**: Merge root `hooks/` → `src/hooks/`
4. **Services**: Merge root `services/` → `src/services/`
5. **Types**: Merge root `types/` → `src/types/`
6. **Utils**: Merge root `utils/` → `src/utils/`

### **✅ What Will Be Organized:**
1. **Documentation**: All `.md` files → `docs/` subfolders
2. **Configuration**: All config files → `config/`
3. **Tests**: All test files → `tests/`
4. **Scripts**: All scripts → `scripts/`

### **✅ What Will Stay in Root:**
1. **Essential files**: `package.json`, `README.md`, `LICENSE`
2. **Entry points**: `index.html`, `index.tsx`, `App.tsx`
3. **Core config**: `.gitignore`, `env.example`

### **⚠️ What Will Be Removed:**
1. **Duplicate files**: Remove root duplicates after moving to `src/`
2. **Scattered files**: Consolidate into appropriate folders
3. **Temporary files**: Clean up debug logs and temp files

## 🎯 **BENEFITS OF THIS STRUCTURE**

1. **🧹 Cleaner Root**: Only essential files visible at top level
2. **📁 Logical Grouping**: Related files are together
3. **🔍 Easy Navigation**: Clear folder structure for developers
4. **🚀 Better Maintenance**: Easier to find and update files
5. **👥 Team Collaboration**: Standard structure for all team members
6. **📚 Clear Documentation**: Organized docs by category
7. **⚙️ Centralized Config**: All config files in one place
8. **🧪 Test Organization**: All tests grouped together

## ⚠️ **RISKS & MITIGATION**

### **Risks:**
- Import path breaks
- Build failures
- Test failures

### **Mitigation:**
- Test thoroughly after each phase
- Update import paths systematically
- Keep git history clean
- Run full test suite after reorganization

---

**📋 Next Step: Review this diagram and approve the reorganization plan before execution.**
