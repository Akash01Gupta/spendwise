'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { CategoryType } from '@/types';
import { CATEGORY_LIST, CATEGORIES } from '@/lib/categories';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: CategoryType;
}

export function SetBudgetModal({ isOpen, onClose, defaultCategory }: SetBudgetModalProps) {
  const { setCategoryBudget } = useApp();

  const [category, setCategory] = useState<CategoryType>(defaultCategory || 'Food');
  const [limitAmount, setLimitAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(limitAmount);
    if (isNaN(num) || num <= 0) return;

    setCategoryBudget(category, num);
    setLimitAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Category Budget Cap">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-emerald-500 transition"
          >
            {CATEGORY_LIST.map((cat) => {
              const info = CATEGORIES[cat];
              return (
                <option key={cat} value={cat}>
                  {info.icon} {info.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Monthly Limit */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Monthly Budget Cap
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 5000"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
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
            Save Budget Limit
          </button>
        </div>
      </form>
    </Modal>
  );
}
