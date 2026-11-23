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
  Leaf,
  CheckCircle2,
  ArrowRight,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { user, logout, quickLogin, unreadCount, fetchUnreadCount, toggleDashboardPanel, showToast } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const demoRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
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
    if (user) {
      showToast('Active session in progress. Direct role switching is prohibited. Please sign out first.', 'error');
      return;
    }
    const res = await quickLogin(role);
    if (res) {
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'receiver') navigate('/receiver-dashboard');
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'donor') return '/donor-dashboard';
    if (user.role === 'receiver') return '/receiver-dashboard';
    return '/';
  };

  const homePath = user?.role === 'donor'
    ? '/donor-dashboard'
    : user?.role === 'receiver'
    ? '/receiver-dashboard'
    : '/';

  const navLinks = [
    { name: t('home'), path: homePath },
    { name: t('available_food'), path: '/available-food' },
    { name: t('ai_matching'), path: '/matching' },
    { name: t('impact_tracker'), path: '/impact' },
    { name: t('waste_hotspots'), path: '/hotspots' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#123C2D]/8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo on the left with dynamic home redirection based on role */}
          <Link to={homePath} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#123C2D] to-[#16865B] text-white flex items-center justify-center shadow-md shadow-[#123C2D]/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#16865B]/25">
              <Leaf className="w-5 h-5 text-[#E8F5ED]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-extrabold tracking-tight text-[#123C2D]">
                FoodBridge
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#E8F5ED] text-[#16865B] px-2 py-0.5 rounded-full border border-[#16865B]/20">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-[#123C2D] bg-[#E8F5ED] font-bold shadow-2xs'
                      : 'text-[#718078] hover:text-[#123C2D] hover:bg-[#F8FAF7]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Multi-language Selector (English, Hindi, Kannada) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#123C2D]/12 bg-white hover:bg-[#F8FAF7] text-[#123C2D] text-xs font-heading font-bold shadow-2xs transition-all cursor-pointer"
                title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ / भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-[#16865B]" />
                <span className="uppercase text-[11px] tracking-wider">
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#718078]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#123C2D]/10 p-1.5 z-50 animate-fade-in text-xs space-y-0.5">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#718078] border-b border-gray-100">
                    Language / ಭಾಷೆ / भाषा
                  </div>
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-heading font-medium transition cursor-pointer ${
                      language === 'en' ? 'bg-[#E8F5ED] text-[#123C2D] font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B]" />}
                  </button>

                  <button
                    onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-heading font-medium transition cursor-pointer ${
                      language === 'hi' ? 'bg-[#E8F5ED] text-[#123C2D] font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B]" />}
                  </button>

                  <button
                    onClick={() => { setLanguage('kn'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-heading font-medium transition cursor-pointer ${
                      language === 'kn' ? 'bg-[#E8F5ED] text-[#123C2D] font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>ಕನ್ನಡ (Kannada)</span>
                    {language === 'kn' && <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Demo Switcher for guests (Hidden once user is signed in) */}
            {!user && (
              <div className="relative" ref={demoRef}>
                <button
                  type="button"
                  onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E9A23B]/30 bg-[#FEF7EC] text-[#9A6217] text-xs font-heading font-bold hover:bg-[#FDF0D9] transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                  <span>Demo Accounts</span>
                  <ChevronDown className="w-3 h-3 text-[#9A6217]" />
                </button>

                {demoDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-76 bg-white rounded-2xl shadow-xl border border-[#123C2D]/10 p-2.5 z-50 animate-fade-in text-xs space-y-1">
                    <div className="px-3 py-1.5 border-b border-gray-100 font-semibold text-[#718078] uppercase tracking-wider text-[10px]">
                      Quick Evaluator Persona Switch
                    </div>
                    <button
                      onClick={() => handleQuickSwitch('donor')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#E8F5ED] flex flex-col gap-0.5 text-[#202B25] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-heading font-extrabold text-xs text-[#123C2D]">
                          <Utensils className="w-3.5 h-3.5 text-[#16865B]" />
                          <span>Food Donor Account</span>
                        </span>
                        <span className="text-[10px] bg-[#E8F5ED] text-[#123C2D] px-1.5 py-0.5 rounded font-mono font-bold">MIT Canteen</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#718078]">donor.manipal@foodbridge.ai</span>
                    </button>

                    <button
                      onClick={() => handleQuickSwitch('receiver')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#E8F5ED] flex flex-col gap-0.5 text-[#202B25] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-heading font-extrabold text-xs text-[#16865B]">
                          <HeartHandshake className="w-3.5 h-3.5 text-[#16865B]" />
                          <span>Receiver NGO Account</span>
                        </span>
                        <span className="text-[10px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">Hope Shelter</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#718078]">receiver.hope@foodbridge.ai</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* In-app Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  className="relative p-2 rounded-full text-[#718078] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#16865B] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#123C2D]/10 p-3 z-50 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-2">
                      <span className="font-heading font-bold text-[#123C2D] text-sm">Notifications</span>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[#16865B] hover:underline text-[11px] font-semibold cursor-pointer"
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
                                : 'bg-[#E8F5ED] border-[#16865B]/20 text-[#202B25] font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#123C2D] text-xs">{n.title}</span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#202B25] leading-snug">{n.message}</p>
                            {n.link && (
                              <Link
                                to={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="inline-block mt-1 text-[11px] text-[#16865B] font-semibold hover:underline"
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

            {/* User Profile or Sign In / Get Started */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 hover:shadow-lg transition-all duration-200"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#E8F5ED]" />
                  <span>Dashboard</span>
                  <span className="bg-[#16865B] text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                    {user.role}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-[#718078] hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-xs font-heading font-bold text-[#202B25] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs shadow-md shadow-[#123C2D]/15 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Quick Action & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {user ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-heading border shadow-2xs ${
                user.role === 'donor'
                  ? 'bg-[#FEF7EC] text-[#9A6217] border-[#E9A23B]/30'
                  : user.role === 'receiver'
                  ? 'bg-[#E8F5ED] text-[#123C2D] border-[#16865B]/30'
                  : 'bg-purple-50 text-purple-800 border-purple-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  user.role === 'donor' ? 'bg-[#E9A23B]' : user.role === 'receiver' ? 'bg-[#16865B]' : 'bg-purple-600'
                }`} />
                <span className="capitalize">{user.role}</span>
              </span>
            ) : (
              <Link
                to="/login"
                className="px-2.5 py-1 rounded-full text-[11px] font-bold font-heading bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/30 shadow-2xs"
              >
                Sign In
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={handleOpenNotifications}
                className="relative p-1.5 rounded-full text-[#718078] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#16865B]" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#202B25] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#123C2D]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#123C2D]/8 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-fade-in text-sm font-medium shadow-xl">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between p-2.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/8">
            <span className="text-xs font-heading font-bold text-[#123C2D] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#16865B]" />
              <span>Language / ಭಾಷೆ:</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${language === 'en' ? 'bg-[#123C2D] text-white shadow-2xs' : 'text-[#718078]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${language === 'hi' ? 'bg-[#123C2D] text-white shadow-2xs' : 'text-[#718078]'}`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${language === 'kn' ? 'bg-[#123C2D] text-white shadow-2xs' : 'text-[#718078]'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* Active Persona Card in Drawer */}
          {user && (
            <div className="p-3.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#718078]">
                  Signed In Account
                </p>
                <p className="font-heading font-extrabold text-[#123C2D] text-sm mt-0.5">
                  {user.full_name}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'donor'
                    ? 'bg-[#FEF7EC] text-[#9A6217]'
                    : user.role === 'receiver'
                    ? 'bg-[#E8F5ED] text-[#123C2D]'
                    : 'bg-purple-100 text-purple-900'
                }`}>
                  {user.role} Account
                </span>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 bg-[#123C2D] text-white rounded-full text-xs font-bold font-heading shadow-xs"
              >
                Dashboard →
              </Link>
            </div>
          )}

          {/* Mobile Drawer Account Status / Demo for Guests */}
          {user ? (
            <div className="p-3 bg-[#E8F5ED] border border-[#16865B]/20 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#123C2D]">
                  Signed In Account
                </span>
                <span className="text-[10px] font-mono bg-white text-[#123C2D] border border-[#16865B]/20 px-2 py-0.5 rounded font-bold uppercase">
                  🔒 {user.role === 'donor' ? 'Food Donor' : 'Receiver'}
                </span>
              </div>
              <p className="font-heading font-extrabold text-sm text-[#123C2D] truncate">{user.full_name}</p>
              <p className="text-[11px] font-mono text-[#718078] truncate">{user.email}</p>
            </div>
          ) : (
            <div className="p-3 bg-[#FEF7EC] border border-[#E9A23B]/30 rounded-2xl space-y-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9A6217]">
                ⚡ Quick Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleQuickSwitch('donor');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-2 rounded-xl text-xs font-heading font-bold text-center border bg-white text-[#202B25] border-[#E9A23B]/30 hover:bg-[#E8F5ED] transition cursor-pointer"
                >
                  Food Donor
                </button>
                <button
                  onClick={() => {
                    handleQuickSwitch('receiver');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-2 rounded-xl text-xs font-heading font-bold text-center border bg-white text-[#202B25] border-[#E9A23B]/30 hover:bg-[#E8F5ED] transition cursor-pointer"
                >
                  Receiver
                </button>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl font-heading text-xs font-bold transition ${
                  location.pathname === link.path
                    ? 'bg-[#E8F5ED] text-[#123C2D]'
                    : 'text-[#718078] hover:bg-[#F8FAF7] hover:text-[#123C2D]'
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
                  className="font-heading font-bold text-xs text-[#123C2D]"
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
                  className="flex-1 py-2.5 text-center rounded-full border border-[#123C2D]/15 text-[#202B25] font-heading font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-full bg-[#123C2D] text-white font-heading font-bold text-xs shadow-md shadow-[#123C2D]/15"
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
