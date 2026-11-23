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

  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' or 'demo'
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
      desc: 'Authorized to list surplus meals, manage batches, and approve shelter requests.'
    },
    {
      role: 'receiver',
      title: 'Food Receiver (Orphanage Shelter)',
      email: 'receiver.hope@foodbridge.ai',
      password: 'password123',
      badge: "Hope Orphanage",
      icon: HeartHandshake,
      desc: 'Authorized to browse surplus food inventory, request portions, and track pickups.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email: email.trim().toLowerCase(), password });
      
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (user.role === 'receiver') {
        navigate('/receiver-dashboard');
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
    showToast(`Loaded credentials for ${demo.title}`, 'info');
  };

  const handleInstantDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(role);
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'receiver') navigate('/receiver-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#123C2D]/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Premium Nature Green Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#42B883]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E9A23B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Leaf className="w-6 h-6 text-[#E8F5ED]" />
              </div>
              <div>
                <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  FoodBridge <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F5ED]/20 text-[#E8F5ED] border border-white/30">AI</span>
                </span>
                <p className="text-[11px] text-[#E8F5ED]/80 font-medium">
                  Smart Surplus Food Redistribution
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Zero Hunger.<br />
                <span className="text-[#42B883]">Zero Food Waste.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#E8F5ED]/85 leading-relaxed font-normal">
                Connecting commercial kitchens, college canteens, and caterers with local NGOs and shelters through verified, algorithmic matchmaking.
              </p>
            </div>
          </div>

          {/* Security & RBAC Assurances */}
          <div className="relative my-8 space-y-3 bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 text-xs">
            <div className="flex items-center gap-2 text-[#42B883] font-heading font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#42B883]" />
              <span>Platform Security Protocol</span>
            </div>

            <div className="space-y-2 text-[#E8F5ED]/90 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>Role Segregation (RBAC)</strong>: Donor and Receiver dashboards are isolated to ensure audit integrity.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>Encrypted Authentication</strong>: Secure tokens with PBKDF2 password hashing.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>FSSAI Food Safety</strong>: Only active, edible food listings are permitted.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative pt-2 border-t border-white/10 text-[11px] text-[#E8F5ED]/60 flex items-center justify-between">
            <span>FoodBridge AI Sustainability Platform</span>
            <span className="font-mono text-[#42B883] font-bold">2026 Edition</span>
          </div>
        </div>

        {/* Right Side: Professional Clean Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header Titles */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5ED] text-[#123C2D] text-[11px] font-heading font-extrabold border border-[#16865B]/20">
                <KeyRound className="w-3 h-3 text-[#16865B]" />
                <span>Secure User Sign In</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] tracking-tight">
                Sign In to FoodBridge AI
              </h1>
              <p className="text-xs text-[#718078]">
                Enter your credentials to access your authorized role dashboard.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#F8FAF7] rounded-full border border-[#123C2D]/8 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`py-2 px-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'credentials'
                    ? 'bg-[#123C2D] text-white shadow-xs'
                    : 'text-[#718078] hover:text-[#123C2D]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Account Login</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`py-2 px-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'demo'
                    ? 'bg-[#123C2D] text-white shadow-xs'
                    : 'text-[#718078] hover:text-[#123C2D]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
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
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                {selectedDemoRole && (
                  <div className="p-2.5 bg-[#FEF7EC] border border-[#E9A23B]/40 rounded-xl text-[#9A6217] text-xs flex items-center justify-between">
                    <span className="font-medium text-[11px]">
                      Selected Persona: <strong className="uppercase">{selectedDemoRole}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDemoRole(null);
                        setEmail('');
                        setPassword('');
                      }}
                      className="text-[10px] text-[#9A6217] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      name="foodbridge_login_email"
                      data-lpignore="true"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@foodbridge.ai or your registered email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm text-[#202B25] placeholder-[#718078]/60 focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] transition bg-[#F8FAF7]/50"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-[#16865B] font-medium">
                      Default: password123
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      name="foodbridge_login_pwd_val"
                      data-lpignore="true"
                      data-form-type="other"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password (e.g. password123)"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm text-[#202B25] placeholder-[#718078]/60 focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] transition bg-[#F8FAF7]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718078] hover:text-[#123C2D] cursor-pointer"
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
                      className="w-4 h-4 rounded border-[#123C2D]/20 text-[#16865B] focus:ring-[#16865B]"
                    />
                    <span className="text-xs text-[#718078] font-medium">Remember session</span>
                  </label>

                  <span className="text-xs text-[#16865B] font-medium font-heading">
                    Verified Connection
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4 text-[#E8F5ED]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Tab 2: Evaluator Demo Accounts */}
            {activeTab === 'demo' && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 bg-[#FEF7EC] border border-[#E9A23B]/30 rounded-2xl text-[11px] text-[#9A6217] leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5 mb-1 font-heading">
                    <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                    <span>Quick Evaluator Demo Personas</span>
                  </p>
                  <p className="text-[#9A6217]">
                    Click any pre-seeded persona to sign in instantly with one click:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {demoAccounts.map((d) => {
                    const Icon = d.icon;
                    return (
                      <div
                        key={d.role}
                        className="p-3.5 rounded-2xl border border-[#123C2D]/10 hover:border-[#16865B]/40 hover:bg-[#E8F5ED]/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center shrink-0">
                            <Icon className="w-4.5 h-4.5 text-[#16865B]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-extrabold text-xs text-[#123C2D]">
                                {d.title}
                              </span>
                              <span className="text-[10px] bg-gray-100 text-[#718078] px-1.5 py-0.5 rounded font-mono">
                                {d.badge}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#718078] mt-0.5">
                              {d.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleSelectDemo(d)}
                            className="px-2.5 py-1.5 rounded-full border border-gray-200 text-[#718078] hover:bg-gray-100 text-[11px] font-heading font-bold transition cursor-pointer"
                            title="Pre-fill email & password in the form"
                          >
                            Fill Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInstantDemoLogin(d.role)}
                            disabled={loading}
                            className="px-3.5 py-1.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-[11px] font-heading font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>1-Click Sign In</span>
                            <ArrowRight className="w-3 h-3 text-[#E8F5ED]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Link to Register */}
            <div className="text-center pt-4 border-t border-gray-100 text-xs text-[#718078]">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="text-[#16865B] font-heading font-bold hover:underline"
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
