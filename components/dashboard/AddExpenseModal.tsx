'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { CategoryType, PaymentMethod } from '@/types';
import { CATEGORY_LIST, CATEGORIES } from '@/lib/categories';
import { Plus } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { addExpense, currentMonth } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(`${currentMonth}-15`);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addExpense({
      amount: numAmount,
      category,
      description: description || category + ' expense',
      date: date || `${currentMonth}-15`,
      paymentMethod,
      isRecurring,
    });

    // Reset
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-lg font-bold outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

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

        {/* Date & Payment Method */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
            >
              <option value="UPI">UPI (GPay/PhonePe)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Description / Note
          </label>
          <input
            type="text"
            placeholder="e.g. Swiggy Lunch order"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Recurring Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          <div>
            <span className="text-sm font-medium text-white">Fixed / Recurring Expense</span>
            <p className="text-xs text-slate-400">Monthly subscription, rent, or fixed bill</p>
          </div>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Submit button */}
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
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
}
