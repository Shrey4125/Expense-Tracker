// src/utils/formatters.js
import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount || 0);

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatMonthYear = (dateStr) => {
  try {
    return format(parseISO(dateStr + '-01'), 'MMMM yyyy');
  } catch {
    return dateStr;
  }
};

export const getCurrentMonth = () => format(new Date(), 'yyyy-MM');

export const getMonthLabel = (ym) => {
  try {
    return format(parseISO(ym + '-01'), 'MMM yyyy');
  } catch {
    return ym;
  }
};
