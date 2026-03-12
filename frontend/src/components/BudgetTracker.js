import React, { useState, useEffect } from 'react';
import { budgetAPI, transactionAPI } from '../services/api';
import './BudgetTracker.css';

const BudgetTracker = ({ user }) => {
  const [budgets, setBudgets] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBudget, setShowAddBudget] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetAPI.getCurrentMonthBudgets(user.id);
      const budgetsData = response.data;
      setBudgets(budgetsData);

      // Calculate utilization for each budget
      const statusPromises = budgetsData.map(async (budget) => {
        try {
          const utilResponse = await budgetAPI.getBudgetUtilization(budget.id, user.id);
          return {
            ...budget,
            utilization: utilResponse.data.utilization,
            exceeded: utilResponse.data.exceeded
          };
        } catch (error) {
          return {
            ...budget,
            utilization: 0,
            exceeded: false
          };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setBudgetStatus(statuses);

      // Check for exceeded budgets and show alerts
      checkBudgetAlerts(statuses);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBudgetAlerts = (statuses) => {
    const exceededBudgets = statuses.filter(b => b.exceeded);
    const warningBudgets = statuses.filter(b => b.utilization >= 80 && !b.exceeded);

    if (exceededBudgets.length > 0) {
      const message = exceededBudgets.length === 1
        ? `⚠️ Budget Alert: You have exceeded your budget limit!`
        : `⚠️ Budget Alert: You have exceeded ${exceededBudgets.length} budget limits!`;
      
      // Show alert for exceeded budgets
      if (window.confirm(message + '\n\nWould you like to view your budgets?')) {
        // User can see the budget tracker component
      }
    } else if (warningBudgets.length > 0) {
      console.log(`⚠️ Warning: ${warningBudgets.length} budget(s) are at 80% or more`);
    }
  };

  const getStatusColor = (utilization, exceeded) => {
    if (exceeded) return 'danger';
    if (utilization >= 80) return 'warning';
    return 'success';
  };

  const getStatusIcon = (utilization, exceeded) => {
    if (exceeded) return '🚨';
    if (utilization >= 80) return '⚠️';
    return '✅';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="budget-tracker">
        <h2>Budget Tracker</h2>
        <p>Loading budgets...</p>
      </div>
    );
  }

  if (budgetStatus.length === 0) {
    return (
      <div className="budget-tracker">
        <h2>Budget Tracker</h2>
        <div className="budget-empty">
          <p>No budgets set for this month. Create a budget to track your spending!</p>
          <button className="btn-create-budget" onClick={() => setShowAddBudget(true)}>
            + Create Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-tracker">
      <div className="budget-header">
        <h2>Budget Tracker</h2>
        <button className="btn-create-budget" onClick={() => setShowAddBudget(true)}>
          + Add Budget
        </button>
      </div>

      <div className="budget-list">
        {budgetStatus.map((budget) => {
          const statusColor = getStatusColor(budget.utilization, budget.exceeded);
          const statusIcon = getStatusIcon(budget.utilization, budget.exceeded);
          const spent = (budget.amount * budget.utilization) / 100;

          return (
            <div key={budget.id} className={`budget-item ${statusColor}`}>
              <div className="budget-info">
                <div className="budget-title">
                  <span className="budget-icon">{statusIcon}</span>
                  <span className="budget-category">Category ID: {budget.categoryId}</span>
                </div>
                <div className="budget-amounts">
                  <span className="budget-spent">{formatCurrency(spent)} spent</span>
                  <span className="budget-limit">of {formatCurrency(budget.amount)}</span>
                </div>
              </div>

              <div className="budget-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${statusColor}`}
                    style={{ width: `${Math.min(budget.utilization, 100)}%` }}
                  ></div>
                </div>
                <span className="progress-text">{budget.utilization.toFixed(1)}%</span>
              </div>

              {budget.exceeded && (
                <div className="budget-alert">
                  🚨 Budget Exceeded! You've spent {formatCurrency(spent - budget.amount)} over your limit.
                </div>
              )}

              {!budget.exceeded && budget.utilization >= 80 && (
                <div className="budget-warning">
                  ⚠️ Warning: You're approaching your budget limit!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetTracker;
