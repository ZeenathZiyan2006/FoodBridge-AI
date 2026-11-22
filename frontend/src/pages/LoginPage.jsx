import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Shield, Utensils, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'receiver') navigate('/receiver-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await quickLogin(role);
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'receiver') navigate('/receiver-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/40">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#14532D] text-white shadow-md shadow-[#14532D]/20 mb-2">
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">Sign In to FoodBridge AI</h2>
          <p className="text-xs text-gray-500">
            Connect surplus food with shelters, orphanages and community kitchens.
          </p>
        </div>

        {/* 1-Click Evaluation Demo Logins */}
        <div className="bg-[#FFFBEB] border border-amber-200/80 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 font-heading">
              <span>⚡ Evaluator 1-Click Demo Login</span>
            </span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-tight">
            Select a verified role to instantly explore dashboards with real pre-seeded data:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoClick('donor')}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-white border border-amber-200 hover:border-[#16A34A] hover:bg-[#ECFDF5] text-gray-800 font-semibold text-xs shadow-xs transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-[#14532D]" />
              <span className="font-heading text-[11px]">Food Donor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('receiver')}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-white border border-amber-200 hover:border-teal-600 hover:bg-teal-50 text-gray-800 font-semibold text-xs shadow-xs transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-heading text-[11px]">Receiver</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-white border border-amber-200 hover:border-purple-600 hover:bg-purple-50 text-gray-800 font-semibold text-xs shadow-xs transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-purple-700" />
              <span className="font-heading text-[11px]">Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-heading">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@foodbridge.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-heading">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-heading font-bold text-sm shadow-md shadow-[#14532D]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-heading font-bold text-[#14532D] hover:text-[#16A34A] transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
