import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import type { Customer } from '../types';
import { AiButton } from './UI';

interface CustomerHubProps {
  customers: Customer[];
  onAddCustomer: (name: string, phone: string) => void;
}

export const CustomerHub = ({ customers, onAddCustomer }: CustomerHubProps): React.ReactNode => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      onAddCustomer(name, phone);
      setName('');
      setPhone('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardContent>
            <CardTitle>👥 CUSTOMER HUB</CardTitle>
            <CardDescription>
              Manage customer relationships, track loyalty, and view history.
            </CardDescription>
            <div className="mt-6 bg-black p-4 rounded-lg">
              <div className="overflow-x-auto h-[400px]">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-black sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Last Seen
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {customers
                      .sort((a, b) => b.totalSpent - a.totalSpent)
                      .map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-gray-700 hover:bg-[#1E1E1E]"
                        >
                          <td className="px-6 py-4 font-bold">{customer.name}</td>
                          <td className="px-6 py-4 font-mono">{customer.phone}</td>
                          <td className="px-6 py-4">{customer.lastSeen}</td>
                          <td className="px-6 py-4 font-mono text-green-400">
                            RM{customer.totalSpent.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent>
            <CardTitle>➕ ADD NEW CUSTOMER</CardTitle>
            <CardDescription>Add a new customer to your CRM database.</CardDescription>
            <form
              onSubmit={handleSubmit}
              className="bg-black p-4 rounded-lg mt-6 flex flex-col gap-4"
            >
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1E1E1E] border border-gray-600 text-white text-sm rounded-lg focus:ring-[#39FF14] focus:border-[#39FF14] block w-full p-2.5"
                  placeholder="e.g. Ali bin Abu"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#1E1E1E] border border-gray-600 text-white text-sm rounded-lg focus:ring-[#39FF14] focus:border-[#39FF14] block w-full p-2.5"
                  placeholder="e.g. 012-3456789"
                  required
                />
              </div>
              <AiButton type="submit" className="mt-4">
                SAVE CUSTOMER
              </AiButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
