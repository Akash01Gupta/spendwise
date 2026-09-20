'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';
import { CategoryType } from '@/types';
import { formatCurrency } from '@/lib/currencies';
import { SetBudgetModal } from '@/components/budget/SetBudgetModal';
import { PiggyBank, Plus, AlertCircle, CheckCircle2, Edit3 } from 'lucide-react';

export default function BudgetsPage() {
  const { budgets, expenses, currentMonth, currency } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | undefined>(undefined);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthBudgets = budgets.filter((b) => b.month === currentMonth);

  const openSetModal = (cat?: CategoryType) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-emerald-400" />
            <span>Budget Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Set monthly spending caps per category and prevent overspending
          </p>
        </div>

        <button
          onClick={() => openSetModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Grid of Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_LIST.map((cat) => {
          const catConfig = CATEGORIES[cat];
          const budgetObj = monthBudgets.find((b) => b.category === cat);
          const limitAmount = budgetObj ? budgetObj.limitAmount : 0;

          const spentAmount = monthExpenses
            .filter((e) => e.category === cat)
            .reduce((s, e) => s + e.amount, 0);

          const leftAmount = limitAmount - spentAmount;
          const isOverBudget = limitAmount > 0 && spentAmount > limitAmount;
          const pct = limitAmount > 0 ? Math.round((spentAmount / limitAmount) * 100) : 0;

          return (
            <div
              key={cat}
              className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg space-y-3 transition ${
                isOverBudget
                  ? 'border-red-500/40 bg-red-500/5'
                  : limitAmount > 0 && pct >= 80
                  ? 'border-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{catConfig.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{cat}</h4>
                    <span className="text-[11px] text-slate-400">
                      {limitAmount > 0 ? `${pct}% Used` : 'No Budget Set'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openSetModal(cat)}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Cap
                </button>
              </div>

              {limitAmount === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-500 mb-2">Spent so far: {formatCurrency(spentAmount, currency)}</p>
                  <button
                    onClick={() => openSetModal(cat)}
                    className="text-xs text-emerald-400 font-semibold hover:underline"
                  >
                    + Set Monthly Cap
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget
                          ? 'bg-gradient-to-r from-red-500 to-rose-400'
                          : pct >= 80
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Amounts row */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Budget</span>
                      <span className="font-bold text-slate-200">
                        {formatCurrency(limitAmount, currency)}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Spent</span>
                      <span className="font-bold text-white">
                        {formatCurrency(spentAmount, currency)}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Left</span>
                      <span
                        className={`font-bold ${
                          isOverBudget ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatCurrency(leftAmount, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  {isOverBudget ? (
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>Over budget by {formatCurrency(Math.abs(leftAmount), currency)}! ⚠️</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>Within budget limit</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={editingCategory}
      />
    </div>
  );
}
