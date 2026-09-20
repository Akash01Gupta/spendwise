'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { AddIncomeModal } from '@/components/dashboard/AddIncomeModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        onOpenAddExpense={() => setIsExpenseOpen(true)}
        onOpenAddIncome={() => setIsIncomeOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      <AddExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
      <AddIncomeModal isOpen={isIncomeOpen} onClose={() => setIsIncomeOpen(false)} />
    </div>
  );
}
