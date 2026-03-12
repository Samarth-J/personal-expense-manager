import React, { useState, useEffect } from 'react';
import { transactionAPI, categoryAPI } from '../services/api';
import TransactionList from '../components/TransactionList';
import ChartComponent from '../components/ChartComponent';
import BudgetTracker from '../components/BudgetTracker';
import './Dashboard.css';

const Dashboard = ({ user, onAddTransaction }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions and categories
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionAPI.getTransactions(user.id),
        categoryAPI.getAllCategories(user.id)
      ]);

      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      
      // Calculate stats
      calculateStats(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionData) => {
    const income = transactionData
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactionData
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    setStats({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.deleteTransaction(transactionId, user.id);
        // Refresh data
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-add" onClick={onAddTransaction}>
          + Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Income</p>
            <p className="stat-value">{formatCurrency(stats.totalIncome)}</p>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p className="stat-label">Total Expense</p>
            <p className="stat-value">{formatCurrency(stats.totalExpense)}</p>
          </div>
        </div>

        <div className="stat-card balance">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p className="stat-label">Balance</p>
            <p className="stat-value">{formatCurrency(stats.balance)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <ChartComponent transactions={transactions} categories={categories} />

      {/* Budget Tracker */}
      <BudgetTracker user={user} />

      {/* Transaction List */}
      <TransactionList 
        transactions={transactions} 
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Dashboard;
