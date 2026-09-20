'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/categories';
import { formatCurrency } from '@/lib/currencies';
import { CategoryType } from '@/types';
import { Trash2, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function RecentTransactionsWidget() {
  const { expenses, incomes, currentMonth, deleteExpense, currency } = useApp();
  const [search, setSearch] = useState('');

  const monthExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .map((e) => ({ ...e, kind: 'EXPENSE' as const }));

  const monthIncomes = incomes
    .filter((i) => i.date.startsWith(currentMonth))
    .map((i) => ({ ...i, kind: 'INCOME' as const }));

  const allTransactions = [...monthExpenses, ...monthIncomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filtered = allTransactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      ('category' in t && t.category.toLowerCase().includes(search.toLowerCase())) ||
      ('type' in t && t.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Recent Activity</h3>
          <p className="text-xs text-slate-400">Transactions for selected month</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition w-full sm:w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          No transactions match your search.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Description</th>
                <th className="py-2.5 px-3 font-semibold">Category / Type</th>
                <th className="py-2.5 px-3 font-semibold">Method</th>
                <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                <th className="py-2.5 px-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 7).map((item) => {
                const isExpense = item.kind === 'EXPENSE';
                const catConfig = isExpense ? CATEGORIES[item.category as CategoryType] : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{item.date}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        {isExpense ? (
                          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span>{item.description}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isExpense ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                            catConfig?.badgeBg || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{catConfig?.icon || '📦'}</span>
                          <span>{item.category}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          💼 {item.type}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {isExpense ? item.paymentMethod : 'Bank Direct'}
                    </td>
                    <td
                      className={`py-2.5 px-3 font-bold text-right whitespace-nowrap ${
                        isExpense ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isExpense && (
                        <button
                          onClick={() => deleteExpense(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
