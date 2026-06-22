// src/services/budgetService.js
import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const getBudget = async (uid, month) => {
  const ref = doc(db, 'budgets', `${uid}_${month}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const setBudget = async (uid, month, amount) => {
  const ref = doc(db, 'budgets', `${uid}_${month}`);
  return await setDoc(ref, {
    uid,
    month,
    monthlyBudget: parseFloat(amount),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
