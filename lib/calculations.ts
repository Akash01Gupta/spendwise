import { Expense, Income, Budget, SavingGoal, SafeToSpendInfo, MonthSummary, CategoryType } from '@/types';
import { CATEGORIES } from './categories';

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function calculateSafeToSpend(
  monthStr: string, // YYYY-MM e.g. "2026-09"
  incomes: Income[],
  expenses: Expense[],
  savingsTargetAmount: number = 10000
): SafeToSpendInfo {
  const [yearStr, mStr] = monthStr.split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const monthIdx = (parseInt(mStr, 10) || 9) - 1;

  const totalDays = getDaysInMonth(year, monthIdx);

  // Calculate current day or default to mid-month for demo/testing
  const now = new Date();
  let currentDay = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIdx;
  
  if (!isCurrentMonth) {
    // If viewing past/future month, assume 18 days remaining for display purposes
    currentDay = 12;
  }
  
  const daysRemaining = Math.max(1, totalDays - currentDay + 1);

  // Income for month
  const monthIncomes = incomes.filter((i) => i.month === monthStr);
  const monthlySalary = monthIncomes.reduce((acc, curr) => acc + curr.amount, 0) || 35000;

  // Month expenses
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthStr));

  // Separate fixed vs variable expenses
  let fixedExpensesTotal = 0;
  let spentVariableSoFar = 0;

  monthExpenses.forEach((exp) => {
    const catConfig = CATEGORIES[exp.category];
    if (exp.isRecurring || (catConfig && catConfig.isFixedDefault)) {
      fixedExpensesTotal += exp.amount;
    } else {
      spentVariableSoFar += exp.amount;
    }
  });

  // Available budget = Salary - Fixed - Savings Target
  const availableBudget = Math.max(0, monthlySalary - fixedExpensesTotal - savingsTargetAmount);
  const dailyBudgetInitial = Math.round(availableBudget / totalDays);

  const remainingVariableBudget = availableBudget - spentVariableSoFar;
  const safeDailySpend = Math.max(0, Math.round(remainingVariableBudget / daysRemaining));

  const percentageUsed = availableBudget > 0 
    ? Math.min(100, Math.round((spentVariableSoFar / availableBudget) * 100))
    : 100;

  let status: 'SAFE' | 'CAUTION' | 'ALERT' = 'SAFE';
  if (remainingVariableBudget < 0 || percentageUsed >= 95) {
    status = 'ALERT';
  } else if (percentageUsed >= 75) {
    status = 'CAUTION';
  }

  return {
    monthlySalary,
    fixedExpensesTotal,
    savingsTarget: savingsTargetAmount,
    availableBudget,
    daysInMonth: totalDays,
    daysRemaining,
    dailyBudgetInitial,
    spentVariableSoFar,
    remainingVariableBudget,
    safeDailySpend,
    status,
    percentageUsed,
  };
}

export function calculateMonthSummary(
  monthStr: string,
  incomes: Income[],
  expenses: Expense[],
  savingsTarget: number = 10000
): MonthSummary {
  const monthIncomes = incomes.filter((i) => i.month === monthStr);
  const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const baseSalary = monthIncomes.filter((i) => i.type === 'Salary').reduce((sum, i) => sum + i.amount, 0) || totalIncome;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthStr));
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  let fixedExpenses = 0;
  let variableExpenses = 0;

  monthExpenses.forEach((exp) => {
    const catConfig = CATEGORIES[exp.category];
    if (exp.isRecurring || (catConfig && catConfig.isFixedDefault)) {
      fixedExpenses += exp.amount;
    } else {
      variableExpenses += exp.amount;
    }
  });

  const available = totalIncome - totalExpenses;
  const remainingBalance = available - savingsTarget;

  return {
    month: monthStr,
    totalIncome,
    baseSalary,
    totalExpenses,
    fixedExpenses,
    variableExpenses,
    savingsTarget,
    actualSavings: savingsTarget,
    remainingBalance,
  };
}

export function calculateFinancialHealthScore(
  summary: MonthSummary,
  safeInfo: SafeToSpendInfo,
  budgets: Budget[],
  expenses: Expense[]
): number {
  let score = 70; // Baseline

  // 1. Savings ratio (up to +20 points)
  if (summary.totalIncome > 0) {
    const savingsRatio = (summary.savingsTarget / summary.totalIncome) * 100;
    if (savingsRatio >= 25) score += 20;
    else if (savingsRatio >= 15) score += 15;
    else if (savingsRatio >= 10) score += 10;
  }

  // 2. Safe to spend status (+10 for SAFE, -15 for ALERT)
  if (safeInfo.status === 'SAFE') score += 10;
  else if (safeInfo.status === 'CAUTION') score -= 5;
  else if (safeInfo.status === 'ALERT') score -= 15;

  // 3. Over-budget penalty (-10 per broken budget)
  budgets.forEach((b) => {
    const catSpent = expenses
      .filter((e) => e.category === b.category && e.date.startsWith(summary.month))
      .reduce((s, e) => s + e.amount, 0);
    if (catSpent > b.limitAmount) {
      score -= 10;
    }
  });

  return Math.min(100, Math.max(0, score));
}
