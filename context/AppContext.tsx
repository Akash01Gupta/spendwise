'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Expense,
  Income,
  Budget,
  SavingGoal,
  CurrencyCode,
  SafeToSpendInfo,
  MonthSummary,
} from '@/types';
import {
  loadIncomes,
  saveIncomes,
  loadExpenses,
  saveExpenses,
  loadBudgets,
  saveBudgets,
  loadGoals,
  saveGoals,
  loadCurrency,
  saveCurrency,
  loadSavingsTarget,
  saveSavingsTarget,
  seedSampleData,
} from '@/lib/storage';
import {
  calculateSafeToSpend,
  calculateMonthSummary,
  calculateFinancialHealthScore,
} from '@/lib/calculations';

interface AppContextType {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  incomes: Income[];
  expenses: Expense[];
  budgets: Budget[];
  goals: SavingGoal[];
  savingsTarget: number;
  setSavingsTarget: (target: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  deleteIncome: (id: string) => void;
  setCategoryBudget: (category: Budget['category'], amount: number) => void;
  addSavingGoal: (goal: Omit<SavingGoal, 'id' | 'currentAmount' | 'status'>) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  deleteGoal: (goalId: string) => void;
  resetDemoData: () => void;
  safeInfo: SafeToSpendInfo;
  monthSummary: MonthSummary;
  healthScore: number;
  applyOnboardingSetup: (data: import('@/types').OnboardingData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentMonth, setCurrentMonth] = useState<string>('2026-09');
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [savingsTarget, setSavingsTargetState] = useState<number>(10000);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIncomes(loadIncomes());
    setExpenses(loadExpenses());
    setBudgets(loadBudgets());
    setGoals(loadGoals());
    setCurrencyState(loadCurrency());
    setSavingsTargetState(loadSavingsTarget());
    setIsLoaded(true);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    saveCurrency(code);
  };

  const setSavingsTarget = (target: number) => {
    setSavingsTargetState(target);
    saveSavingsTarget(target);
  };

  const addExpense = (newExp: Omit<Expense, 'id'>) => {
    const created: Expense = {
      ...newExp,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    const updated = expenses.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    setExpenses(updated);
    saveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  const addIncome = (newInc: Omit<Income, 'id'>) => {
    const created: Income = {
      ...newInc,
      id: 'inc-' + Date.now(),
    };
    const updated = [created, ...incomes];
    setIncomes(updated);
    saveIncomes(updated);
  };

  const deleteIncome = (id: string) => {
    const updated = incomes.filter((i) => i.id !== id);
    setIncomes(updated);
    saveIncomes(updated);
  };

  const setCategoryBudget = (category: Budget['category'], amount: number) => {
    const existing = budgets.find((b) => b.category === category && b.month === currentMonth);
    let updated: Budget[];
    if (existing) {
      updated = budgets.map((b) =>
        b.id === existing.id ? { ...b, limitAmount: amount } : b
      );
    } else {
      const created: Budget = {
        id: 'b-' + Date.now(),
        category,
        limitAmount: amount,
        month: currentMonth,
      };
      updated = [...budgets, created];
    }
    setBudgets(updated);
    saveBudgets(updated);
  };

  const addSavingGoal = (newGoal: Omit<SavingGoal, 'id' | 'currentAmount' | 'status'>) => {
    const created: SavingGoal = {
      ...newGoal,
      id: 'goal-' + Date.now(),
      currentAmount: 0,
      status: 'IN_PROGRESS',
    };
    const updated = [...goals, created];
    setGoals(updated);
    saveGoals(updated);
  };

  const depositToGoal = (goalId: string, amount: number) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextAmount = g.currentAmount + amount;
        return {
          ...g,
          currentAmount: nextAmount,
          status: (nextAmount >= g.targetAmount ? 'COMPLETED' : 'IN_PROGRESS') as 'COMPLETED' | 'IN_PROGRESS',
        };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
  };

  const deleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveGoals(updated);
  };

  const resetDemoData = () => {
    seedSampleData();
    setIncomes(loadIncomes());
    setExpenses(loadExpenses());
    setBudgets(loadBudgets());
    setGoals(loadGoals());
    setCurrencyState('INR');
    setSavingsTargetState(10000);
  };

  const applyOnboardingSetup = (data: import('@/types').OnboardingData) => {
    // Apply currency and savings target
    setCurrencyState(data.currency);
    saveCurrency(data.currency);
    setSavingsTargetState(data.savingsTarget);
    saveSavingsTarget(data.savingsTarget);

    // Create base salary income for current month
    const salaryIncome: Income = {
      id: 'inc-onboard-' + Date.now(),
      amount: data.baseSalary,
      type: 'Salary',
      date: new Date().toISOString().slice(0, 10),
      description: `${data.name} - Base Salary`,
      month: currentMonth,
    };
    const newIncomes = [salaryIncome, ...incomes];
    setIncomes(newIncomes);
    saveIncomes(newIncomes);

    // Create fixed expenses
    const fixedExpensesCreated: Expense[] = data.fixedExpenses.map((f) => ({
      id: 'exp-onboard-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      amount: f.amount,
      category: f.category,
      description: f.description,
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Net Banking',
      isRecurring: true,
      createdAt: new Date().toISOString(),
    }));
    const newExpenses = [...fixedExpensesCreated, ...expenses];
    setExpenses(newExpenses);
    saveExpenses(newExpenses);

    // Create budgets for the current month based on fixed commitments
    const newBudgetsFromFixed: Budget[] = data.fixedExpenses.map((f) => ({
      id: 'b-onboard-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      category: f.category,
      limitAmount: f.amount,
      month: currentMonth,
    }));
    const updatedBudgets = [...newBudgetsFromFixed, ...budgets];
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);

    // Create primary saving goal
    const primaryGoal: SavingGoal = {
      id: 'goal-onboard-' + Date.now(),
      name: data.goalName,
      targetAmount: data.goalTargetAmount,
      currentAmount: 0,
      targetDate: data.goalTargetDate,
      icon: '🎯',
      status: 'IN_PROGRESS',
    };
    const updatedGoals = [primaryGoal, ...goals];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const safeInfo = calculateSafeToSpend(currentMonth, incomes, expenses, savingsTarget);
  const monthSummary = calculateMonthSummary(currentMonth, incomes, expenses, savingsTarget);
  const healthScore = calculateFinancialHealthScore(monthSummary, safeInfo, budgets, expenses);

  return (
    <AppContext.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        currency,
        setCurrency,
        incomes,
        expenses,
        budgets,
        goals,
        savingsTarget,
        setSavingsTarget,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        setCategoryBudget,
        addSavingGoal,
        depositToGoal,
        deleteGoal,
        resetDemoData,
        applyOnboardingSetup,
        safeInfo,
        monthSummary,
        healthScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
