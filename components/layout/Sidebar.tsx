'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  PieChart,
  BrainCircuit,
  WalletCards,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/income', label: 'Income & Salary', icon: WalletCards },
  { href: '/savings', label: 'Savings & Goals', icon: Target },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/reports', label: 'Reports & Analytics', icon: PieChart },
  { href: '/insights', label: 'AI Insights', icon: BrainCircuit },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800/80 p-4 shrink-0">
      <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
