// src/components/analytics/IncomeVsExpenseChart.jsx
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const IncomeVsExpenseChart = ({ monthlyData }) => {
  const data = {
    labels: monthlyData.map((d) => d.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        backgroundColor: 'rgba(16,185,129,0.8)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: monthlyData.map((d) => d.expenses),
        backgroundColor: 'rgba(239,68,68,0.8)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text)',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'var(--border)' },
        ticks: {
          color: 'var(--text-muted)',
          font: { family: 'Inter', size: 11 },
          callback: (v) => '₹' + v.toLocaleString('en-IN'),
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-title">📊 Income vs Expenses (Last 6 Months)</div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
