// src/components/analytics/MonthlyTrendChart.jsx
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

export const MonthlyTrendChart = ({ monthlyData }) => {
  const data = {
    labels: monthlyData.map((d) => d.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map((d) => d.expenses),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#ef4444',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
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
      <div className="chart-title">📈 Monthly Trend</div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
