import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>💰 Expense Tracker</h1>
        </div>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">Welcome, {user.name}</span>
              <button className="btn-logout" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <span className="navbar-user">Please login</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
