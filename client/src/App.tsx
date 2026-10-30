import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityDataProvider } from './context/CityDataContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { CityAssistBot } from './components/CityAssistBot';
import { ComplaintModal } from './components/ComplaintModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CityMapPage } from './pages/CityMapPage';
import { TrafficModulePage } from './pages/TrafficModulePage';
import { WaterModulePage } from './pages/WaterModulePage';
import { WasteModulePage } from './pages/WasteModulePage';
import { EnergyModulePage } from './pages/EnergyModulePage';
import { DrainageModulePage } from './pages/DrainageModulePage';
import { EnvironmentModulePage } from './pages/EnvironmentModulePage';
import { PublicSafetyPage } from './pages/PublicSafetyPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LoginPage } from './pages/LoginPage';

import { Complaint } from './types';

function AppContent() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const handleOpenComplaint = (c: Complaint) => {
    setSelectedComplaint(c);
  };

  const handleCloseComplaint = () => {
    setSelectedComplaint(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/report" element={<ReportProblemPage />} />
          <Route path="/citizen" element={<CitizenDashboardPage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/officer" element={<OfficerDashboardPage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/admin" element={<AdminDashboardPage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/map" element={<CityMapPage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/traffic" element={<TrafficModulePage />} />
          <Route path="/water" element={<WaterModulePage />} />
          <Route path="/waste" element={<WasteModulePage />} />
          <Route path="/energy" element={<EnergyModulePage />} />
          <Route path="/drainage" element={<DrainageModulePage />} />
          <Route path="/environment" element={<EnvironmentModulePage />} />
          <Route path="/safety" element={<PublicSafetyPage />} />
          <Route path="/notifications" element={<NotificationsPage onSelectComplaint={handleOpenComplaint} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Complaint Detail & Lifecycle Audit Modal */}
      <ComplaintModal
        complaint={selectedComplaint}
        onClose={handleCloseComplaint}
      />

      {/* CityAssist 24/7 AI Floating Citizen Assistant */}
      <CityAssistBot />

      {/* Municipal Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CityDataProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </CityDataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
