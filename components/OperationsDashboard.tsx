import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import type { Sale, InventoryItem } from '../types';
import { RestockButton, AiButton } from './UI';

interface OperationsDashboardProps {
  sales: Sale[];
  inventory: InventoryItem[];
  totalRevenue: number;
  onRestock: (itemId: string) => void;
  onGenerateInvoice: (sale: Sale) => void;
}

const SalesAnalytics = ({
  sales,
  totalRevenue,
  onGenerateInvoice,
}: {
  sales: Sale[];
  totalRevenue: number;
  onGenerateInvoice: (sale: Sale) => void;
}) => {
  const lastSale = sales[0];

  return (
    <Card>
      <CardContent>
        <CardTitle>📊 SALES ANALYTICS</CardTitle>
        <CardDescription>Real-time sales data and performance insights.</CardDescription>
        <div className="bg-black rounded-md mt-4 p-4">
          <div className="mb-4 flex justify-between items-end">
            <div>
              <p className="text-gray-400 text-sm">TOTAL REVENUE (Today)</p>
              <p className="font-teko text-4xl text-green-400 tracking-wider">
                RM {totalRevenue.toFixed(2)}
              </p>
            </div>
            {lastSale && (
              <AiButton
                onClick={() => onGenerateInvoice(lastSale)}
                className="text-sm !py-1 !px-3 max-w-[150px] !text-base"
              >
                Generate Invoice
              </AiButton>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">LIVE TRANSACTION FEED</p>
            <div className="h-40 overflow-y-auto pr-2">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex justify-between items-center text-sm border-b border-gray-800 last:border-b-0 py-1"
                >
                  <span className="text-gray-300">{sale.product}</span>
                  <span className="font-mono text-green-500">+RM {sale.amount.toFixed(2)}</span>
                  <span className="text-gray-500">{sale.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InventoryTracker = ({
  inventory,
  onRestock,
}: {
  inventory: InventoryItem[];
  onRestock: (itemId: string) => void;
}) => (
  <Card>
    <CardContent>
      <CardTitle>📦 INVENTORY TRACKER</CardTitle>
      <CardDescription>Smart inventory management with low-stock alerts.</CardDescription>
      <div className="bg-black rounded-md mt-4 p-4">
        <div className="h-[268px] overflow-y-auto pr-2">
          {inventory.map((item) => {
            const isLowStock = item.stock < item.threshold;
            const stockPercentage = (item.stock / (item.threshold * 2)) * 100;
            return (
              <div key={item.id} className="mb-3">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className={isLowStock ? 'text-red-400 font-bold' : 'text-gray-300'}>
                    {item.name}
                  </span>
                  <span
                    className={`font-mono ${isLowStock ? 'text-red-400 font-bold animate-pulse' : 'text-gray-400'}`}
                  >
                    {item.stock} unit(s)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`${isLowStock ? 'bg-red-500' : 'bg-green-500'} h-2.5 rounded-full`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
                {isLowStock && (
                  <div className="text-right mt-1">
                    <RestockButton onClick={() => onRestock(item.id)}>Restock</RestockButton>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const OperationsDashboard = ({
  sales,
  inventory,
  totalRevenue,
  onRestock,
  onGenerateInvoice,
}: OperationsDashboardProps): React.ReactNode => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <SalesAnalytics
      sales={sales}
      totalRevenue={totalRevenue}
      onGenerateInvoice={onGenerateInvoice}
    />
    <InventoryTracker inventory={inventory} onRestock={onRestock} />
  </div>
);
