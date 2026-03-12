import React, { useState, useEffect } from 'react';
import { budgetAPI, categoryAPI } from '../services/api';
import './AddBudget.css';

const AddBudget = ({ user, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: user.id,
    categoryId: '',
    amount: '',
    period: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories(user.id);
      setCategories(response.data.filter(c => c.name !== 'Income')); // Exclude income category
      
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: response.data[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'categoryId' || name === 'userId' ? parseInt(value) : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Budget amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      await budgetAPI.createBudget(formData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-budget-container">
      <div className="add-budget-card">
        <div className="add-budget-header">
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <h2>Create Monthly Budget</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Budget Limit ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1000.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="period">Period (Month)</label>
            <input
              type="month"
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            />
          </div>

          <div className="budget-info-box">
            <p>💡 <strong>Tip:</strong> Set realistic budget limits based on your spending patterns. You'll receive alerts when you reach 80% and when you exceed your budget.</p>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating Budget...' : 'Create Budget'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBudget;
