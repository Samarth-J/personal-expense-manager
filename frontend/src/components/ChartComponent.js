import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16'];

const ChartComponent = ({ transactions, categories }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-500">Add transactions to see charts</p>
      </div>
    );
  }

  // Pie chart: spending by category
  const categoryMap = {};
  transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    const name = cat ? cat.name : 'Other';
    categoryMap[name] = (categoryMap[name] || 0) + parseFloat(t.amount);
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: COLORS.slice(0, Object.keys(categoryMap).length),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Bar chart: monthly income vs expense
  const monthlyMap = {};
  transactions.forEach(t => {
    const month = t.date ? t.date.substring(0, 7) : 'Unknown';
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };
    if (t.type === 'INCOME') monthlyMap[month].income += parseFloat(t.amount);
    else monthlyMap[month].expense += parseFloat(t.amount);
  });

  const sortedMonths = Object.keys(monthlyMap).sort();
  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(m => monthlyMap[m].income),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 6
      },
      {
        label: 'Expense',
        data: sortedMonths.map(m => monthlyMap[m].expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Spending by Category</h3>
        <div style={{ height: '280px' }}>
          {Object.keys(categoryMap).length > 0
            ? <Pie data={pieData} options={chartOptions} />
            : <p className="text-center text-gray-400 pt-20">No expense data</p>
          }
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Income vs Expense</h3>
        <div style={{ height: '280px' }}>
          <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
