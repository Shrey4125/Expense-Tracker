// src/pages/Export.jsx
import { Layout } from '../components/layout/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getCurrentMonth } from '../utils/formatters';
import { exportTransactionsPDF, buildCSVData } from '../utils/exportUtils';
import { CSVLink } from 'react-csv';

export const Export = () => {
  const { incomeList, expenseList, loading } = useTransactions();
  if (loading) return <LoadingSpinner fullPage />;

  const month = getCurrentMonth();

  const handlePDF = () => exportTransactionsPDF(incomeList, expenseList, month);

  const csvData = buildCSVData(incomeList, expenseList);

  return (
    <Layout title="Export" subtitle={`Export transactions for ${month}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card export-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="export-icon">📄</div>
            <div>
              <div className="section-title">PDF Report</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Download a formatted PDF report</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handlePDF}>Download PDF</button>
        </div>

        <div className="card export-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="export-icon">📥</div>
            <div>
              <div className="section-title">CSV Export</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Download a CSV of all transactions</div>
            </div>
          </div>
          <CSVLink data={csvData} filename={`transactions-${month}.csv`} className="btn btn-secondary">Download CSV</CSVLink>
        </div>
      </div>
    </Layout>
  );
};

export default Export;
