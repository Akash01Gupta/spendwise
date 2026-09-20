'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { CurrencyCode, CategoryType } from '@/types';
import { CURRENCIES } from '@/lib/currencies';
import {
  Wallet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Building,
  DollarSign,
  ShieldCheck,
  Target,
  PiggyBank,
  Check,
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
}

interface FixedItem {
  id: string;
  category: CategoryType;
  description: string;
  amount: number;
}

export function OnboardingWizardModal({ isOpen }: OnboardingWizardModalProps) {
  const { user, completeOnboardingStatus } = useAuth();
  const { setCurrency, applyOnboardingSetup } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [userName, setUserName] = useState(user?.name || '');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');
  const [paydayDate, setPaydayDate] = useState<number>(1);
  const [baseSalary, setBaseSalary] = useState<number>(45000);

  // Fixed Expenses
  const [fixedExpenses, setFixedExpenses] = useState<FixedItem[]>([
    { id: 'f-1', category: 'Rent', description: 'Apartment Rent', amount: 8000 },
    { id: 'f-2', category: 'Electricity', description: 'Electricity & Utilities', amount: 1500 },
    { id: 'f-3', category: 'Mobile/Internet', description: 'Broadband & Mobile Plan', amount: 1200 },
  ]);

  // Savings Target & First Goal
  const [savingsTarget, setSavingsTarget] = useState<number>(10000);
  const [goalName, setGoalName] = useState<string>('MacBook Pro Fund');
  const [goalTargetAmount, setGoalTargetAmount] = useState<number>(80000);
  const [goalTargetDate, setGoalTargetDate] = useState<string>('2026-12-31');

  if (!isOpen) return null;

  const handleAddFixedExpense = () => {
    setFixedExpenses([
      ...fixedExpenses,
      {
        id: 'f-' + Date.now(),
        category: 'Personal/Other',
        description: 'Other Fixed Bill',
        amount: 1000,
      },
    ]);
  };

  const handleRemoveFixedExpense = (id: string) => {
    setFixedExpenses(fixedExpenses.filter((item) => item.id !== id));
  };

  const handleUpdateFixedExpense = (id: string, field: keyof FixedItem, val: any) => {
    setFixedExpenses(
      fixedExpenses.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleFinish = () => {
    // 1. Update currency & apply financial state in AppContext
    setCurrency(selectedCurrency);

    applyOnboardingSetup({
      name: userName || user?.name || 'User',
      currency: selectedCurrency,
      paydayDate,
      baseSalary,
      fixedExpenses: fixedExpenses.map((f) => ({
        category: f.category,
        description: f.description,
        amount: f.amount,
      })),
      savingsTarget,
      goalName,
      goalTargetAmount,
      goalTargetDate,
    });

    // 2. Mark onboarding complete in AuthContext
    completeOnboardingStatus({
      name: userName || user?.name,
      currency: selectedCurrency,
      baseSalary,
      paydayDate,
    });
  };

  const currentCurrencySymbol = CURRENCIES[selectedCurrency].symbol;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                {step}/4
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  {step === 1 && 'Personal Profile & Currency'}
                  {step === 2 && 'Monthly Salary & Payday'}
                  {step === 3 && 'Fixed Monthly Commitments'}
                  {step === 4 && 'Savings Target & Primary Goal'}
                </h3>
                <p className="text-[11px] text-slate-400">Step {step} of 4 • SpendWise Setup Wizard</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              {step === 1 && '25% Complete'}
              {step === 2 && '50% Complete'}
              {step === 3 && '75% Complete'}
              {step === 4 && '100% Ready'}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* STEP 1: Profile & Currency */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-3">
                <Building className="w-6 h-6 text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  Welcome aboard! Let's customize your financial profile so SpendWise can compute your exact daily <strong>Safe to Spend</strong> limits.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Akash Gupta"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 px-4 text-xs font-medium text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCurrency(c.code)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        selectedCurrency === c.code
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg font-black text-emerald-400">{c.symbol}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{c.code}</div>
                        <div className="text-[10px] text-slate-400">{c.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Monthly Salary */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  Enter your monthly base salary. This forms the foundation of your monthly financial budget.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Base Monthly Salary ({currentCurrencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-bold text-emerald-400">
                    {currentCurrencySymbol}
                  </span>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    placeholder="e.g. 45000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-base font-extrabold text-white outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Salary Credit Date (Day of Month)
                </label>
                <select
                  value={paydayDate}
                  onChange={(e) => setPaydayDate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 px-4 text-xs font-semibold text-white outline-none transition cursor-pointer"
                >
                  <option value={1}>1st of every month</option>
                  <option value={5}>5th of every month</option>
                  <option value={10}>10th of every month</option>
                  <option value={25}>25th of every month</option>
                  <option value={30}>Last day of month</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Fixed Expenses */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Fixed Commitments</h4>
                  <p className="text-[11px] text-slate-400">
                    Expenses that recur every month (Rent, Electricity, EMI, Wifi).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFixedExpense}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fixed Bill</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {fixedExpenses.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  >
                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleUpdateFixedExpense(item.id, 'category', e.target.value as CategoryType)
                      }
                      className="bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-xl py-2 px-3 outline-none"
                    >
                      <option value="Rent">🏠 Rent</option>
                      <option value="Electricity">💡 Electricity</option>
                      <option value="Mobile/Internet">📱 Broadband</option>
                      <option value="EMI">💳 EMI / Loan</option>
                      <option value="Medical">💊 Medical</option>
                      <option value="Education">📚 Education</option>
                      <option value="Personal/Other">🙏 Other Fixed</option>
                    </select>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateFixedExpense(item.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl py-2 px-3 outline-none"
                    />

                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-emerald-400">
                        {currentCurrencySymbol}
                      </span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleUpdateFixedExpense(item.id, 'amount', Number(e.target.value))
                        }
                        className="w-full bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-xl py-2 pl-7 pr-2 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFixedExpense(item.id)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-slate-900 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Fixed Commitments:</span>
                <span className="font-extrabold text-white text-sm">
                  {currentCurrencySymbol}
                  {fixedExpenses.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Savings Target & Primary Goal */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Monthly Savings Target ({currentCurrencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-bold text-emerald-400">
                    {currentCurrencySymbol}
                  </span>
                  <input
                    type="number"
                    value={savingsTarget}
                    onChange={(e) => setSavingsTarget(Number(e.target.value))}
                    placeholder="e.g. 10000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-base font-extrabold text-white outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Recommended: ~20% to 30% of your base monthly salary.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">Set Your First Savings Goal</h4>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. MacBook Pro Fund"
                    className="w-full bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-xl py-2 px-3 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Target Amount ({currentCurrencySymbol})
                    </label>
                    <input
                      type="number"
                      value={goalTargetAmount}
                      onChange={(e) => setGoalTargetAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-xl py-2 px-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={goalTargetDate}
                      onChange={(e) => setGoalTargetDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-xl py-2 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Finish Setup & Launch Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
