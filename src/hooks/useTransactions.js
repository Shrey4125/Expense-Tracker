// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { getIncomeByUser, addIncome, updateIncome, deleteIncome } from '../services/incomeService';
import { getExpensesByUser, addExpense, updateExpense, deleteExpense } from '../services/expenseService';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const { currentUser } = useAuth();
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [income, expenses] = await Promise.all([
        getIncomeByUser(currentUser.uid),
        getExpensesByUser(currentUser.uid),
      ]);
      setIncomeList(income);
      setExpenseList(expenses);
    } catch (err) {
      toast.error('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // run fetch in an async function to avoid synchronous setState inside effect
    const run = async () => { await fetchAll(); };
    run();
  }, [fetchAll]);

  // Income
  const handleAddIncome = async (data) => {
    try {
      await addIncome(currentUser.uid, data);
      toast.success('Income added!');
      await fetchAll();
    } catch {
      toast.error('Failed to add income');
    }
  };

  const handleUpdateIncome = async (id, data) => {
    try {
      await updateIncome(id, data);
      toast.success('Income updated!');
      await fetchAll();
    } catch {
      toast.error('Failed to update income');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      toast.success('Income deleted');
      await fetchAll();
    } catch {
      toast.error('Failed to delete income');
    }
  };

  // Expense
  const handleAddExpense = async (data) => {
    try {
      await addExpense(currentUser.uid, data);
      toast.success('Expense added!');
      await fetchAll();
    } catch {
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, data) => {
    try {
      await updateExpense(id, data);
      toast.success('Expense updated!');
      await fetchAll();
    } catch {
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      toast.success('Expense deleted');
      await fetchAll();
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const totalIncome = incomeList.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenseList.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  return {
    incomeList,
    expenseList,
    loading,
    totalIncome,
    totalExpenses,
    balance,
    handleAddIncome,
    handleUpdateIncome,
    handleDeleteIncome,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    refetch: fetchAll,
  };
};
