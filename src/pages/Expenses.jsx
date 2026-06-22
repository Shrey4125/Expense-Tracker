// src/pages/Expenses.jsx
import { Layout } from '../components/layout/Layout';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { TrendingDown } from 'lucide-react';

export const Expenses = () => {
  const {
    expenseList, totalExpenses, loading,
    handleAddExpense, handleUpdateExpense, handleDeleteExpense,
  } = useTransactions();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Layout title="Expenses" subtitle="Track and manage your spending">
      {/* Summary bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.04))',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius)', padding: '18px 24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(239,68,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--danger)',
          }}
        >
          <TrendingDown size={20} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Total Expenses</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--danger)' }}>
            {formatCurrency(totalExpenses)}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
          {expenseList.length} record(s)
        </div>
      </div>

      <ExpenseList
        expenseList={expenseList}
        onAdd={handleAddExpense}
        onUpdate={handleUpdateExpense}
        onDelete={handleDeleteExpense}
      />
    </Layout>
  );
};
