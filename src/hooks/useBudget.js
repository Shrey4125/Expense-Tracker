// src/hooks/useBudget.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { getBudget, setBudget } from '../services/budgetService';
import { getCurrentMonth } from '../utils/formatters';
import toast from 'react-hot-toast';

export const useBudget = () => {
  const { currentUser } = useAuth();
  const [budget, setBudgetState] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonth();

  const fetchBudget = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getBudget(currentUser.uid, currentMonth);
      setBudgetState(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentMonth]);

  useEffect(() => {
    // run fetch in an async function to avoid synchronous setState inside effect
    const run = async () => { await fetchBudget(); };
    run();
  }, [fetchBudget]);

  const saveBudget = async (amount) => {
    if (!currentUser) {
      toast.error('You must be logged in to save a budget');
      return;
    }
    try {
      await setBudget(currentUser.uid, currentMonth, amount);
      toast.success('Budget saved!');
      await fetchBudget();
    } catch (err) {
      console.error('Failed to save budget:', err);
      const msg = err?.message || 'Failed to save budget';
      toast.error(msg);
    }
  };

  return { budget, loading, saveBudget, currentMonth, refetch: fetchBudget };
};
