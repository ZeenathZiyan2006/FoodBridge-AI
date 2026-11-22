import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AvailableFoodPage } from './pages/AvailableFoodPage';
import { DonationDetailPage } from './pages/DonationDetailPage';
import { MatchingEnginePage } from './pages/MatchingEnginePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { AddDonationPage } from './pages/AddDonationPage';
import { ReceiverDashboard } from './pages/ReceiverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { HotspotsPage } from './pages/HotspotsPage';
import { ImpactPage } from './pages/ImpactPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1F2937]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/available-food" element={<AvailableFoodPage />} />
          <Route path="/donation/:id" element={<DonationDetailPage />} />
          <Route path="/matching" element={<MatchingEnginePage />} />
          <Route path="/hotspots" element={<HotspotsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-Specific Dashboards */}
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-donation"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <AddDonationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver-dashboard"
            element={
              <ProtectedRoute allowedRoles={['receiver', 'admin']}>
                <ReceiverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
