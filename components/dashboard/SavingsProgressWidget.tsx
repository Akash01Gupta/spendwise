'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { Target, Plus } from 'lucide-react';
import { SavingGoal } from '@/types';
import { DepositGoalModal } from '@/components/savings/DepositGoalModal';
import Link from 'next/link';

export function SavingsProgressWidget() {
  const { goals, currency } = useApp();
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Savings Goals</h3>
          </div>
          <Link
            href="/savings"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            Manage →
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No savings goals set yet.
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

              return (
                <div key={g.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.icon || '🎯'}</span>
                      <span className="font-bold text-white">{g.name}</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(g.currentAmount, currency)} / {formatCurrency(g.targetAmount, currency)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex items-center">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-bold text-slate-200">{pct}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedGoal(g)}
                    className="w-full py-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Deposit Funds
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DepositGoalModal
        goal={selectedGoal}
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
      />
    </div>
  );
}
