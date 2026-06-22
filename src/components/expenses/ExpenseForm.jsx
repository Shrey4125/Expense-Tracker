// src/components/expenses/ExpenseForm.jsx
import { useState, useEffect } from 'react';
import { validateAmount, validateRequired } from '../../utils/validators';
import { ShoppingBag } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../hooks/useAnalytics';

const defaultForm = { amount: '', category: '', date: '', description: '' };

export const ExpenseForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setForm(initial ?? defaultForm), 0);
    return () => clearTimeout(t);
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!validateAmount(form.amount)) e.amount = 'Enter a valid positive amount';
    if (!validateRequired(form.category)) e.category = 'Category is required';
    if (!validateRequired(form.date)) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            className={`form-input${errors.amount ? ' error' : ''}`}
            type="number" min="0" step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className={`form-input${errors.category ? ' error' : ''}`}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            <option value="">Select category</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          className={`form-input${errors.date ? ' error' : ''}`}
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />
        {errors.date && <p className="form-error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Description (optional)</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="What did you spend on?"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner-sm" /> : <ShoppingBag size={15} />}
          {loading ? 'Saving...' : initial ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};
