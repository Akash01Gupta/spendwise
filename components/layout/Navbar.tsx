'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CurrencyCode } from '@/types';
import { CURRENCIES } from '@/lib/currencies';
import {
  Wallet,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  Plus,
} from 'lucide-react';

const MONTH_OPTIONS = [
  { value: '2026-07', label: 'July 2026' },
  { value: '2026-08', label: 'August 2026' },
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-12', label: 'December 2026' },
];

interface NavbarProps {
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
}

export function Navbar({ onOpenAddExpense, onOpenAddIncome }: NavbarProps) {
  const { currentMonth, setCurrentMonth, currency, setCurrency, resetDemoData } = useApp();
  const [showToast, setShowToast] = useState(false);

  const currentIdx = MONTH_OPTIONS.findIndex((m) => m.value === currentMonth);

  const handlePrevMonth = () => {
    if (currentIdx > 0) {
      setCurrentMonth(MONTH_OPTIONS[currentIdx - 1].value);
    }
  };

  const handleNextMonth = () => {
    if (currentIdx < MONTH_OPTIONS.length - 1) {
      setCurrentMonth(MONTH_OPTIONS[currentIdx + 1].value);
    }
  };

  const handleSeed = () => {
    resetDemoData();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            <Wallet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SpendWise
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Salary & Expense Tracker</p>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={handlePrevMonth}
            disabled={currentIdx <= 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800 rounded-lg transition"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="bg-transparent text-sm font-semibold text-white px-2 py-1 outline-none cursor-pointer text-center"
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextMonth}
            disabled={currentIdx >= MONTH_OPTIONS.length - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800 rounded-lg transition"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Actions */}
          <button
            onClick={onOpenAddExpense}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense</span>
          </button>

          {/* Currency Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Seed Demo Data Button */}
          <button
            onClick={handleSeed}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition cursor-pointer"
            title="Reload Sample Data for September 2026"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Demo Data</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 fill-slate-950" />
          <span>Sample financial data reloaded for September 2026!</span>
        </div>
      )}
    </header>
  );
}
