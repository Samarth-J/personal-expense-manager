import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ChartComponent.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ transactions, categories }) => {
  // Calculate spending by category
  const calculateCategoryData = () => {
    const categoryMap = {};
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(transaction => {
        const categoryId = transaction.categoryId;
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = 0;
        }
        categoryMap[categoryId] += parseFloat(transaction.amount);
      });

    return categoryMap;
  };

  // Prepare data for Pie Chart
  const preparePieData = () => {
    const categoryData = calculateCategoryData();
    const labels = [];
    const data = [];
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    Object.entries(categoryData).forEach(([categoryId, amount]) => {
      const category = categories.find(c => c.id === parseInt(categoryId));
      labels.push(category ? category.name : 'Unknown');
      data.push(amount);
    });

    return {
      labels,
      datasets: [{
        label: 'Spending by Category',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Prepare data for Bar Chart (Income vs Expense)
  const prepareBarData = () => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      labels: ['Income', 'Expense', 'Balance'],
      datasets: [{
        label: 'Amount ($)',
        data: [income, expense, income - expense],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false
      }
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available for charts. Add some transactions first!</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-item">
        <h3>Spending by Category</h3>
        <div className="chart-wrapper">
          <Pie data={preparePieData()} options={chartOptions} />
        </div>
      </div>
      
      <div className="chart-item">
        <h3>Income vs Expense</h3>
        <div className="chart-wrapper">
          <Bar data={prepareBarData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
