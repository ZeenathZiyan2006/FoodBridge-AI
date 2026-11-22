import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  Utensils,
  HeartHandshake,
  Eye,
  EyeOff,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, quickLogin, showToast } = useAuth();
  const navigate = useNavigate();

  // Mode: 'credentials' (default standard login) or 'demo' (evaluator quick pick)
  const [activeTab, setActiveTab] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  const demoAccounts = [
    {
      role: 'donor',
      title: 'Food Donor (College Canteen)',
      email: 'donor.manipal@foodbridge.ai',
      password: 'password123',
      badge: 'MIT Food Court',
      icon: Utensils,
      color: 'emerald',
      desc: 'Authorized to list surplus meals, manage batches, and approve receiver requests.'
    },
    {
      role: 'receiver',
      title: 'Food Receiver (Orphanage NGO)',
      email: 'receiver.hope@foodbridge.ai',
      password: 'password123',
      badge: "Hope Orphanage",
      icon: HeartHandshake,
      color: 'teal',
      desc: 'Authorized to request surplus food, browse active inventory, and track collections.'
    },
    {
      role: 'admin',
      title: 'System Administrator',
      email: 'admin@foodbridge.ai',
      password: 'password123',
      badge: 'Director Office',
      icon: Shield,
      color: 'purple',
      desc: 'Full administrative access, waste hotspot monitoring, and compliance analytics.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email: email.trim().toLowerCase(), password });
      
      // Strict role-based navigation based on account record
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (user.role === 'receiver') {
        navigate('/receiver-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedDemoRole(demo.role);
    setActiveTab('credentials');
    showToast(`Loaded credentials for ${demo.title} (${demo.email})`, 'info');
  };

  const handleInstantDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await quickLogin(role);
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'receiver') navigate('/receiver-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Sustainability & Security Brand Showcase (Desktop / Tablet) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#064E3B] via-[#043327] to-[#022C22] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Leaf className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  FoodBridge <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">AI</span>
                </span>
                <p className="text-[11px] text-emerald-100/70 font-medium">
                  Smart Surplus Food Redistribution
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Zero Hunger.<br />
                <span className="text-emerald-300">Zero Food Waste.</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Connecting commercial kitchens, college canteens, and caterers with local NGOs and shelters through verified, algorithmic matchmaking.
              </p>
            </div>
          </div>

          {/* Middle: Security & RBAC Assurances */}
          <div className="relative my-8 space-y-3.5 bg-white/5 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-heading font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Platform Security Guarantees</span>
            </div>

            <div className="space-y-2.5 text-emerald-100/90 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Role Segregation (RBAC)</strong>: Donor, Receiver, and Admin accounts are isolated. Same email cannot jump roles without explicit authorization.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>PBKDF2 SHA-256 Hashing</strong>: Passwords are encrypted before storage. Zero plain-text persistence.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>FSSAI Safety Compliance</strong>: Only active, edible food listings are approved for public redistribution.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative pt-2 border-t border-white/10 text-[11px] text-emerald-200/60 flex items-center justify-between">
            <span>College Innovation Project Exhibition</span>
            <span className="font-mono text-emerald-400 font-bold">2026 Edition</span>
          </div>
        </div>

        {/* Right Side: Interactive Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header Titles */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#064E3B] text-[11px] font-bold border border-emerald-500/20">
                <KeyRound className="w-3 h-3 text-[#059669]" />
                <span>Secure User Authentication</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Your Account
              </h1>
              <p className="text-xs text-slate-500">
                Enter your credentials to access your authorized role dashboard.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'credentials'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#059669]" />
                <span>Account Login</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'demo'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-slate-500 hover:text-amber-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Demo Accounts</span>
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Tab 1: Standard Credentials Login */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedDemoRole && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-center justify-between">
                    <span className="font-medium text-[11px]">
                      Selected Role: <strong className="uppercase">{selectedDemoRole}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDemoRole(null);
                        setEmail('');
                        setPassword('');
                      }}
                      className="text-[10px] text-amber-800 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@foodbridge.ai or your registered email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition bg-white"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Encrypted transmission
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#059669] focus:ring-[#059669]"
                    />
                    <span className="text-xs text-slate-600 font-medium">Keep me authenticated</span>
                  </label>

                  <span className="text-xs text-emerald-700 font-medium">
                    256-Bit SSL
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043327] text-white font-heading font-extrabold text-sm shadow-md shadow-[#064E3B]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>

                {/* Role-Lock Security Notice */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 leading-relaxed text-center">
                  🔒 <strong>RBAC Policy</strong>: Your email strictly unlocks your assigned role. You cannot access unauthorized dashboards with the same account.
                </div>
              </form>
            )}

            {/* Tab 2: Evaluator Demo Accounts */}
            {activeTab === 'demo' && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5 mb-1 font-heading">
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Exhibition & Evaluator Quick Demo Accounts</span>
                  </p>
                  <p className="text-amber-800">
                    Each role uses a separate, verified email address. Click an account to pre-fill its credentials or sign in instantly:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {demoAccounts.map((d) => {
                    const Icon = d.icon;
                    return (
                      <div
                        key={d.role}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            d.role === 'donor'
                              ? 'bg-emerald-100 text-[#064E3B]'
                              : d.role === 'receiver'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-extrabold text-xs text-slate-900">
                                {d.title}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                {d.badge}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {d.email}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                              {d.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleSelectDemo(d)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold font-heading transition cursor-pointer"
                            title="Pre-fill email & password in the form"
                          >
                            Fill Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInstantDemoLogin(d.role)}
                            disabled={loading}
                            className={`px-3 py-1.5 rounded-xl text-white text-[11px] font-bold font-heading transition shadow-xs cursor-pointer flex items-center gap-1 ${
                              d.role === 'donor'
                                ? 'bg-[#064E3B] hover:bg-[#043327]'
                                : d.role === 'receiver'
                                ? 'bg-teal-800 hover:bg-teal-900'
                                : 'bg-purple-800 hover:bg-purple-900'
                            }`}
                          >
                            <span>1-Click Sign In</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Link to Register */}
            <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
              Don't have a verified account yet?{' '}
              <Link
                to="/register"
                className="text-[#059669] font-heading font-bold hover:underline"
              >
                Register as a Donor or Receiver →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
