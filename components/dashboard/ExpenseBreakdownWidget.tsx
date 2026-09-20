'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/categories';
import { CategoryType } from '@/types';
import { formatCurrency } from '@/lib/currencies';
import { PieChart } from 'lucide-react';
import Link from 'next/link';

export function ExpenseBreakdownWidget() {
  const { expenses, currentMonth, monthSummary, currency } = useApp();

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  // Aggregate by category
  const categoryTotals: Record<CategoryType, number> = {
    Rent: 0,
    Food: 0,
    Transport: 0,
    Electricity: 0,
    'Mobile/Internet': 0,
    Shopping: 0,
    Entertainment: 0,
    Medical: 0,
    Education: 0,
    EMI: 0,
    'Personal/Other': 0,
  };

  monthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Expense Breakdown</h3>
          </div>
          <Link
            href="/expenses"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            View All →
          </Link>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No expenses logged for this month yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCategories.slice(0, 5).map(([catName, amount]) => {
              const catConfig = CATEGORIES[catName as CategoryType];
              const pct =
                monthSummary.totalExpenses > 0
                  ? Math.round((amount / monthSummary.totalExpenses) * 100)
                  : 0;

              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{catConfig?.icon || '📦'}</span>
                      <span className="font-semibold text-slate-200">{catName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {formatCurrency(amount, currency)}
                      </span>
                      <span className="text-slate-500 w-8 text-right font-medium">{pct}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: catConfig?.color || '#10B981',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>Total Logged</span>
        <span className="font-bold text-white">{formatCurrency(monthSummary.totalExpenses, currency)}</span>
      </div>
    </div>
  );
}
