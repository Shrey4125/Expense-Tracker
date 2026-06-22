// src/components/dashboard/RecentTransactions.jsx
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const RecentTransactions = ({ incomeList, expenseList }) => {
  const combined = [
    ...incomeList.map((i) => ({ ...i, type: 'income' })),
    ...expenseList.map((e) => ({ ...e, type: 'expense' })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  if (combined.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💸</div>
        <div className="empty-state-text">No transactions yet</div>
        <div className="empty-state-sub">Add your first income or expense to get started</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Source / Category</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {combined.map((t) => (
            <tr key={t.id}>
              <td>
                <span className={`badge badge-${t.type}`}>
                  {t.type === 'income'
                    ? <TrendingUp size={11} style={{ marginRight: 4 }} />
                    : <TrendingDown size={11} style={{ marginRight: 4 }} />}
                  {t.type}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(t.date)}</td>
              <td>
                <span className={`badge ${t.type === 'income' ? 'badge-income' : `badge-${t.category}`}`}>
                  {t.type === 'income' ? t.source : t.category}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.description || '—'}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                <span className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
