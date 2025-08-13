import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { BusinessOS } from './components/BusinessOS';
import { GeneratorCard } from './components/GeneratorCard';
import { ImageGeneratorCard } from './components/ImageGeneratorCard';
import { SystemHandover } from './components/SystemHandover';
import { SystemStatus } from './components/SystemStatus';
import { PhoneShellProvider } from './contexts/PhoneShellContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectCrew } from './components/ProjectCrew';
import { Roadmap } from './components/Roadmap';
import { TestPage } from './components/TestPage';
import { AppLayout } from './components/layouts/AppLayout';
import { LoginForm } from './components/auth/LoginForm';
import { OfflineIndicator } from './components/feedback/OfflineIndicator';
import { useOffline } from './hooks/useOffline';
import { useRealTimeSync } from './hooks/useRealTimeSync';
import { api } from './services/api';

import {
  BASE_PROMPT,
  PRODUCT_CARDS,
  GROWTH_CARDS,
  BIZ_OPS_CARDS,
  MARKETING_CARDS,
  MOCK_INITIAL_INVENTORY,
  MOCK_INITIAL_SALES,
  MOCK_INITIAL_CUSTOMERS,
  MOCK_INITIAL_INVOICES,
  ROADMAP_DATA,
} from './constants';
import { generateGeminiContent } from './services/geminiService';
import type {
  ComposerCardData,
  GeneratorCardData,
  ScheduledPost,
  Sale,
  InventoryItem,
  Customer,
  Invoice,
  Project,
} from './types';

const PRODUCT_NAMES = ['CRNMN Signature', 'Spicy Sambal', 'Cheesy Cheeza', 'Salted Caramel'];
const MONTHLY_GOAL = 10000;

const getBestSeller = (sales: Sale[]): string => {
  if (sales.length === 0) return 'N/A';
  const counts = sales.reduce(
    (acc, sale) => {
      acc[sale.product] = (acc[sale.product] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

// Main authenticated app component
function AuthenticatedApp(): React.ReactNode {
  const { isAuthenticated } = useAuth();
  const [useNewDesign, setUseNewDesign] = useState(false); // Toggle for new design - Start with old design to avoid white screen
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [sales, setSales] = useState<Sale[]>(MOCK_INITIAL_SALES);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INITIAL_INVENTORY);
  const [totalRevenue, setTotalRevenue] = useState<number>(() =>
    MOCK_INITIAL_SALES.reduce((sum, s) => sum + s.amount, 0),
  );
  const [customers, setCustomers] = useState<Customer[]>(MOCK_INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INITIAL_INVOICES);
  const [projects, setProjects] = useState<Project[]>([]);

  const [aiInsight, setAiInsight] = useState('');
  const [isBriefingLoading, setIsBriefingLoading] = useState(true);
  const [isBotConnected, setIsBotConnected] = useState(false);

  // Financial calculations (treating totalRevenue as Month-to-Date for simulation)
  const cogs = totalRevenue * 0.4; // Simulate COGS as 40% of revenue
  const fixedExpenses = 1500; // Simulate RM1500/month fixed costs
  const profit = totalRevenue - cogs - fixedExpenses;

  // Simulate real-time sales & inventory reduction
  useEffect(() => {
    const salesInterval = setInterval(() => {
      if (customers.length === 0) return;
      const randomProduct = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];

      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        product: randomProduct,
        amount: 8.9 + Math.random() * 2,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customerId: randomCustomer.id,
      };

      setSales((prev) => [newSale, ...prev].slice(0, 50));
      setTotalRevenue((prev) => prev + newSale.amount);

      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === randomCustomer.id
            ? {
                ...c,
                totalSpent: c.totalSpent + newSale.amount,
                lastSeen: new Date().toLocaleDateString('en-GB'),
              }
            : c,
        ),
      );

      setInventory((prevInv) =>
        prevInv.map((item) => {
          if (item.name.includes('Jagung') || item.name.includes('Cawan')) {
            return { ...item, stock: Math.max(0, item.stock - 1) };
          }
          return item;
        }),
      );
    }, 8000);

    return () => clearInterval(salesInterval);
  }, [customers]);

  // Simulate automatic post publishing
  useEffect(() => {
    const scheduledPost = scheduledPosts.find((p) => p.status === 'scheduled');
    if (scheduledPost) {
      const publishingTimeout = setTimeout(() => {
        setScheduledPosts((prev) =>
          prev.map((p) => (p.id === scheduledPost.id ? { ...p, status: 'publishing' } : p)),
        );
      }, 3000);

      const publishedTimeout = setTimeout(() => {
        setScheduledPosts((prev) =>
          prev.map((p) =>
            p.id === scheduledPost.id
              ? {
                  ...p,
                  status: 'published',
                  publishedAt: new Date().toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }
              : p,
          ),
        );
      }, 6000);

      return () => {
        clearTimeout(publishingTimeout);
        clearTimeout(publishedTimeout);
      };
    }
  }, [scheduledPosts]);

  // AI Strategic Advisor
  useEffect(() => {
    const generateInsight = async () => {
      setIsBriefingLoading(true);

      const bestSeller = getBestSeller(sales);
      const lowStockItems = inventory.filter((i) => i.stock < i.threshold);

      const prompt = `
            ${BASE_PROMPT}
            You are the AI Strategic Advisor for CORNMAN.
            Analyze the following real-time business data and provide ONE concise, actionable strategic recommendation in Bahasa Melayu.
            The recommendation should be direct, insightful, and help the user achieve their goal of RM10k/month revenue.

            CURRENT DATA:
            - Total Revenue (Month-to-Date): RM${totalRevenue.toFixed(2)}
            - Best-selling item (based on recent sales): ${bestSeller}
            - Low Stock Items: ${lowStockItems.map((i) => `${i.name} (${i.stock} units)`).join(', ') || 'None'}

            Based on this data, what is the SINGLE MOST IMPORTANT thing I should do right now?
            Keep it short (2-3 sentences), like a real-time alert from an advisor. Start with a clear header like 'CADANGAN STRATEGIK:' or 'AMARAN OPERASI:'.
        `;
      const insight = await generateGeminiContent(prompt);
      setAiInsight(insight);
      setIsBriefingLoading(false);
    };

    generateInsight(); // Initial call
    const insightInterval = setInterval(generateInsight, 60000); // Update every 60 seconds

    return () => clearInterval(insightInterval);
  }, [sales, inventory, totalRevenue]);

  const handleSchedule = useCallback(
    (platform: ComposerCardData['title'], content: string, icon: React.ReactNode) => {
      const newPost: ScheduledPost = {
        id: `post-${Date.now()}`,
        platform,
        icon,
        content,
        scheduledAt: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'scheduled',
      };
      setScheduledPosts((prevPosts) => [newPost, ...prevPosts]);
    },
    [],
  );

  const handleManualRestock = useCallback((itemId: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, stock: item.stock + 50 } : item)),
    );
  }, []);

  const handleAutoRestock = useCallback(
    (itemName: string) => {
      let itemFound = false;
      const updatedInventory = inventory.map((item) => {
        if (item.name.toLowerCase().includes(itemName.toLowerCase())) {
          itemFound = true;
          return { ...item, stock: item.stock + 50 };
        }
        return item;
      });

      if (itemFound) {
        setInventory(updatedInventory);
        return `Pesanan untuk 50 unit ${itemName} telah dibuat. Stok dikemaskini.`;
      }
      return `Item '${itemName}' tidak dijumpai dalam inventori.`;
    },
    [inventory],
  );

  const handleGenerateInvoice = useCallback(
    (sale: Sale) => {
      const customer = customers.find((c) => c.id === sale.customerId);
      if (!customer) return;

      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        customerName: customer.name,
        amount: sale.amount,
        date: new Date().toLocaleDateString('en-GB'),
        status: Math.random() > 0.5 ? 'paid' : 'pending',
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    },
    [customers],
  );

  const handleAddCustomer = useCallback((name: string, phone: string) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      lastSeen: new Date().toLocaleDateString('en-GB'),
      totalSpent: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  }, []);

  const handleConnectBot = useCallback(() => {
    setIsBotConnected(true);
  }, []);

  const handleAddProject = useCallback((title: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.split('\n')[0].replace('NAMA:', '').trim(), // Extract title
      description: title,
      status: 'Perancangan',
      tasks: [
        { id: 'task1', text: 'Kaji kos bahan & harga jualan', completed: false },
        { id: 'task2', text: 'Reka pembungkusan / visual', completed: false },
        { id: 'task3', text: 'Rancang strategi pelancaran', completed: false },
        { id: 'task4', text: 'Laksanakan pelancaran', completed: false },
      ],
    };
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const handleToggleTask = useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t,
          );
          return { ...p, tasks: updatedTasks };
        }
        return p;
      }),
    );
  }, []);

  // Show new design system if toggle is enabled
  if (useNewDesign) {
    return (
      <ThemeProvider defaultTheme="dark">
        <AppLayout
          financials={{
            totalRevenue,
            cogs,
            expenses: fixedExpenses,
            profit,
            goal: MONTHLY_GOAL,
          }}
          aiInsight={aiInsight}
          isBriefingLoading={isBriefingLoading}
        />
        {/* Floating toggle button */}
        <button
          onClick={() => setUseNewDesign(false)}
          className="fixed top-4 right-4 z-50 bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-mono text-body-sm font-bold uppercase tracking-wide hover:bg-brand-electric-dark transition-all duration-200 shadow-glow-brand"
        >
          Show Old Design
        </button>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <PhoneShellProvider>
        {/* Toggle button for old design */}
        <button
          onClick={() => setUseNewDesign(true)}
          className="fixed top-4 right-4 z-50 bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-mono text-body-sm font-bold uppercase tracking-wide hover:bg-brand-electric-dark transition-all duration-200 shadow-glow-brand"
        >
          Show New Design
        </button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />

          <main className="space-y-8 sm:space-y-12 lg:space-y-16">
            <BusinessOS
              sales={sales}
              inventory={inventory}
              totalRevenue={totalRevenue}
              onRestock={handleManualRestock}
              aiInsight={aiInsight}
              isBriefingLoading={isBriefingLoading}
              onAutoRestock={handleAutoRestock}
              scheduledPosts={scheduledPosts}
              marketingCards={MARKETING_CARDS}
              onSchedulePost={handleSchedule}
              invoices={invoices}
              onGenerateInvoice={handleGenerateInvoice}
              customers={customers}
              onAddCustomer={handleAddCustomer}
              isBotConnected={isBotConnected}
              financials={{
                totalRevenue,
                cogs,
                expenses: fixedExpenses,
                profit,
                goal: MONTHLY_GOAL,
              }}
            />

            <Section
              title="SYSTEM HANDOVER & STATUS"
              subtitle="Command center integration and monitoring"
              titleGradient
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex-grow lg:flex-[2]">
                  <SystemHandover isBotConnected={isBotConnected} onConnect={handleConnectBot} />
                </div>
                <div className="lg:flex-[1]">
                  <SystemStatus
                    isBotConnected={isBotConnected}
                    isBriefingLoading={isBriefingLoading}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="C.R.E.W. (Command, Research, Execution, Win)"
              subtitle="Strategic intelligence and project management suite"
              titleGradient
            >
              <div>
                <h3 className="font-heading text-heading-lg mb-6 text-dark-300 uppercase tracking-wider">
                  IDEA GENERATION SUITE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                  {PRODUCT_CARDS.map((card) => {
                    if (card.type === 'image') {
                      return <ImageGeneratorCard key={card.id} {...card} />;
                    }
                    return (
                      <GeneratorCard
                        key={card.id}
                        {...(card as GeneratorCardData)}
                        onSaveAsProject={handleAddProject}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                  {GROWTH_CARDS.map((card) => (
                    <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                  {BIZ_OPS_CARDS.map((card) => (
                    <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
                  ))}
                </div>
              </div>
              <div className="mt-12">
                <ProjectCrew projects={projects} onToggleTask={handleToggleTask} />
              </div>
            </Section>

            <Section
              title="EMPIRE ROADMAP"
              subtitle="Strategic expansion and growth trajectory"
              titleGradient
            >
              <Roadmap data={ROADMAP_DATA} />
            </Section>
          </main>
        </div>
      </PhoneShellProvider>
    </ThemeProvider>
  );
}

// Main App with real-time sync and offline capabilities
function App(): React.ReactNode {
  return (
    <AuthProvider>
      <AppWithFeatures />
    </AuthProvider>
  );
}

// App with advanced features
function AppWithFeatures(): React.ReactNode {
  const { isAuthenticated, loading } = useAuth();

  // Set up real-time sync callbacks
  const realtimeCallbacks = {
    onSaleUpdate: (sale: Sale) => {
      console.log('Real-time sale update:', sale);
      // Handle real-time sale updates
    },
    onInventoryUpdate: (item: InventoryItem) => {
      console.log('Real-time inventory update:', item);
      // Handle real-time inventory updates
    },
    onCustomerUpdate: (customer: Customer) => {
      console.log('Real-time customer update:', customer);
      // Handle real-time customer updates
    },
  };

  // Initialize real-time sync
  const { isConnected, triggerSync, hasUnreadChanges, activeUsers } =
    useRealTimeSync(realtimeCallbacks);

  // Initialize offline capabilities
  const { isOnline, canUseApp, saveToOffline } = useOffline();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-electric rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <span className="text-dark-900 font-display text-display-sm font-bold">C</span>
          </div>
          <h1 className="font-display text-heading-lg text-brand-electric mb-2">CORNMAN</h1>
          <p className="text-body-md text-dark-400 font-mono">Loading Strategic HQ...</p>
          <div className="mt-4">
            <div className="animate-spin w-6 h-6 border-2 border-brand-electric border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <OfflineIndicator />
      </>
    );
  }

  // Show main app with all features
  return (
    <>
      <AuthenticatedApp />
      <OfflineIndicator />

      {/* Real-time status in dev mode */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-dark-800 border border-dark-600 rounded-lg p-3 font-mono text-xs space-y-1">
          <div
            className={`flex items-center gap-2 ${isOnline ? 'text-status-success' : 'text-status-error'}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-status-success' : 'bg-status-error'} animate-pulse`}
            ></div>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <div
            className={`flex items-center gap-2 ${isConnected ? 'text-brand-electric' : 'text-dark-400'}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-brand-electric' : 'bg-dark-400'}`}
            ></div>
            Real-time: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="text-dark-300">Active users: {activeUsers}</div>
          {hasUnreadChanges && <div className="text-accent-orange">Unread changes available</div>}
        </div>
      )}
    </>
  );
}

export default App;
