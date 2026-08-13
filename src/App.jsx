import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import RelayDocPage from './pages1/RelayDocPage';
import FaultAnalysisPage from './pages2/FaultAnalysisPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'docs' | 'analysis'

  return (
    <div>
      {currentPage === 'dashboard' && (
        <DashboardPage 
          onOpenDocs={() => setCurrentPage('docs')} 
          onOpenAnalysis={() => setCurrentPage('analysis')} 
        />
      )}

      {currentPage === 'docs' && (
        <RelayDocPage onBack={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'analysis' && (
        <FaultAnalysisPage onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}