'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { SafeToSpendWidget } from '@/components/dashboard/SafeToSpendWidget';
import { ExpenseBreakdownWidget } from '@/components/dashboard/ExpenseBreakdownWidget';
import { SavingsProgressWidget } from '@/components/dashboard/SavingsProgressWidget';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { AddIncomeModal } from '@/components/dashboard/AddIncomeModal';
import { AddGoalModal } from '@/components/savings/AddGoalModal';
import { Plus, Download, Sparkles, LayoutDashboard } from 'lucide-react';
import { exportExpensesToCSV } from '@/lib/export';

export default function DashboardPage() {
  const { currentMonth, expenses, currency } = useApp();
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <span>Financial Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">
            Overview for <strong className="text-white font-semibold">{currentMonth}</strong> • Real-time income, expense & savings allocation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportExpensesToCSV(monthExpenses, currentMonth)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Income</span>
          </button>

          <button
            onClick={() => setIsGoalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Goal</span>
          </button>

          <button
            onClick={() => setIsExpenseOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metric Cards */}
      <MetricCards />

      {/* 🔥 Safe to Spend Dynamic Daily Limit Widget */}
      <SafeToSpendWidget />

      {/* 2 Column Section: Category Breakdown + Savings Goals Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdownWidget />
        <SavingsProgressWidget />
      </div>

      {/* Recent Activity Feed */}
      <RecentTransactionsWidget />

      {/* Modals */}
      <AddExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
      <AddIncomeModal isOpen={isIncomeOpen} onClose={() => setIsIncomeOpen(false)} />
      <AddGoalModal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} />
    </div>
  );
}
