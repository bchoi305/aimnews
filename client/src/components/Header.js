import React from 'react';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div>
          <h1 className="app-title">AI Medicine News Reporter</h1>
          <p className="app-subtitle">Stay updated with the latest AI developments in medicine, radiology, and cardiovascular imaging</p>
        </div>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            📰 News Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => onTabChange('reports')}
          >
            📊 Generate Reports
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;