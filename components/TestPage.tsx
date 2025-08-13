import React from 'react';
import { AppLayout } from './layouts/AppLayout';

// Mock data for testing
const mockFinancials = {
  totalRevenue: 6750.5,
  cogs: 2700.2,
  expenses: 1500,
  profit: 2550.3,
  goal: 10000,
};

const mockAiInsight =
  'CADANGAN STRATEGIK: Berdasarkan trend jualan terkini, fokuslah pada produk Spicy Sambal kerana ia menunjukkan permintaan tinggi. Pertimbangkan untuk increase stok dan buat targeted marketing campaign untuk weekend ini.';

export const TestPage: React.FC = () => {
  return (
    <AppLayout financials={mockFinancials} aiInsight={mockAiInsight} isBriefingLoading={false} />
  );
};
