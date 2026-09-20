'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const { addSavingGoal } = useApp();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('2027-03-31');
  const [icon, setIcon] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(targetAmount);
    if (!name || isNaN(num) || num <= 0) return;

    addSavingGoal({
      name,
      targetAmount: num,
      targetDate: targetDate || '2027-03-31',
      icon: icon || '🎯',
    });

    setName('');
    setTargetAmount('');
    onClose();
  };

  const EMOJI_OPTIONS = ['💻', '🛡️', '🏍️', '🏖️', '🏠', '🚗', '📱', '💍', '🎓', '🎯'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Savings Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. MacBook Pro Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Target Target Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 80000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-lg font-bold outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Icon & Target Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Select Emoji
            </label>
            <div className="flex gap-1 overflow-x-auto p-1 bg-slate-950 border border-slate-800 rounded-xl scrollbar-none">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`p-1.5 text-lg rounded-lg transition ${
                    icon === e ? 'bg-emerald-500/20 border border-emerald-500/40' : 'hover:bg-slate-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Target Date
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
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
            Create Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}
