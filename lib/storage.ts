import { Expense, Income, Budget, SavingGoal, SavingTransaction, CurrencyCode } from '@/types';

const STORAGE_KEYS = {
  INCOMES: 'spendwise_incomes_v1',
  EXPENSES: 'spendwise_expenses_v1',
  BUDGETS: 'spendwise_budgets_v1',
  GOALS: 'spendwise_goals_v1',
  GOAL_TX: 'spendwise_goal_tx_v1',
  CURRENCY: 'spendwise_currency_v1',
  SAVINGS_TARGET: 'spendwise_savings_target_v1',
};

export const INITIAL_INCOMES: Income[] = [
  {
    id: 'inc-1',
    amount: 35000,
    type: 'Salary',
    date: '2026-09-01',
    description: 'Monthly Software Engineer Salary',
    month: '2026-09',
  },
  {
    id: 'inc-2',
    amount: 5000,
    type: 'Bonus',
    date: '2026-09-15',
    description: 'Quarterly Performance Bonus',
    month: '2026-09',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 8000,
    category: 'Rent',
    description: 'Apartment Monthly Rent',
    date: '2026-09-02',
    paymentMethod: 'Net Banking',
    isRecurring: true,
  },
  {
    id: 'exp-2',
    amount: 4500,
    category: 'Food',
    description: 'Groceries & Swiggy/Zomato Dining',
    date: '2026-09-05',
    paymentMethod: 'UPI',
    isRecurring: false,
  },
  {
    id: 'exp-3',
    amount: 2800,
    category: 'Transport',
    description: 'Fuel & Metro Recharge',
    date: '2026-09-08',
    paymentMethod: 'UPI',
    isRecurring: false,
  },
  {
    id: 'exp-4',
    amount: 2000,
    category: 'Mobile/Internet',
    description: 'Airtel Broadband & Postpaid Bills',
    date: '2026-09-10',
    paymentMethod: 'Credit Card',
    isRecurring: true,
  },
  {
    id: 'exp-5',
    amount: 1200,
    category: 'Electricity',
    description: 'Monthly BESCOM Power Bill',
    date: '2026-09-11',
    paymentMethod: 'UPI',
    isRecurring: true,
  },
  {
    id: 'exp-6',
    amount: 3000,
    category: 'Shopping',
    description: 'Clothes & Home Decor',
    date: '2026-09-14',
    paymentMethod: 'Credit Card',
    isRecurring: false,
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    category: 'Food',
    limitAmount: 5000,
    month: '2026-09',
  },
  {
    id: 'b-2',
    category: 'Transport',
    limitAmount: 2500,
    month: '2026-09',
  },
  {
    id: 'b-3',
    category: 'Shopping',
    limitAmount: 4000,
    month: '2026-09',
  },
  {
    id: 'b-4',
    category: 'Entertainment',
    limitAmount: 2000,
    month: '2026-09',
  },
];

export const INITIAL_GOALS: SavingGoal[] = [
  {
    id: 'goal-1',
    name: 'MacBook Pro Fund',
    targetAmount: 80000,
    currentAmount: 30000,
    targetDate: '2027-01-31',
    icon: '💻',
    status: 'IN_PROGRESS',
  },
  {
    id: 'goal-2',
    name: 'Emergency Savings',
    targetAmount: 50000,
    currentAmount: 30000,
    targetDate: '2026-12-31',
    icon: '🛡️',
    status: 'IN_PROGRESS',
  },
  {
    id: 'goal-3',
    name: 'New Bike Fund',
    targetAmount: 120000,
    currentAmount: 45000,
    targetDate: '2027-06-30',
    icon: '🏍️',
    status: 'IN_PROGRESS',
  },
  {
    id: 'goal-4',
    name: 'Goa Vacation',
    targetAmount: 30000,
    currentAmount: 18000,
    targetDate: '2026-11-30',
    icon: '🏖️',
    status: 'IN_PROGRESS',
  },
];

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Data Loaders
export function loadIncomes(): Income[] {
  return getItem<Income[]>(STORAGE_KEYS.INCOMES, INITIAL_INCOMES);
}

export function saveIncomes(data: Income[]) {
  setItem(STORAGE_KEYS.INCOMES, data);
}

export function loadExpenses(): Expense[] {
  return getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
}

export function saveExpenses(data: Expense[]) {
  setItem(STORAGE_KEYS.EXPENSES, data);
}

export function loadBudgets(): Budget[] {
  return getItem<Budget[]>(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS);
}

export function saveBudgets(data: Budget[]) {
  setItem(STORAGE_KEYS.BUDGETS, data);
}

export function loadGoals(): SavingGoal[] {
  return getItem<SavingGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
}

export function saveGoals(data: SavingGoal[]) {
  setItem(STORAGE_KEYS.GOALS, data);
}

export function loadCurrency(): CurrencyCode {
  return getItem<CurrencyCode>(STORAGE_KEYS.CURRENCY, 'INR');
}

export function saveCurrency(code: CurrencyCode) {
  setItem(STORAGE_KEYS.CURRENCY, code);
}

export function loadSavingsTarget(): number {
  return getItem<number>(STORAGE_KEYS.SAVINGS_TARGET, 10000);
}

export function saveSavingsTarget(target: number) {
  setItem(STORAGE_KEYS.SAVINGS_TARGET, target);
}

export function seedSampleData(): void {
  saveIncomes(INITIAL_INCOMES);
  saveExpenses(INITIAL_EXPENSES);
  saveBudgets(INITIAL_BUDGETS);
  saveGoals(INITIAL_GOALS);
  saveSavingsTarget(10000);
  saveCurrency('INR');
}
