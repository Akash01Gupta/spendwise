'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/categories';
import { CategoryType } from '@/types';
import { formatCurrency } from '@/lib/currencies';
import { exportExpensesToCSV } from '@/lib/export';
import {
  PieChart,
  Download,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export default function ReportsPage() {
  const { expenses, incomes, currentMonth, monthSummary, currency } = useApp();

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  // Category Donut Chart Data
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const pieData = Object.entries(categoryTotals)
    .filter(([_, amt]) => amt > 0)
    .map(([cat, amt]) => ({
      name: cat,
      value: amt,
      color: CATEGORIES[cat as CategoryType]?.color || '#10B981',
    }));

  // Historical Monthly Comparison Chart Data (July - December 2026)
  const monthlyTrendsData = [
    { month: 'Jul 26', Income: 35000, Expenses: 19500, Savings: 10000 },
    { month: 'Aug 26', Income: 35000, Expenses: 22000, Savings: 10000 },
    {
      month: 'Sep 26',
      Income: monthSummary.totalIncome,
      Expenses: monthSummary.totalExpenses,
      Savings: monthSummary.savingsTarget,
    },
    { month: 'Oct 26 (Est)', Income: 35000, Expenses: 21000, Savings: 10000 },
    { month: 'Nov 26 (Est)', Income: 40000, Expenses: 23000, Savings: 12000 },
    { month: 'Dec 26 (Est)', Income: 45000, Expenses: 25000, Savings: 15000 },
  ];

  // Savings Growth Cumulative Data
  const savingsGrowthData = [
    { month: 'Jul 26', SavingsCapital: 10000 },
    { month: 'Aug 26', SavingsCapital: 20000 },
    { month: 'Sep 26', SavingsCapital: 30000 },
    { month: 'Oct 26', SavingsCapital: 40000 },
    { month: 'Nov 26', SavingsCapital: 52000 },
    { month: 'Dec 26', SavingsCapital: 67000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Monthly Reports & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive financial charts, category breakdowns, and long-term savings trends
          </p>
        </div>

        <button
          onClick={() => exportExpensesToCSV(monthExpenses, currentMonth)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Financial Report (CSV)</span>
        </button>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expense Donut Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Category Breakdown ({currentMonth})</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Total: {formatCurrency(monthSummary.totalExpenses, currency)}
            </span>
          </div>

          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              No expenses recorded for this month.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), 'Amount']}
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1E293B',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Income vs Expense Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Income vs Expenses vs Savings</h3>
            </div>
            <span className="text-xs text-slate-400">6-Month Trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), '']}
                  contentStyle={{
                    backgroundColor: '#090D16',
                    borderColor: '#1E293B',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Savings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings Growth Area Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Savings Capital Growth Forecast</h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">+₹10,000 / month pace</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsGrowthData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), 'Savings Capital']}
                contentStyle={{
                  backgroundColor: '#090D16',
                  borderColor: '#1E293B',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="SavingsCapital"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#savingsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
