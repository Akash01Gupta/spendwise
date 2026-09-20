import { CategoryInfo, CategoryType } from '@/types';

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  Rent: {
    name: 'Rent',
    icon: '🏠',
    color: '#3B82F6', // Blue
    badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    isFixedDefault: true,
  },
  Food: {
    name: 'Food',
    icon: '🍔',
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    isFixedDefault: false,
  },
  Transport: {
    name: 'Transport',
    icon: '🚗',
    color: '#10B981', // Emerald
    badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    isFixedDefault: false,
  },
  Electricity: {
    name: 'Electricity',
    icon: '💡',
    color: '#EAB308', // Yellow
    badgeBg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    isFixedDefault: true,
  },
  'Mobile/Internet': {
    name: 'Mobile/Internet',
    icon: '📱',
    color: '#06B6D4', // Cyan
    badgeBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    isFixedDefault: true,
  },
  Shopping: {
    name: 'Shopping',
    icon: '🛒',
    color: '#EC4899', // Pink
    badgeBg: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    isFixedDefault: false,
  },
  Entertainment: {
    name: 'Entertainment',
    icon: '🎬',
    color: '#8B5CF6', // Purple
    badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    isFixedDefault: false,
  },
  Medical: {
    name: 'Medical',
    icon: '💊',
    color: '#EF4444', // Red
    badgeBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    isFixedDefault: false,
  },
  Education: {
    name: 'Education',
    icon: '📚',
    color: '#6366F1', // Indigo
    badgeBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    isFixedDefault: false,
  },
  EMI: {
    name: 'EMI',
    icon: '💳',
    color: '#64748B', // Slate
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    isFixedDefault: true,
  },
  'Personal/Other': {
    name: 'Personal/Other',
    icon: '🙏',
    color: '#14B8A6', // Teal
    badgeBg: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    isFixedDefault: false,
  },
};

export const CATEGORY_LIST: CategoryType[] = Object.keys(CATEGORIES) as CategoryType[];
