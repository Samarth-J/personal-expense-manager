import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  const handleAddTransaction = () => {
    setCurrentPage('addTransaction');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleTransactionSuccess = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
      <main className="main-content">
        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        )}

        {currentPage === 'register' && (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'dashboard' && user && (
          <Dashboard 
            user={user}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {currentPage === 'addTransaction' && user && (
          <AddTransaction 
            user={user}
            onBack={handleBackToDashboard}
            onSuccess={handleTransactionSuccess}
          />
        )}
      </main>
    </div>
  );
}

export default App;
