// src/utils/validators.js
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateRequired = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

export const validatePassword = (password) => password && password.length >= 6;
