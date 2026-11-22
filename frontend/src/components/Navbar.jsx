import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Bell,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Utensils,
  HeartHandshake,
  Shield,
  Menu,
  X,
  Layers,
  Flame,
  Globe,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { user, logout, quickLogin, unreadCount, fetchUnreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const demoRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotifications = async () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && user) {
      setLoadingNotifs(true);
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNotifs(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSwitch = async (role) => {
    setDemoDropdownOpen(false);
    await quickLogin(role);
    if (role === 'donor') navigate('/donor-dashboard');
    else if (role === 'receiver') navigate('/receiver-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'donor') return '/donor-dashboard';
    if (user.role === 'receiver') return '/receiver-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Available Food', path: '/available-food' },
    { name: 'AI Matching', path: '/matching' },
    { name: 'Impact Tracker', path: '/impact' },
    { name: 'Waste Hotspots', path: '/hotspots' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#14532D] text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Leaf className="w-5 h-5 text-[#ECFDF5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-extrabold tracking-tight text-[#14532D]">
                FoodBridge
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#16A34A] px-2 py-0.5 rounded-md border border-[#16A34A]/20">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-normal transition-all duration-150 ${
                    isActive
                      ? 'text-[#14532D] bg-[#ECFDF5] font-bold shadow-2xs'
                      : 'text-gray-600 hover:text-[#14532D] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Demo Switcher */}
            <div className="relative" ref={demoRef}>
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] text-[#92400E] text-xs font-bold hover:bg-[#FEF3C7] transition shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-[#92400E]" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-gray-100 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    1-Click Evaluation Switcher
                  </div>
                  <button
                    onClick={() => handleQuickSwitch('donor')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ECFDF5] flex items-center justify-between text-gray-800 font-medium transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-[#16A34A]" />
                      <strong>Food Donor</strong>
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">MIT Canteen</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('receiver')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ECFDF5] flex items-center justify-between text-gray-800 font-medium transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                      <strong>Receiver (NGO)</strong>
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">Hope Shelter</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('admin')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ECFDF5] flex items-center justify-between text-gray-800 font-medium transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      <strong>Administrator</strong>
                    </span>
                    <span className="text-[10px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-mono">Director</span>
                  </button>
                </div>
              )}
            </div>

            {/* In-app Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  className="relative p-2 rounded-xl text-gray-500 hover:text-[#14532D] hover:bg-[#ECFDF5] transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-2">
                      <span className="font-heading font-bold text-gray-900 text-sm">Notifications</span>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[#16A34A] hover:underline text-[11px] font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {loadingNotifs ? (
                        <p className="text-center py-6 text-gray-400">Loading...</p>
                      ) : notifications.length === 0 ? (
                        <p className="text-center py-6 text-gray-400">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl transition border ${
                              n.is_read
                                ? 'bg-gray-50/60 border-gray-100 text-gray-600'
                                : 'bg-[#ECFDF5] border-[#16A34A]/20 text-gray-900 font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#14532D] text-xs">{n.title}</span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-snug">{n.message}</p>
                            {n.link && (
                              <Link
                                to={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="inline-block mt-1 text-[11px] text-[#16A34A] font-semibold hover:underline"
                              >
                                View Details →
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-semibold shadow-xs transition duration-150"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#ECFDF5]" />
                  <span>Dashboard</span>
                  <span className="bg-[#0f3d21] text-[#ECFDF5] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    {user.role}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-[#14532D] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white font-bold text-xs shadow-xs transition duration-150"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Quick Action & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Active Role Indicator Pill on mobile */}
            {user ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-heading border shadow-2xs ${
                user.role === 'donor'
                  ? 'bg-[#FFFBEB] text-[#92400E] border-amber-300/80'
                  : user.role === 'receiver'
                  ? 'bg-[#ECFDF5] text-[#14532D] border-[#16A34A]/30'
                  : 'bg-purple-50 text-purple-800 border-purple-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  user.role === 'donor' ? 'bg-[#F59E0B]' : user.role === 'receiver' ? 'bg-[#16A34A]' : 'bg-purple-600'
                }`} />
                <span className="capitalize">{user.role}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickSwitch('receiver')}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold font-heading bg-[#ECFDF5] text-[#14532D] border border-[#16A34A]/30 shadow-2xs"
              >
                ⚡ Demo
              </button>
            )}

            {user && (
              <button
                type="button"
                onClick={handleOpenNotifications}
                className="relative p-1.5 rounded-xl text-gray-500 hover:text-[#14532D] hover:bg-[#ECFDF5] transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#16A34A]" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-[#14532D] hover:bg-gray-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-fade-in text-sm font-medium shadow-xl">
          {/* Active Persona Card in Drawer */}
          {user && (
            <div className="p-3.5 bg-[#F8FAF7] rounded-2xl border border-gray-200/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  Active Evaluator Persona
                </p>
                <p className="font-heading font-extrabold text-gray-900 text-sm mt-0.5">
                  {user.full_name}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'donor'
                    ? 'bg-amber-100 text-amber-900'
                    : user.role === 'receiver'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-purple-100 text-purple-900'
                }`}>
                  {user.role} Account
                </span>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 bg-[#14532D] text-white rounded-xl text-xs font-bold font-heading shadow-xs"
              >
                Go to Dashboard →
              </Link>
            </div>
          )}

          {/* Quick Role Switcher Buttons */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
              ⚡ 1-Click Role Switcher
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleQuickSwitch('donor');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-heading font-bold text-center border transition cursor-pointer ${
                  user?.role === 'donor'
                    ? 'bg-[#14532D] text-white border-[#14532D]'
                    : 'bg-white text-gray-800 border-amber-200 hover:bg-[#ECFDF5]'
                }`}
              >
                Food Donor
              </button>
              <button
                onClick={() => {
                  handleQuickSwitch('receiver');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-heading font-bold text-center border transition cursor-pointer ${
                  user?.role === 'receiver'
                    ? 'bg-[#14532D] text-white border-[#14532D]'
                    : 'bg-white text-gray-800 border-amber-200 hover:bg-[#ECFDF5]'
                }`}
              >
                Receiver
              </button>
              <button
                onClick={() => {
                  handleQuickSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-heading font-bold text-center border transition cursor-pointer ${
                  user?.role === 'admin'
                    ? 'bg-purple-800 text-white border-purple-800'
                    : 'bg-white text-gray-800 border-amber-200 hover:bg-purple-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold transition ${
                  location.pathname === link.path
                    ? 'bg-[#ECFDF5] text-[#14532D]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-heading font-bold text-xs text-[#14532D]"
                >
                  View My Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-xl border border-gray-200 text-gray-800 font-heading font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#14532D] text-white font-heading font-bold text-xs shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
