import React from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <p>No transactions found. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Recent Transactions</h2>
      <div className="transaction-items">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className={`transaction-item ${transaction.type.toLowerCase()}`}
          >
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="transaction-description">
                  {transaction.description || 'No description'}
                </span>
                <span className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </span>
              </div>
              <div className="transaction-details">
                <span className="transaction-date">{formatDate(transaction.date)}</span>
                <span className="transaction-type">{transaction.type}</span>
              </div>
            </div>
            <button 
              className="btn-delete"
              onClick={() => onDelete(transaction.id)}
              title="Delete transaction"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
