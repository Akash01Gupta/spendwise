'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/currencies';
import { SavingGoal } from '@/types';
import { DepositGoalModal } from '@/components/savings/DepositGoalModal';
import { AddGoalModal } from '@/components/savings/AddGoalModal';
import { Target, Plus, Trash2, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

export default function SavingsPage() {
  const { goals, savingsTarget, setSavingsTarget, deleteGoal, currency, monthSummary } = useApp();

  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(savingsTarget.toString());

  const totalSavedAcrossGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const handleSaveTarget = () => {
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0) {
      setSavingsTarget(val);
    }
    setIsEditingTarget(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            <span>Savings & Goal Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">
            Set your monthly savings targets and build funds for major life goals
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Target Setting & Summary Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Target Card */}
        <div className="p-5 bg-gradient-to-br from-blue-500/20 to-indigo-500/5 bg-slate-900/90 border border-blue-500/20 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monthly Savings Target
            </span>
            <button
              onClick={() => setIsEditingTarget(!isEditingTarget)}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              {isEditingTarget ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingTarget ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold outline-none text-lg"
              />
              <button
                onClick={handleSaveTarget}
                className="px-3 py-1.5 bg-blue-500 text-white font-bold text-xs rounded-xl"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-3xl font-black text-white mt-2">
              {formatCurrency(savingsTarget, currency)}
            </div>
          )}

          <p className="text-xs text-blue-400 mt-1 font-medium">
            {monthSummary.totalIncome > 0
              ? Math.round((savingsTarget / monthSummary.totalIncome) * 100)
              : 0}
            % of monthly income target
          </p>
        </div>

        {/* Total Accumulated across goals */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Goals Capital
            </span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {formatCurrency(totalAccumulated(goals), currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Across {goals.length} active savings goals
          </p>
        </div>

        {/* Status */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Goal Completion Rate
            </span>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {goals.length > 0 ? getAverageCompletion(goals) : 0}%
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Average progress score</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">Your Financial Goals</h3>

        {goals.length === 0 ? (
          <div className="py-12 bg-slate-900/80 border border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
            No savings goals set yet. Click "+ Create Goal" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              const isCompleted = g.currentAmount >= g.targetAmount;

              return (
                <div
                  key={g.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 bg-slate-950 border border-slate-800 rounded-xl">
                        {g.icon || '🎯'}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{g.name}</h4>
                        <p className="text-xs text-slate-400">Target Date: {g.targetDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Completed!
                        </span>
                      ) : (
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block">Saved Amount</span>
                      <span className="text-lg font-black text-white">
                        {formatCurrency(g.currentAmount, currency)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block">Target Goal</span>
                      <span className="text-lg font-black text-slate-300">
                        {formatCurrency(g.targetAmount, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex items-center">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span>{pct}% Achieved</span>
                      <span>
                        Remaining: {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount), currency)}
                      </span>
                    </div>
                  </div>

                  {/* Deposit Button */}
                  <button
                    onClick={() => setSelectedGoal(g)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Deposit Savings Funds</span>
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

      <AddGoalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}

function totalAccumulated(goals: SavingGoal[]): number {
  return goals.reduce((s, g) => s + g.currentAmount, 0);
}

function getAverageCompletion(goals: SavingGoal[]): number {
  if (goals.length === 0) return 0;
  const sumPct = goals.reduce((s, g) => s + Math.min(100, (g.currentAmount / g.targetAmount) * 100), 0);
  return Math.round(sumPct / goals.length);
}
