// src/services/expenseService.js
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'expenses';

export const addExpense = async (uid, data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    uid,
    amount: parseFloat(data.amount),
    createdAt: serverTimestamp(),
  });
};

export const updateExpense = async (id, data) => {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, {
    ...data,
    amount: parseFloat(data.amount),
  });
};

export const deleteExpense = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};

export const getExpensesByUser = async (uid) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('uid', '==', uid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Indexed query failed, falling back to client-side sort', err.message);
    const q2 = query(collection(db, COLLECTION), where('uid', '==', uid));
    const snapshot = await getDocs(q2);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    docs.sort((a, b) => {
      const toTs = (v) => {
        if (!v) return 0;
        if (typeof v === 'string') return new Date(v).getTime();
        if (v.toDate) return v.toDate().getTime();
        if (v.seconds) return v.seconds * 1000;
        return 0;
      };
      return toTs(b.date ?? b.createdAt) - toTs(a.date ?? a.createdAt);
    });
    return docs;
  }
};
