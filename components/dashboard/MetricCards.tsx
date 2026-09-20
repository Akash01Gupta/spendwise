'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { Wallet, TrendingDown, PiggyBank, Scale } from 'lucide-react';

export function MetricCards() {
  const { monthSummary, currency } = useApp();

  const cards = [
    {
      title: 'Monthly Salary',
      amount: monthSummary.totalIncome,
      subtext: `Base Salary: ${formatCurrency(monthSummary.baseSalary, currency)}`,
      icon: Wallet,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Total Expenses',
      amount: monthSummary.totalExpenses,
      subtext: `Fixed: ${formatCurrency(monthSummary.fixedExpenses, currency)} | Var: ${formatCurrency(
        monthSummary.variableExpenses,
        currency
      )}`,
      icon: TrendingDown,
      color: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Savings Target',
      amount: monthSummary.savingsTarget,
      subtext: `${
        monthSummary.totalIncome > 0
          ? Math.round((monthSummary.savingsTarget / monthSummary.totalIncome) * 100)
          : 0
      }% of Monthly Income`,
      icon: PiggyBank,
      color: 'from-blue-500/20 to-indigo-500/5',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Remaining Balance',
      amount: monthSummary.remainingBalance,
      subtext: monthSummary.remainingBalance >= 0 ? '🟢 Unallocated Surplus' : '🔴 Deficit Warning',
      icon: Scale,
      color:
        monthSummary.remainingBalance >= 0
          ? 'from-teal-500/20 to-emerald-500/5'
          : 'from-red-500/20 to-rose-500/5',
      borderColor:
        monthSummary.remainingBalance >= 0 ? 'border-teal-500/20' : 'border-red-500/20',
      iconColor: monthSummary.remainingBalance >= 0 ? 'text-teal-400' : 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${card.color} bg-slate-900/90 border ${card.borderColor} rounded-2xl p-5 shadow-lg hover:border-slate-700 transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-950/80 border ${card.borderColor}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl lg:text-3xl font-black text-white">
                {formatCurrency(card.amount, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
