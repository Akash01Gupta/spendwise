'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { SavingGoal } from '@/types';
import { formatCurrency } from '@/lib/currencies';
import confetti from 'canvas-confetti';

interface DepositGoalModalProps {
  goal: SavingGoal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepositGoalModal({ goal, isOpen, onClose }: DepositGoalModalProps) {
  const { depositToGoal, currency } = useApp();
  const [amount, setAmount] = useState<string>('');

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const nextTotal = goal.currentAmount + num;
    depositToGoal(goal.id, num);

    if (nextTotal >= goal.targetAmount) {
      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setAmount('');
    onClose();
  };

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit into ${goal.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Info Card */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{goal.icon || '🎯'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Goal: {formatCurrency(goal.targetAmount, currency)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Currently Saved: {formatCurrency(goal.currentAmount, currency)}</span>
            <span>Needed: {formatCurrency(remaining, currency)}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Deposit Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              placeholder={`e.g. ${Math.min(5000, remaining)}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-lg font-bold outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
          >
            Confirm Deposit
          </button>
        </div>
      </form>
    </Modal>
  );
}
