// src/components/analytics/CategoryPieChart.jsx
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryPieChart = ({ categoryData }) => {
  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">🥧 Spending by Category</div>
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">No expense data yet</div>
        </div>
      </div>
    );
  }

  const data = {
    labels: categoryData.map((c) => c.category),
    datasets: [
      {
        data: categoryData.map((c) => c.amount),
        backgroundColor: categoryData.map((c) => c.color),
        borderColor: 'var(--bg-card)',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text)',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyleWidth: 10,
          padding: 14,
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${formatCurrency(ds.data[i])}`,
              fillStyle: ds.backgroundColor[i],
              strokeStyle: ds.backgroundColor[i],
              pointStyle: 'circle',
              index: i,
              hidden: false,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-title">🥧 Spending by Category</div>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
