export type CategoryType =
  | 'Rent'
  | 'Food'
  | 'Transport'
  | 'Electricity'
  | 'Mobile/Internet'
  | 'Shopping'
  | 'Entertainment'
  | 'Medical'
  | 'Education'
  | 'EMI'
  | 'Personal/Other';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryType;
  description: string;
  date: string; // ISO date YYYY-MM-DD
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  createdAt?: string;
}

export type IncomeType = 'Salary' | 'Bonus' | 'Freelance' | 'Incentive' | 'Investment' | 'Other';

export interface Income {
  id: string;
  amount: number;
  type: IncomeType;
  date: string;
  description: string;
  month: string; // YYYY-MM
}

export interface Budget {
  id: string;
  category: CategoryType;
  limitAmount: number;
  month: string; // YYYY-MM
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon?: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface SavingTransaction {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface MonthSummary {
  month: string; // e.g. "2026-09"
  totalIncome: number;
  baseSalary: number;
  totalExpenses: number;
  fixedExpenses: number;
  variableExpenses: number;
  savingsTarget: number;
  actualSavings: number;
  remainingBalance: number;
}

export interface SafeToSpendInfo {
  monthlySalary: number;
  fixedExpensesTotal: number;
  savingsTarget: number;
  availableBudget: number; // Salary - Fixed - SavingsTarget
  daysInMonth: number;
  daysRemaining: number;
  dailyBudgetInitial: number;
  spentVariableSoFar: number;
  remainingVariableBudget: number;
  safeDailySpend: number; // RemainingVariableBudget / DaysRemaining
  status: 'SAFE' | 'CAUTION' | 'ALERT';
  percentageUsed: number;
}

export interface CategoryInfo {
  name: CategoryType;
  icon: string;
  color: string;
  badgeBg: string;
  isFixedDefault?: boolean;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // Conversion multiplier relative to INR
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: CurrencyCode;
  paydayDate?: number; // e.g. 1st or 5th of month
  baseSalary?: number;
  isOnboarded: boolean;
  createdAt: string;
}

export interface FixedExpenseInput {
  category: CategoryType;
  description: string;
  amount: number;
}

export interface OnboardingData {
  name: string;
  currency: CurrencyCode;
  paydayDate: number;
  baseSalary: number;
  fixedExpenses: FixedExpenseInput[];
  savingsTarget: number;
  goalName: string;
  goalTargetAmount: number;
  goalTargetDate: string;
}

