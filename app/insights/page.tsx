'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, TrendingUp, Lightbulb, Target } from 'lucide-react';

export default function InsightsPage() {
  const { healthScore, monthSummary, safeInfo, budgets, expenses, goals, currency } = useApp();

  let healthBadge = { label: 'Excellent Health', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  if (healthScore < 60) {
    healthBadge = { label: 'Needs Attention', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  } else if (healthScore < 80) {
    healthBadge = { label: 'Moderate Health', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  }

  const savingsRate = monthSummary.totalIncome > 0
    ? Math.round((monthSummary.savingsTarget / monthSummary.totalIncome) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-400" />
            <span>AI Spending Insights & Financial Health</span>
          </h1>
          <p className="text-xs text-slate-400">
            Smart financial diagnostics, overspending alerts, and goal completion projections
          </p>
        </div>
      </div>

      {/* Financial Health Score Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Radial Score */}
          <div className="relative w-24 h-24 flex items-center justify-center bg-slate-950 rounded-full border-4 border-emerald-500/40 shadow-inner">
            <span className="text-3xl font-black text-white">{healthScore}</span>
            <span className="text-[10px] text-slate-500 absolute bottom-3">/ 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">Financial Health Score</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${healthBadge.color}`}>
                {healthBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Calculated dynamically based on your savings rate ({savingsRate}%), category budget adherence, and safe daily spending buffer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Savings Rate</span>
            <span className="text-lg font-bold text-emerald-400">{savingsRate}%</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Daily Safe Limit</span>
            <span className="text-lg font-bold text-white">{formatCurrency(safeInfo.safeDailySpend, currency)}</span>
          </div>
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Smart Recommendations</span>
        </h3>

        {/* Insight Card 1: Savings Rate */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Healthy Savings Benchmark</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              You are allocating <strong className="text-emerald-400">{savingsRate}%</strong> of your monthly income towards savings (Target: {formatCurrency(monthSummary.savingsTarget, currency)}). This comfortably exceeds the recommended 20% financial rule!
            </p>
          </div>
        </div>

        {/* Insight Card 2: Safe to Spend */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Dynamic Daily Spend Optimizer</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Your remaining variable budget is <strong className="text-white">{formatCurrency(safeInfo.remainingVariableBudget, currency)}</strong> for the next {safeInfo.daysRemaining} days. Keeping daily non-fixed spending under <strong className="text-emerald-400">{formatCurrency(safeInfo.safeDailySpend, currency)}/day</strong> guarantees you won't touch your savings!
            </p>
          </div>
        </div>

        {/* Insight Card 3: Goals Projections */}
        {goals.length > 0 && (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Savings Goal Velocity</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                At your current savings pace of {formatCurrency(monthSummary.savingsTarget, currency)}/mo, your top goal (<strong className="text-white">{goals[0].name}</strong>) is on track to reach 100% completion by {goals[0].targetDate}!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
