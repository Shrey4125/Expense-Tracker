// src/pages/Dashboard.jsx
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../contexts/useAuth';
import { formatCurrency, formatMonthYear, getCurrentMonth } from '../utils/formatters';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const {
    incomeList, expenseList,
    totalIncome, totalExpenses, balance, loading,
  } = useTransactions();
  const { budget } = useBudget();

  const currentMonth = getCurrentMonth();
  const currentMonthExpenses = expenseList
    .filter((e) => e.date?.startsWith(currentMonth))
    .reduce((s, e) => s + e.amount, 0);
  const budgetAmount = budget?.monthlyBudget || 0;
  const budgetRemaining = budgetAmount - currentMonthExpenses;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Layout
      title={`${greeting()}, ${currentUser?.displayName?.split(' ')[0] || 'there'} 👋`}
      subtitle={`Here's your financial snapshot for ${formatMonthYear(currentMonth)}`}
    >
      {/* Stats */}
      <div className="stats-grid">
        <StatsCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          sub={`${incomeList.length} transaction(s)`}
          icon={<TrendingUp size={22} />}
          type="income"
        />
        <StatsCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          sub={`${expenseList.length} transaction(s)`}
          icon={<TrendingDown size={22} />}
          type="expense"
        />
        <StatsCard
          label="Current Balance"
          value={formatCurrency(balance)}
          sub={balance >= 0 ? '✅ You are in the green' : '⚠️ Overspending detected'}
          icon={<Wallet size={22} />}
          type="balance"
        />
        <StatsCard
          label="Budget Remaining"
          value={budgetAmount ? formatCurrency(budgetRemaining) : 'Not set'}
          sub={budgetAmount
            ? `${Math.min(100, Math.round((currentMonthExpenses / budgetAmount) * 100))}% used this month`
            : 'Set a budget in Budget page'}
          icon={<Target size={22} />}
          type="budget"
        />
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="section-title">Recent Transactions</div>
          <div className="section-subtitle">Your latest 10 transactions</div>
        </div>
        <div style={{ padding: '0 0 8px' }}>
          <RecentTransactions incomeList={incomeList} expenseList={expenseList} />
        </div>
      </div>
    </Layout>
  );
};
