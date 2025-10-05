import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import NewsDashboard from './components/NewsDashboard';
import ReportGenerator from './components/ReportGenerator';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="App">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
      
      <main className="main-content">
        {loading && <LoadingSpinner />}
        
        {activeTab === 'dashboard' && (
          <NewsDashboard 
            onError={handleError}
            setLoading={setLoadingState}
          />
        )}
        
        {activeTab === 'reports' && (
          <ReportGenerator 
            onError={handleError}
            setLoading={setLoadingState}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>AI Medicine News Reporter - Stay updated with AI developments in medicine</p>
      </footer>
    </div>
  );
}

export default App;