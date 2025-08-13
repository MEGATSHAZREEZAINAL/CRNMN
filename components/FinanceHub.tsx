import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import type { Invoice, Financials } from '../types';
import { AiButton } from './UI';
import { generateGeminiContent } from '../services/geminiService';
import { BASE_PROMPT } from '../constants';
import { ArrowTrendingUpIcon } from './Icons';

interface FinanceHubProps {
  invoices: Invoice[];
  financials: Financials;
}

const getStatusBadge = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return (
        <span className="text-xs font-bold text-green-900 bg-green-300 px-2 py-1 rounded-full">
          PAID
        </span>
      );
    case 'pending':
      return (
        <span className="text-xs font-bold text-yellow-900 bg-yellow-300 px-2 py-1 rounded-full">
          PENDING
        </span>
      );
    case 'overdue':
      return (
        <span className="text-xs font-bold text-red-900 bg-red-300 px-2 py-1 rounded-full">
          OVERDUE
        </span>
      );
  }
};

const GoalGauge = ({ value, goal }: { value: number; goal: number }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col">
        <CardTitle>🎯 KEMAJUAN MATLAMAT BULANAN</CardTitle>
        <CardDescription>Sasaran: RM{goal.toLocaleString()}/bulan</CardDescription>
        <div className="flex-grow flex items-center justify-center relative">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#2a2a2a" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#39FF14"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-teko text-5xl text-white">{percentage.toFixed(0)}%</span>
            <span className="font-mono text-sm text-gray-400">Tercapai</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfitLoss = ({ financials }: { financials: Financials }) => (
  <Card className="h-full">
    <CardContent>
      <CardTitle>📈 UNTUNG & RUGI (MTD)</CardTitle>
      <CardDescription>Ringkasan kewangan bulan-ke-tarikh.</CardDescription>
      <div className="bg-black p-4 mt-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Hasil Jualan</span>
          <span className="font-mono text-green-400">
            + RM {financials.totalRevenue.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Kos Barang Dijual (COGS)</span>
          <span className="font-mono text-yellow-400">- RM {financials.cogs.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Perbelanjaan Tetap</span>
          <span className="font-mono text-yellow-400">- RM {financials.expenses.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex justify-between items-center text-base">
          <span className="font-bold text-white">KEUNTUNGAN BERSIH</span>
          <span
            className={`font-mono font-bold ${financials.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            RM {financials.profit.toFixed(2)}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AiFinancialAdvisor = ({ financials }: { financials: Financials }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projection, setProjection] = useState('');

  const handleGenerateProjection = useCallback(async () => {
    setIsLoading(true);
    setProjection('AI sedang menganalisis data kewangan anda...');

    const prompt = `
            ${BASE_PROMPT}
            You are the AI Financial Analyst for CORNMAN.
            Your goal is to help the business achieve its RM${financials.goal.toFixed(2)}/month revenue target.

            CURRENT FINANCIAL SNAPSHOT (Month-to-Date):
            - Total Revenue: RM${financials.totalRevenue.toFixed(2)}
            - Cost of Goods Sold (COGS): RM${financials.cogs.toFixed(2)}
            - Fixed Expenses (Monthly): RM${financials.expenses.toFixed(2)}
            - Net Profit: RM${financials.profit.toFixed(2)}

            Based on this, provide:
            1.  **MONTH-END PROJECTION**: Project the most likely end-of-month revenue if current trends continue.
            2.  **STRATEGIC RECOMMENDATIONS**: Provide 2 concrete, actionable strategies to implement in the next 7 days to accelerate revenue growth towards the RM${financials.goal.toFixed(2)} goal. For each strategy, estimate the potential revenue impact.

            Format your response CLEARLY and CONCISELY in Bahasa Melayu, using markdown for structure:

            ### PROJEKSI HUJUNG BULAN
            *Anggaran Hasil:* **RM[Your projection here]**

            ### CADANGAN STRATEGIK (7 HARI AKAN DATANG)

            **1. [Nama Strategi 1]**
            *   **Tindakan:** [Langkah-langkah tindakan yang jelas]
            *   **Anggaran Impak Hasil:** +RM[Anggaran amaun]

            **2. [Nama Strategi 2]**
            *   **Tindakan:** [Langkah-langkah tindakan yang jelas]
            *   **Anggaran Impak Hasil:** +RM[Anggaran amaun]
        `;

    const result = await generateGeminiContent(prompt);
    setProjection(result);
    setIsLoading(false);
  }, [financials]);

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>💡 PENASIHAT KEWANGAN AI</CardTitle>
            <CardDescription>
              Dapatkan unjuran dan cadangan strategik untuk capai matlamat anda.
            </CardDescription>
          </div>
          <AiButton
            onClick={handleGenerateProjection}
            disabled={isLoading}
            className="max-w-[300px] flex items-center justify-center gap-2"
          >
            <ArrowTrendingUpIcon className="w-5 h-5" />
            <span>{isLoading ? 'MENGANALISIS...' : 'JANA UNJURAN & STRATEGI'}</span>
          </AiButton>
        </div>
        <div className="bg-black p-6 mt-4 rounded-lg min-h-[200px]">
          {isLoading && <p className="text-gray-400 animate-pulse">{projection}</p>}
          {!isLoading && projection && (
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: projection
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br />'),
              }}
            ></div>
          )}
          {!isLoading && !projection && (
            <div className="text-center text-gray-500 py-10">
              <p className="font-teko text-2xl">BERSEDIA UNTUK BERKEMBANG?</p>
              <p>Klik butang di atas untuk mendapatkan analisis kewangan daripada AI.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const FinanceHub = ({ invoices, financials }: FinanceHubProps): React.ReactNode => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GoalGauge value={financials.totalRevenue} goal={financials.goal} />
        <ProfitLoss financials={financials} />
      </div>

      <div className="mb-8">
        <AiFinancialAdvisor financials={financials} />
      </div>

      <Card>
        <CardContent>
          <CardTitle>🧾 PENJEJAKAN INVOIS</CardTitle>
          <CardDescription>Urus semua invois keluar anda di satu tempat.</CardDescription>
          <div className="mt-6 bg-black p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#1E1E1E]">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Invoice ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-700 hover:bg-[#1E1E1E]">
                      <td className="px-6 py-4 font-mono">{invoice.id}</td>
                      <td className="px-6 py-4">{invoice.customerName}</td>
                      <td className="px-6 py-4">{invoice.date}</td>
                      <td className="px-6 py-4 font-mono">RM{invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
