'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { AddIncomeModal } from '@/components/dashboard/AddIncomeModal';
import { WalletCards, Plus, Trash2, Calendar, TrendingUp, Sparkles, Building2 } from 'lucide-react';

export default function IncomePage() {
  const { incomes, currentMonth, deleteIncome, currency } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const monthIncomes = incomes.filter((i) => i.month === currentMonth);
  const totalMonthIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const baseSalary = monthIncomes.find((i) => i.type === 'Salary')?.amount || 35000;
  const additionalIncome = totalMonthIncome - baseSalary;

  // Annual calculation
  const projectedAnnual = totalMonthIncome * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <WalletCards className="w-6 h-6 text-emerald-400" />
            <span>Income & Salary Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage your monthly salary, incentives, bonuses, and side income streams
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 bg-slate-900/90 border border-emerald-500/20 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Month Income
            </span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {formatCurrency(totalMonthIncome, currency)}
          </div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">
            Active Month: {currentMonth}
          </p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Base Monthly Salary
            </span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {formatCurrency(baseSalary, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Payout Date: 1st of every month
          </p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Projected Annual Income
            </span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {formatCurrency(projectedAnnual, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Based on current monthly earnings rate
          </p>
        </div>
      </div>

      {/* Income Sources Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-white mb-4">Logged Income Entries</h3>

        {monthIncomes.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No income sources logged for {currentMonth}. Click "+ Add Income" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Type</th>
                  <th className="py-3 px-3 font-semibold">Description</th>
                  <th className="py-3 px-3 font-semibold">Date Received</th>
                  <th className="py-3 px-3 font-semibold text-right">Amount</th>
                  <th className="py-3 px-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monthIncomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        💼 {inc.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">{inc.description}</td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{inc.date}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 text-right whitespace-nowrap text-sm">
                      +{formatCurrency(inc.amount, currency)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => deleteIncome(inc.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                        title="Delete Income Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddIncomeModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
