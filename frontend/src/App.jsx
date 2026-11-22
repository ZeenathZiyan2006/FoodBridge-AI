import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { DashboardSidePanel } from './components/DashboardSidePanel';
import { LayoutDashboard } from 'lucide-react';

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

// Error Boundary to prevent blank page crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#F8FAF7]">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#14532D] flex items-center justify-center border border-[#16A34A]/20 text-2xl">
            🌱
          </div>
          <h2 className="text-xl font-bold font-heading text-gray-900">FoodBridge AI Notice</h2>
          <p className="text-xs text-gray-500 max-w-md">
            {this.state.error?.message || "An unexpected issue occurred while rendering. Click below to return home."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white font-heading font-bold text-xs shadow-xs cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const { toggleDashboardPanel } = useAuth();

  return (
    <ErrorBoundary>
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
      <DashboardSidePanel />

      {/* Floating Quick Dashboard Panel Toggle */}
      <button
        onClick={toggleDashboardPanel}
        type="button"
        aria-label="Open Dashboard Side Panel"
        className="fixed bottom-6 right-6 z-40 bg-[#064E3B] hover:bg-[#043327] text-white p-3.5 sm:px-4 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl border border-emerald-500/30 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        title="Open Dashboard Side Panel (Live KPIs & Role Switcher)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <LayoutDashboard className="w-4.5 h-4.5 text-emerald-300 group-hover:rotate-6 transition-transform" />
        <span className="hidden sm:inline font-heading font-bold text-xs tracking-wide">
          Dashboard Panel
        </span>
      </button>
    </div>
  </ErrorBoundary>
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
