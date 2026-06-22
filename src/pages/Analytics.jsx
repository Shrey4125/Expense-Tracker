// src/pages/Analytics.jsx
import { Layout } from '../components/layout/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useAnalytics } from '../hooks/useAnalytics';
import { IncomeVsExpenseChart } from '../components/analytics/IncomeVsExpenseChart';
import { MonthlyTrendChart } from '../components/analytics/MonthlyTrendChart';
import { CategoryPieChart } from '../components/analytics/CategoryPieChart';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatCurrency, formatMonthYear, getCurrentMonth } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';

export const Analytics = () => {
  const { incomeList, expenseList, totalIncome, totalExpenses, balance, loading } = useTransactions();
  const { monthlyData, categoryData, currentMonthExpenses, currentMonthIncome } = useAnalytics(incomeList, expenseList);

  if (loading) return <LoadingSpinner fullPage />;

  const currentMonth = getCurrentMonth();
  const cmIncome = currentMonthIncome.reduce((s, i) => s + i.amount, 0);
  const cmExpense = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const savingsRate = cmIncome > 0 ? (((cmIncome - cmExpense) / cmIncome) * 100).toFixed(1) : 0;

  const topCategory = categoryData.length > 0
    ? categoryData.reduce((a, b) => a.amount > b.amount ? a : b)
    : null;

  return (
    <Layout
      title="Analytics & Reports"
      subtitle={`Financial insights for ${formatMonthYear(currentMonth)}`}
    >
      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          {
            label: 'This Month Income',
            value: formatCurrency(cmIncome),
            icon: <TrendingUp size={20} />, type: 'income',
          },
          {
            label: 'This Month Expenses',
            value: formatCurrency(cmExpense),
            icon: <TrendingDown size={20} />, type: 'expense',
          },
          {
            label: 'Net Balance (All Time)',
            value: formatCurrency(balance),
            icon: <Wallet size={20} />, type: 'balance',
          },
          {
            label: 'Savings Rate',
            value: `${savingsRate}%`,
            icon: <Percent size={20} />, type: 'budget',
          },
        ].map(({ label, value, icon, type }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${type}`}>{icon}</div>
            <div className="stat-info">
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="charts-grid" style={{ marginBottom: 20 }}>
        <IncomeVsExpenseChart monthlyData={monthlyData} />
        <MonthlyTrendChart monthlyData={monthlyData} />
      </div>

      {/* Charts row 2 */}
      <div className="charts-grid">
        <CategoryPieChart categoryData={categoryData} />

        {/* Insights card */}
        <div className="chart-card">
          <div className="chart-title">💡 Monthly Financial Insights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                label: 'Total Income (All Time)',
                value: formatCurrency(totalIncome),
                color: 'var(--success)',
                bg: 'rgba(16,185,129,0.08)',
              },
              {
                label: 'Total Expenses (All Time)',
                value: formatCurrency(totalExpenses),
                color: 'var(--danger)',
                bg: 'rgba(239,68,68,0.08)',
              },
              {
                label: 'Net Savings (All Time)',
                value: formatCurrency(balance),
                color: balance >= 0 ? 'var(--primary)' : 'var(--danger)',
                bg: 'rgba(99,102,241,0.08)',
              },
              topCategory && {
                label: `Top Expense Category`,
                value: `${topCategory.category}: ${formatCurrency(topCategory.amount)}`,
                color: 'var(--warning)',
                bg: 'rgba(245,158,11,0.08)',
              },
              {
                label: 'Monthly Savings Rate',
                value: `${savingsRate}% of income saved`,
                color: parseFloat(savingsRate) >= 20 ? 'var(--success)' : 'var(--warning)',
                bg: parseFloat(savingsRate) >= 20 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
              },
            ].filter(Boolean).map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
