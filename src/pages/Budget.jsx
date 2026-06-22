// src/pages/Budget.jsx
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../hooks/useAnalytics';
import { Target, AlertTriangle, CheckCircle, TrendingDown, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const Budget = () => {
  const { expenseList, loading: txLoading } = useTransactions();
  const { budget, loading: budgetLoading, saveBudget, currentMonth } = useBudget();
  const [inputAmount, setInputAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const currentMonthExpenses = expenseList.filter((e) => e.date?.startsWith(currentMonth));
  const totalSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const monthlyBudget = budget?.monthlyBudget || 0;
  const remaining = monthlyBudget - totalSpent;
  const pct = monthlyBudget > 0 ? Math.min(100, (totalSpent / monthlyBudget) * 100) : 0;

  const barClass = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'safe';

  const handleSave = async () => {
    const val = parseFloat(inputAmount);
    if (isNaN(val) || val <= 0) {
      toast.error('Enter a valid budget amount');
      return;
    }
    setSaving(true);
    await saveBudget(val);
    setInputAmount('');
    setSaving(false);
  };

  // Category breakdown
  const categoryBreakdown = EXPENSE_CATEGORIES.map((cat, i) => {
    const total = currentMonthExpenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0);
    return { cat, total, color: CATEGORY_COLORS[i] };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  if (txLoading || budgetLoading) return <LoadingSpinner fullPage />;

  return (
    <Layout
      title="Budget Insights"
      subtitle={`Monthly budget management for ${formatMonthYear(currentMonth)}`}
    >
      {/* Alert banner */}
      {monthlyBudget > 0 && (
        <div className={`alert-banner ${pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'success'}`}>
          {pct >= 100
            ? <AlertTriangle size={18} />
            : pct >= 80
            ? <AlertTriangle size={18} />
            : <CheckCircle size={18} />}
          <span>
            {pct >= 100
              ? `⚠️ You have exceeded your budget by ${formatCurrency(Math.abs(remaining))}!`
              : pct >= 80
              ? `⚡ You've used ${pct.toFixed(0)}% of your budget. Slow down spending!`
              : `✅ You're on track! ${formatCurrency(remaining)} remaining this month.`}
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Set Budget card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="stat-icon budget"><Target size={20} /></div>
            <div>
              <div className="section-title">Set Monthly Budget</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatMonthYear(currentMonth)}</div>
            </div>
          </div>

          {monthlyBudget > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Current Budget</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>
                {formatCurrency(monthlyBudget)}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {monthlyBudget > 0 ? 'Update Budget Amount (₹)' : 'Set Budget Amount (₹)'}
            </label>
            <input
              className="form-input"
              type="number" min="0" step="100"
              placeholder={monthlyBudget > 0 ? `Current: ₹${monthlyBudget}` : 'e.g. 30000'}
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner-sm" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>

        {/* Progress card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="stat-icon expense"><TrendingDown size={20} /></div>
            <div>
              <div className="section-title">Spending Summary</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>This month's progress</div>
            </div>
          </div>

          {monthlyBudget > 0 ? (
            <>
              <div className="budget-bar-wrap">
                <div className="budget-bar-labels">
                  <span>Spent: {formatCurrency(totalSpent)}</span>
                  <span>Budget: {formatCurrency(monthlyBudget)}</span>
                </div>
                <div className="budget-bar-track">
                  <div
                    className={`budget-bar-fill ${barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  {pct.toFixed(1)}% used
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                {[
                  { label: 'Spent', val: formatCurrency(totalSpent), cls: 'text-danger' },
                  { label: 'Remaining', val: formatCurrency(Math.max(0, remaining)), cls: 'text-success' },
                  { label: 'Budget', val: formatCurrency(monthlyBudget), cls: 'text-primary' },
                  { label: 'Transactions', val: currentMonthExpenses.length, cls: '' },
                ].map(({ label, val, cls }) => (
                  <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div className={`${cls}`} style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{val}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-text">No budget set</div>
              <div className="empty-state-sub">Set a monthly budget to track your spending</div>
            </div>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>This Month's Spending by Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categoryBreakdown.map(({ cat, total, color }) => {
              const catPct = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text)' }}>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatCurrency(total)} ({catPct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="budget-bar-track">
                    <div style={{ height: '100%', width: `${catPct}%`, background: color, borderRadius: 100, transition: 'width .5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
};
