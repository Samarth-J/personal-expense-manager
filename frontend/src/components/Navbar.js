import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold text-indigo-600">ExpenseTracker</span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 font-medium">{user.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
