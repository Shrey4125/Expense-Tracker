// src/pages/Income.jsx
import { Layout } from '../components/layout/Layout';
import { IncomeList } from '../components/income/IncomeList';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

export const Income = () => {
  const {
    incomeList, totalIncome, loading,
    handleAddIncome, handleUpdateIncome, handleDeleteIncome,
  } = useTransactions();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Layout title="Income" subtitle="Track and manage your earnings">
      {/* Summary bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius)', padding: '18px 24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--success)',
          }}
        >
          <TrendingUp size={20} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Total Income</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--success)' }}>
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
          {incomeList.length} record(s)
        </div>
      </div>

      <IncomeList
        incomeList={incomeList}
        onAdd={handleAddIncome}
        onUpdate={handleUpdateIncome}
        onDelete={handleDeleteIncome}
      />
    </Layout>
  );
};
