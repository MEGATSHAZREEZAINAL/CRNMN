import React, { useState } from 'react';
import { Card } from './Card';
import { OperationsDashboard } from './OperationsDashboard';
import { AiStrategicBriefing } from './AiStrategicBriefing';
import { WhatsappBotSimulator } from './WhatsappBotSimulator';
import { ContentScheduler } from './ContentScheduler';
import { FinanceHub } from './FinanceHub';
import { CustomerHub } from './CustomerHub';
import { WebsiteHub } from './WebsiteHub';
import { ComposerCard } from './ComposerCard';
import { ChartPieIcon, CurrencyDollarIcon, UsersIcon, GlobeAltIcon } from './Icons';

import type {
  Sale,
  InventoryItem,
  ScheduledPost,
  ComposerCardData,
  Invoice,
  Customer,
  Financials,
} from '../types';

interface BusinessOSProps {
  sales: Sale[];
  inventory: InventoryItem[];
  totalRevenue: number;
  onRestock: (itemId: string) => void;
  aiInsight: string;
  isBriefingLoading: boolean;
  onAutoRestock: (itemName: string) => string;
  scheduledPosts: ScheduledPost[];
  marketingCards: Omit<ComposerCardData, 'onSchedule'>[];
  onSchedulePost: (
    platform: ComposerCardData['title'],
    content: string,
    icon: React.ReactNode,
  ) => void;
  invoices: Invoice[];
  onGenerateInvoice: (sale: Sale) => void;
  customers: Customer[];
  onAddCustomer: (name: string, phone: string) => void;
  isBotConnected: boolean;
  financials: Financials;
}

type Tab = 'dashboard' | 'finance' | 'customers' | 'website' | 'marketing';

export const BusinessOS = (props: BusinessOSProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; name: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <ChartPieIcon className="w-5 h-5" /> },
    { id: 'finance', name: 'Pusat Kewangan', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { id: 'customers', name: 'Customer Hub', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'website', name: 'Website Hub', icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: 'marketing', name: 'Marketing', icon: <span className="text-xl">📢</span> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <OperationsDashboard
                sales={props.sales}
                inventory={props.inventory}
                totalRevenue={props.totalRevenue}
                onRestock={props.onRestock}
                onGenerateInvoice={props.onGenerateInvoice}
              />
            </div>
            <div className="flex flex-col gap-8">
              <AiStrategicBriefing insight={props.aiInsight} isLoading={props.isBriefingLoading} />
              <WhatsappBotSimulator
                sales={props.sales}
                inventory={props.inventory}
                totalRevenue={props.totalRevenue}
                onAutoRestock={props.onAutoRestock}
                isBotConnected={props.isBotConnected}
              />
            </div>
          </div>
        );
      case 'finance':
        return <FinanceHub invoices={props.invoices} financials={props.financials} />;
      case 'customers':
        return <CustomerHub customers={props.customers} onAddCustomer={props.onAddCustomer} />;
      case 'website':
        return <WebsiteHub />;
      case 'marketing':
        return (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {props.marketingCards.map((card) => (
                <ComposerCard
                  key={card.id}
                  {...card}
                  onSchedule={(content) => props.onSchedulePost(card.title, content, card.icon)}
                />
              ))}
            </div>
            <div className="mt-8">
              <h3 className="font-teko text-3xl mb-4 text-gray-400">
                CONTENT SCHEDULER & AUTO-PUBLISHING
              </h3>
              <ContentScheduler posts={props.scheduledPosts} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-12">
      <div className="flex flex-wrap items-center border-b border-[#333] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-teko text-2xl px-6 py-3 flex items-center gap-2 border-b-4 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-[#39FF14] text-[#39FF14]'
                : 'border-transparent text-gray-500 hover:text-white hover:border-gray-700'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="p-4">{renderContent()}</div>
    </Card>
  );
};
