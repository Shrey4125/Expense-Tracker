// src/hooks/useAnalytics.js
import { useMemo } from 'react';
import { format } from 'date-fns';
import { getMonthLabel } from '../utils/formatters';

export const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills',
  'Entertainment', 'Education', 'Health', 'Other',
];

export const CATEGORY_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6',
];

export const useAnalytics = (incomeList, expenseList) => {
  // Last 6 months data
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = format(d, 'yyyy-MM');
      months.push(key);
    }

    return months.map((ym) => {
      const income = incomeList
        .filter((i) => i.date && i.date.startsWith(ym))
        .reduce((s, i) => s + i.amount, 0);
      const expenses = expenseList
        .filter((e) => e.date && e.date.startsWith(ym))
        .reduce((s, e) => s + e.amount, 0);
      return { month: ym, label: getMonthLabel(ym), income, expenses };
    });
  }, [incomeList, expenseList]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    expenseList.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return EXPENSE_CATEGORIES.map((cat, i) => ({
      category: cat,
      amount: map[cat] || 0,
      color: CATEGORY_COLORS[i],
    })).filter((c) => c.amount > 0);
  }, [expenseList]);

  // Current month filter
  const currentMonthKey = format(new Date(), 'yyyy-MM');
  const currentMonthExpenses = useMemo(
    () => expenseList.filter((e) => e.date && e.date.startsWith(currentMonthKey)),
    [expenseList, currentMonthKey]
  );
  const currentMonthIncome = useMemo(
    () => incomeList.filter((i) => i.date && i.date.startsWith(currentMonthKey)),
    [incomeList, currentMonthKey]
  );

  return { monthlyData, categoryData, currentMonthExpenses, currentMonthIncome };
};
