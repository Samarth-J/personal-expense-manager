import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User API calls
export const userAPI = {
  // Register new user
  register: (userData) => {
    return api.post('/users/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/users/login', credentials);
  },

  // Get user by ID
  getUserById: (userId) => {
    return api.get(`/users/${userId}`);
  },

  // Update user
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  // Delete user
  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  }
};

// Transaction API calls
export const transactionAPI = {
  // Add new transaction
  addTransaction: (transactionData) => {
    return api.post('/transactions', transactionData);
  },

  // Get all transactions for a user
  getTransactions: (userId) => {
    return api.get('/transactions', { params: { userId } });
  },

  // Get transaction by ID
  getTransactionById: (transactionId, userId) => {
    return api.get(`/transactions/${transactionId}`, { params: { userId } });
  },

  // Get transactions by date range
  getTransactionsByDateRange: (userId, startDate, endDate) => {
    return api.get('/transactions/date-range', {
      params: { userId, startDate, endDate }
    });
  },

  // Get transactions by category
  getTransactionsByCategory: (userId, categoryId) => {
    return api.get(`/transactions/category/${categoryId}`, { params: { userId } });
  },

  // Get transactions by type
  getTransactionsByType: (userId, type) => {
    return api.get(`/transactions/type/${type}`, { params: { userId } });
  },

  // Update transaction
  updateTransaction: (transactionId, userId, transactionData) => {
    return api.put(`/transactions/${transactionId}`, transactionData, { params: { userId } });
  },

  // Delete transaction
  deleteTransaction: (transactionId, userId) => {
    return api.delete(`/transactions/${transactionId}`, { params: { userId } });
  }
};

// Category API calls
export const categoryAPI = {
  // Get all categories
  getAllCategories: (userId) => {
    return api.get('/categories', { params: { userId } });
  },

  // Get predefined categories
  getPredefinedCategories: () => {
    return api.get('/categories/predefined');
  },

  // Get custom categories
  getCustomCategories: (userId) => {
    return api.get('/categories/custom', { params: { userId } });
  },

  // Create custom category
  createCustomCategory: (userId, categoryName) => {
    return api.post('/categories', { name: categoryName }, { params: { userId } });
  },

  // Get category by ID
  getCategoryById: (categoryId) => {
    return api.get(`/categories/${categoryId}`);
  },

  // Delete custom category
  deleteCustomCategory: (categoryId, userId) => {
    return api.delete(`/categories/${categoryId}`, { params: { userId } });
  }
};

// Budget API calls
export const budgetAPI = {
  // Create budget
  createBudget: (budgetData) => {
    return api.post('/budgets', budgetData);
  },

  // Get all budgets for a user
  getBudgets: (userId) => {
    return api.get('/budgets', { params: { userId } });
  },

  // Get budgets by period
  getBudgetsByPeriod: (userId, period) => {
    return api.get('/budgets/period', { params: { userId, period } });
  },

  // Get current month budgets
  getCurrentMonthBudgets: (userId) => {
    return api.get('/budgets/current', { params: { userId } });
  },

  // Get budget by ID
  getBudgetById: (budgetId, userId) => {
    return api.get(`/budgets/${budgetId}`, { params: { userId } });
  },

  // Get budget utilization
  getBudgetUtilization: (budgetId, userId) => {
    return api.get(`/budgets/${budgetId}/utilization`, { params: { userId } });
  },

  // Update budget
  updateBudget: (budgetId, userId, budgetData) => {
    return api.put(`/budgets/${budgetId}`, budgetData, { params: { userId } });
  },

  // Delete budget
  deleteBudget: (budgetId, userId) => {
    return api.delete(`/budgets/${budgetId}`, { params: { userId } });
  }
};

export default api;
