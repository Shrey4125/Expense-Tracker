// src/services/incomeService.js
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'income';

export const addIncome = async (uid, data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    uid,
    amount: parseFloat(data.amount),
    createdAt: serverTimestamp(),
  });
};

export const updateIncome = async (id, data) => {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, {
    ...data,
    amount: parseFloat(data.amount),
  });
};

export const deleteIncome = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};

export const getIncomeByUser = async (uid) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('uid', '==', uid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback: some projects may not have the composite index deployed yet.
    // Fetch without ordering and sort client-side so the UI still works.
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
