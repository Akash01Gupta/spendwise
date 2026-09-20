'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORY_LIST, CATEGORIES } from '@/lib/categories';
import { CategoryType, PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/currencies';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { exportExpensesToCSV } from '@/lib/export';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  Repeat,
} from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, currentMonth, deleteExpense, currency } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPayment, setSelectedPayment] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  const filteredExpenses = monthExpenses.filter((exp) => {
    const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
    const matchesPayment = selectedPayment === 'ALL' || exp.paymentMethod === selectedPayment;
    const matchesSearch =
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesPayment && matchesSearch;
  });

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedSpent = monthExpenses
    .filter((e) => e.isRecurring || CATEGORIES[e.category]?.isFixedDefault)
    .reduce((sum, e) => sum + e.amount, 0);
  const variableSpent = totalSpent - fixedSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>Expense Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track, categorize, and control your monthly expenditures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpensesToCSV(monthExpenses, currentMonth)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
            Total Month Expenses
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(totalSpent, currency)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {monthExpenses.length} transaction entries
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
            Fixed Costs (Bills/Rent)
          </span>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {formatCurrency(fixedSpent, currency)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {totalSpent > 0 ? Math.round((fixedSpent / totalSpent) * 100) : 0}% of expenses
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
            Variable Spend
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(variableSpent, currency)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {totalSpent > 0 ? Math.round((variableSpent / totalSpent) * 100) : 0}% of expenses
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
            selectedCategory === 'ALL'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          ✨ All Categories
        </button>
        {CATEGORY_LIST.map((cat) => {
          const info = CATEGORIES[cat];
          const isSel = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                isSel
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>{info.icon}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No expenses found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Description</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold">Payment Method</th>
                  <th className="py-3 px-3 font-semibold">Type</th>
                  <th className="py-3 px-3 font-semibold text-right">Amount</th>
                  <th className="py-3 px-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredExpenses.map((exp) => {
                  const catConfig = CATEGORIES[exp.category];
                  return (
                    <tr key={exp.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs border ${
                            catConfig?.badgeBg || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{catConfig?.icon || '📦'}</span>
                          <span>{exp.category}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200">{exp.description}</td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{exp.date}</td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {exp.isRecurring ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Repeat className="w-3 h-3" /> Recurring
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500">One-time</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400 text-right whitespace-nowrap text-sm">
                        -{formatCurrency(exp.amount, currency)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddExpenseModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
