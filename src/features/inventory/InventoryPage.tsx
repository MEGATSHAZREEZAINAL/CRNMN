import React from 'react';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';

const InventoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      
      <main className="space-y-8 sm:space-y-12 lg:space-y-16">
        <Section
          title="INVENTORY MANAGEMENT"
          subtitle="Track stock levels, manage suppliers, and optimize inventory"
          titleGradient
        >
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <h3 className="font-heading text-heading-md text-dark-100 mb-4">
              📦 Inventory Dashboard
            </h3>
            <p className="text-dark-300">
              Inventory management features will be implemented here.
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
};

export default InventoryPage;
