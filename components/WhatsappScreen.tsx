import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Sale, InventoryItem } from '../types';
import { QrCodeIcon } from './Icons';

interface WhatsappScreenProps {
  sales: Sale[];
  inventory: InventoryItem[];
  totalRevenue: number;
  onAutoRestock: (itemName: string) => string;
  isBotConnected: boolean;
}

export const WhatsappScreen = ({
  sales,
  inventory,
  totalRevenue,
  onAutoRestock,
  isBotConnected,
}: WhatsappScreenProps): React.ReactNode => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'command' | 'response'; content: string }[]>([
    {
      type: 'response',
      content: "Selamat datang ke CORNMAN Command Center. Taip 'help' untuk senarai arahan.",
    },
  ]);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = useCallback(() => {
    if (!input.trim()) return;

    const command = input.toLowerCase().trim();
    let response = "Maaf, arahan tidak dikenali. Taip 'help' untuk bantuan.";

    const helpText =
      'Arahan yang tersedia:\n- status jualan\n- check stok\n- stok rendah\n- revenue harini\n- order stok [nama item]';

    if (command === 'help') {
      response = helpText;
    } else if (command === 'status jualan') {
      const lastSale = sales[0];
      if (lastSale) {
        response = `Jualan terkini: ${lastSale.product} @ RM${lastSale.amount.toFixed(2)} pada ${lastSale.time}. Jumlah jualan: ${sales.length} transaksi.`;
      } else {
        response = 'Tiada data jualan lagi.';
      }
    } else if (command === 'check stok' || command === 'stok rendah') {
      const lowStockItems = inventory.filter((i) => i.stock < i.threshold);
      if (lowStockItems.length > 0) {
        response =
          'Amaran Stok Rendah:\n' +
          lowStockItems.map((i) => `- ${i.name}: ${i.stock} unit`).join('\n');
      } else {
        response = 'Semua stok berada pada paras selamat.';
      }
    } else if (command === 'revenue harini') {
      response = `Jumlah revenue setakat ini: RM${totalRevenue.toFixed(2)}`;
    } else if (command.startsWith('order stok')) {
      const itemName = command.replace('order stok', '').trim();
      if (itemName) {
        response = onAutoRestock(itemName);
      } else {
        response = "Sila nyatakan nama item untuk dipesan. Cth: 'order stok jagung'";
      }
    }

    setHistory((prev) => [
      ...prev,
      { type: 'command', content: input },
      { type: 'response', content: response },
    ]);
    setInput('');
  }, [input, sales, inventory, totalRevenue, onAutoRestock]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#ECE5DD] text-black">
      <header className="bg-[#075E54] text-white p-3 flex-shrink-0">
        <h3 className="font-bold">CORNMAN Bot</h3>
        <p className="text-xs">{isBotConnected ? 'online' : 'offline'}</p>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {isBotConnected ? (
          <>
            {history.map((line, index) => (
              <div
                key={index}
                className={`flex mb-3 ${line.type === 'command' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap text-sm ${
                    line.type === 'command' ? 'bg-[#DCF8C6]' : 'bg-white shadow'
                  }`}
                >
                  {line.content}
                </div>
              </div>
            ))}
            <div ref={endOfHistoryRef} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
            <QrCodeIcon className="w-16 h-16 mb-4" />
            <p className="font-bold text-lg">BOT OFFLINE</p>
            <p className="text-sm">Connect bot from the main dashboard to start.</p>
          </div>
        )}
      </div>

      {isBotConnected && (
        <footer className="bg-gray-200 p-2 flex-shrink-0">
          <div className="bg-white rounded-full flex items-center px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent w-full focus:outline-none"
              placeholder="Type a message"
            />
          </div>
        </footer>
      )}
    </div>
  );
};
