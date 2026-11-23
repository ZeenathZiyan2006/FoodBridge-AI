import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { DashboardSidePanel } from './components/DashboardSidePanel';
import { LayoutDashboard, ShieldAlert } from 'lucide-react';

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
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#F8FAF7] font-sans">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center border border-[#16865B]/20 text-2xl shadow-xs">
            🌱
          </div>
          <h2 className="text-xl font-bold font-heading text-[#202B25]">FoodBridge AI Notice</h2>
          <p className="text-xs text-[#718078] max-w-md">
            {this.state.error?.message || "An unexpected issue occurred while rendering. Click below to return home."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="px-5 py-2.5 rounded-xl bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Role Access Restriction Guard (403 Forbidden Screen)
const RoleAccessDenied = ({ user, allowedRoles }) => {
  const { logout } = useAuth();
  
  const getAuthorizedDashboard = () => {
    if (user?.role === 'donor') return '/donor-dashboard';
    if (user?.role === 'receiver') return '/receiver-dashboard';
    return '/';
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 text-center font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            HTTP 403 Forbidden • Role Restricted
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-[#202B25] tracking-tight">
            Role Permission Required
          </h2>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed max-w-md mx-auto">
            You are signed in as <strong className="text-[#202B25] font-bold">{user?.full_name}</strong> with the account role <span className="uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{user?.role}</span> ({user?.email}).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-gray-200 text-left text-xs text-[#718078] space-y-1.5">
          <p className="font-bold text-[#202B25] font-heading">Security Protocol Notice:</p>
          <p>
            This dashboard is strictly restricted to accounts registered as: <strong className="text-[#202B25] uppercase">{allowedRoles?.join(', ')}</strong>.
          </p>
          <p className="text-[11px] text-[#718078]">
            Under FoodBridge AI's Role-Based Access Control (RBAC), a single email address cannot access unauthorized donor or receiver workflows.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={getAuthorizedDashboard()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs shadow-xs transition"
          >
            Go to My {user?.role?.toUpperCase()} Dashboard →
          </Link>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 font-heading font-bold text-xs border border-gray-200 transition cursor-pointer"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#718078] font-sans">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <RoleAccessDenied user={user} allowedRoles={allowedRoles} />;
  }

  return children;
};

function AppContent() {
  const { toggleDashboardPanel } = useAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#202B25] font-sans">
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
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-donation"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <AddDonationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver-dashboard"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <ReceiverDashboard />
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
        className="fixed bottom-6 right-6 z-40 bg-[#123C2D] hover:bg-[#16865B] text-white p-3.5 sm:px-4 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl border border-[#42B883]/30 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        title="Open Dashboard Side Panel (Live KPIs & Role Switcher)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42B883] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#42B883]"></span>
        </span>
        <LayoutDashboard className="w-4.5 h-4.5 text-[#42B883] group-hover:rotate-6 transition-transform" />
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
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
