'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { IncomeType } from '@/types';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddIncomeModal({ isOpen, onClose }: AddIncomeModalProps) {
  const { addIncome, currentMonth } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<IncomeType>('Salary');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(`${currentMonth}-01`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addIncome({
      amount: numAmount,
      type,
      description: description || type + ' income',
      date: date || `${currentMonth}-01`,
      month: currentMonth,
    });

    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Income Source">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Income Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 35000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-lg font-bold outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Income Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Income Category
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as IncomeType)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-emerald-500 transition"
          >
            <option value="Salary">💼 Monthly Salary</option>
            <option value="Bonus">🎁 Performance Bonus</option>
            <option value="Freelance">🚀 Freelance Project</option>
            <option value="Incentive">⭐ Incentive</option>
            <option value="Investment">📈 Investment Return / Dividend</option>
            <option value="Other">✨ Other Income</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Date Received
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly Salary Credit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
          />
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
            Save Income
          </button>
        </div>
      </form>
    </Modal>
  );
}
