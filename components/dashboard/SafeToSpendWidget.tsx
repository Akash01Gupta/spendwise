'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { ShieldCheck, AlertTriangle, AlertCircle, Sparkles, Calendar, TrendingDown } from 'lucide-react';

export function SafeToSpendWidget() {
  const { safeInfo, currency } = useApp();

  const statusConfig = {
    SAFE: {
      title: 'Safe to Spend',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      progressColor: 'from-emerald-500 to-teal-400',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      message: `You are within your safe daily limit! You can spend up to ${formatCurrency(
        safeInfo.safeDailySpend,
        currency
      )} per day for the next ${safeInfo.daysRemaining} days.`,
    },
    CAUTION: {
      title: 'Approaching Limit',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      progressColor: 'from-amber-500 to-yellow-400',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      message: `Caution! You have used ${safeInfo.percentageUsed}% of your variable budget. Adjusted safe spend is ${formatCurrency(
        safeInfo.safeDailySpend,
        currency
      )}/day.`,
    },
    ALERT: {
      title: 'Over-Budget Alert ⚠️',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      progressColor: 'from-red-500 to-rose-400',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      message: `Over budget! Variable expenses exceed available funds. Reduce spending for remaining ${safeInfo.daysRemaining} days.`,
    },
  };

  const currentStatus = statusConfig[safeInfo.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Subtle Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
            <StatusIcon className={`w-5 h-5 ${currentStatus.iconColor}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Safe to Spend</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FEATURED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Dynamic Daily Budget Limit</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.badgeBg}`}>
          {currentStatus.title}
        </div>
      </div>

      {/* Big Number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4 items-center">
        <div className="md:col-span-1 p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Safe Daily Spend
          </span>
          <div className="text-3xl lg:text-4xl font-black text-white mt-1">
            {formatCurrency(safeInfo.safeDailySpend, currency)}
            <span className="text-sm font-medium text-slate-400 ml-1">/ day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>{safeInfo.daysRemaining} days remaining in month</span>
          </p>
        </div>

        {/* Breakdown Calculation pills */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Variable Budget Used ({safeInfo.percentageUsed}%)</span>
            <span className="font-bold text-white">
              {formatCurrency(safeInfo.spentVariableSoFar, currency)} /{' '}
              {formatCurrency(safeInfo.availableBudget, currency)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${currentStatus.progressColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, safeInfo.percentageUsed)}%` }}
            />
          </div>

          {/* Formula pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block">Salary</span>
              <span className="font-bold text-slate-200">
                {formatCurrency(safeInfo.monthlySalary, currency)}
              </span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block">Fixed Costs</span>
              <span className="font-bold text-slate-200">
                - {formatCurrency(safeInfo.fixedExpensesTotal, currency)}
              </span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block">Savings Target</span>
              <span className="font-bold text-slate-200">
                - {formatCurrency(safeInfo.savingsTarget, currency)}
              </span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block">Remaining Variable</span>
              <span className="font-bold text-emerald-400">
                = {formatCurrency(safeInfo.remainingVariableBudget, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message footer */}
      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 text-xs text-slate-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{currentStatus.message}</span>
      </div>
    </div>
  );
}
