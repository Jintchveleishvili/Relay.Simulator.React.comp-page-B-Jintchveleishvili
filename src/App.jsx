import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage.jsx';
import RelayDocPage from './pages1/RelayDocPage.jsx';
import FaultAnalysisPage from './pages2/FaultAnalysisPage.jsx';

export default function App() {
  // გვერდები: 'dashboard' | 'analysis' | 'docs'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedFaultId, setSelectedFaultId] = useState('line_220_1ar_success');

  const handleOpenAnalysis = (faultId) => {
    if (faultId) {
      setSelectedFaultId(faultId);
    }
    setCurrentPage('analysis');
  };

  return (
    <div className="min-h-screen bg-[#0d0d12]">
      {/* 1. მთავარი სქემის გვერდი */}
      {currentPage === 'dashboard' && (
        <DashboardPage 
          onOpenAnalysis={handleOpenAnalysis}
          onOpenDocs={() => setCurrentPage('docs')} 
        />
      )}

      {/* 2. ავარიების ანალიზის / ოსცილოგრამების გვერდი */}
      {currentPage === 'analysis' && (
        <FaultAnalysisPage 
          selectedFaultId={selectedFaultId} 
          onBackToSchema={() => setCurrentPage('dashboard')} 
        />
      )}

      {/* 3. რელეების დოკუმენტაციის გვერდი */}
      {currentPage === 'docs' && (
        <RelayDocPage 
          onBackToSchema={() => setCurrentPage('dashboard')} 
        />
      )}
    </div>
  );
}