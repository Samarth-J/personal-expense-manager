import React, { useState, useEffect } from 'react';
import { transactionAPI, categoryAPI } from '../services/api';

const AddTransaction = ({ user, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: user.id,
    categoryId: '',
    amount: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAllCategories(user.id);
      setCategories(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'categoryId' ? parseInt(value) : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.categoryId) { setError('Please select a category'); return; }
    if (parseFloat(formData.amount) <= 0) { setError('Amount must be greater than 0'); return; }
    setLoading(true);
    try {
      // Get userId from prop or localStorage fallback
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const resolvedUserId = user?.id || storedUser?.id;
      if (!resolvedUserId) {
        setError('User session invalid. Please log out and log back in.');
        setLoading(false);
        return;
      }
      const payload = {
        ...formData,
        userId: parseInt(resolvedUserId),
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId)
      };
      console.log('Sending transaction payload:', payload);
      await transactionAPI.addTransaction(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Transaction error:', err.response);
      if (err.response?.status === 401) {
        setError('Session expired. Please log out and log back in.');
      } else if (err.response?.status === 403) {
        setError('Access denied (403). Please log out and log back in.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || `Error ${err.response?.status}: Failed to add transaction`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-lg">← Back</button>
          <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button type="button"
                onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${formData.type === 'EXPENSE' ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                💸 Expense
              </button>
              <button type="button"
                onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${formData.type === 'INCOME' ? 'bg-green-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                💰 Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange}
              placeholder="0.00" step="0.01" min="0.01" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white">
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange}
              max={new Date().toISOString().split('T')[0]} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="e.g. Lunch at restaurant" rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}>
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
