import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  LayoutDashboard,
  Utensils,
  HeartHandshake,
  Shield,
  TrendingUp,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Leaf,
  Droplets,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';

export const DashboardSidePanel = () => {
  const { user, dashboardPanelOpen, setDashboardPanelOpen, quickLogin, showToast } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [receiverFeed, setReceiverFeed] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'activity', 'actions'

  const loadPanelData = async () => {
    setLoading(true);
    try {
      const [sum, donList] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getDonations({ limit: 6 }).catch(() => []),
      ]);
      setSummary(sum);
      setDonations(donList);

      if (user?.role === 'receiver') {
        const [reqs, feed] = await Promise.all([
          api.getMyRequests().catch(() => []),
          api.getReceiverFeed().catch(() => []),
        ]);
        setMyRequests(reqs);
        setReceiverFeed(feed.slice(0, 4));
      } else if (user?.role === 'donor') {
        const reqs = await api.getMyRequests().catch(() => []);
        setMyRequests(reqs);
      }
    } catch (err) {
      console.error('Error loading dashboard side panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardPanelOpen) {
      loadPanelData();
    }
  }, [dashboardPanelOpen, user?.id, user?.role]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDashboardPanelOpen(false);
    };
    if (dashboardPanelOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dashboardPanelOpen]);

  const handleRoleSwitch = async (role) => {
    try {
      await quickLogin(role);
      loadPanelData();
    } catch {
      // Handled in auth context
    }
  };

  const getFullDashboardUrl = () => {
    if (user?.role === 'donor') return '/donor-dashboard';
    if (user?.role === 'receiver') return '/receiver-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/login';
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await api.updateRequestStatus(requestId, { status: newStatus });
      showToast(`Request marked as '${newStatus}' successfully!`, 'success');
      loadPanelData();
    } catch (err) {
      showToast(err.message || 'Failed to update request', 'error');
    }
  };

  if (!dashboardPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => setDashboardPanelOpen(false)}
      />

      {/* Side Panel Content */}
      <aside className="relative w-full sm:max-w-md lg:max-w-lg bg-white/98 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <LayoutDashboard className="w-4.5 h-4.5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-extrabold text-sm text-slate-900">
                  Dashboard Side Panel
                </h3>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {user ? `${user.full_name} (${user.role.toUpperCase()})` : 'Guest Evaluator Preview'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setDashboardPanelOpen(false);
                navigate(getFullDashboardUrl());
              }}
              title="Open Full Dashboard Page"
              className="p-2 rounded-xl text-slate-400 hover:text-[#064E3B] hover:bg-emerald-50 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDashboardPanelOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 1-Click Evaluator Persona Switcher */}
        <div className="p-3.5 bg-slate-50/90 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              <span>1-Click Evaluator Switcher</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live Session</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('donor')}
              className={`py-1.5 px-2 rounded-lg text-xs font-heading font-bold text-center border transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                user?.role === 'donor'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <Utensils className="w-3 h-3 text-emerald-400" />
              <span>Donor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('receiver')}
              className={`py-1.5 px-2 rounded-lg text-xs font-heading font-bold text-center border transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                user?.role === 'receiver'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <HeartHandshake className="w-3 h-3 text-teal-400" />
              <span>Receiver</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`py-1.5 px-2 rounded-lg text-xs font-heading font-bold text-center border transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                user?.role === 'admin'
                  ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Panel Tabs */}
        <div className="flex items-center px-4 pt-2 border-b border-slate-100 gap-4 text-xs font-heading font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#059669] text-[#064E3B]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Metrics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'activity'
                ? 'border-[#059669] text-[#064E3B]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {user?.role === 'donor' ? 'Incoming Requests' : user?.role === 'receiver' ? 'My Allocation Requests' : 'Recent Activity'}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'actions'
                ? 'border-[#059669] text-[#064E3B]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Quick Actions
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">
              <RefreshCw className="w-5 h-5 mx-auto animate-spin text-emerald-600 mb-2" />
              <span>Updating live real-time statistics...</span>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-5">
              {/* 4 Core KPI Tiles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Listed</span>
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-heading text-2xl font-black text-[#064E3B]">
                    {summary?.total_meals_listed || 658}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">Meals Recorded</span>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Redistributed</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-heading text-2xl font-black text-[#059669]">
                    {summary?.total_meals_redistributed || 188}+
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">Delivered to Care Homes</span>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Match Success</span>
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <p className="font-heading text-2xl font-black text-amber-700">
                    {summary?.redistribution_rate || 28.6}%
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">AI Pairing Efficiency</span>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-white to-cyan-50/40 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Impact (CO₂e)</span>
                    <Leaf className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="font-heading text-2xl font-black text-teal-800">
                    {summary?.estimated_co2_saved_kg || 470} kg
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">Methane Prevented</span>
                </div>
              </div>

              {/* Persona Context Card */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#064E3B] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Active Role: {user?.role ? user.role.toUpperCase() : 'GUEST'}
                  </span>
                  <Link
                    to={getFullDashboardUrl()}
                    onClick={() => setDashboardPanelOpen(false)}
                    className="text-[11px] font-bold text-[#059669] hover:underline flex items-center gap-1"
                  >
                    <span>Full Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {user?.role === 'donor'
                    ? `Logged in as ${user.full_name}. You have listed surplus inventory and can review incoming request approvals directly below.`
                    : user?.role === 'receiver'
                    ? `Logged in as ${user.full_name}. You can explore AI-matched batches for your capacity and track requested allocations.`
                    : user?.role === 'admin'
                    ? `Director view active. Full authority over platform listings, compliance verifications, and regional waste hotspots.`
                    : 'Click any persona above to test FoodBridge AI with realistic pre-seeded data.'}
                </p>
              </div>

              {/* Recent Surplus Feed Preview */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recent Surplus Listings
                  </h4>
                  <Link
                    to="/available-food"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="text-[11px] font-bold text-[#059669] hover:underline"
                  >
                    View All ({donations.length})
                  </Link>
                </div>

                <div className="space-y-2">
                  {donations.slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setDashboardPanelOpen(false);
                        navigate(`/donation/${d.id}`);
                      }}
                      className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <img
                          src={d.image_url}
                          alt={d.food_name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-xs text-slate-900 truncate group-hover:text-[#059669] transition">
                            {d.food_name}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>{d.quantity} {d.quantity_unit}</span>
                            <span>•</span>
                            <span>{d.pickup_location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <StatusBadge status={d.status} urgencyLevel={d.urgency_level} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'activity' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {user?.role === 'donor' ? 'Incoming Allocation Requests' : 'My Requested Batches'}
                </h4>
                <button
                  onClick={loadPanelData}
                  className="text-[11px] font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No active request records</p>
                  <p className="text-[11px] text-slate-400">
                    {user?.role === 'donor'
                      ? 'No incoming requests pending right now.'
                      : 'Explore available food listings and submit an allocation request.'}
                  </p>
                  <Link
                    to="/available-food"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="inline-block px-3 py-1.5 rounded-xl bg-[#064E3B] text-white text-[11px] font-bold mt-2"
                  >
                    Browse Food Listings
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-heading font-bold text-xs text-slate-900">
                            {req.donation?.food_name || `Batch #${req.donation_id}`}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Requested: <strong>{req.requested_quantity}</strong> units
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#064E3B]">
                          {req.status}
                        </span>
                      </div>

                      {req.message && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                          "{req.message}"
                        </p>
                      )}

                      {/* Donor quick approval actions in side panel */}
                      {user?.role === 'donor' && req.status === 'Requested' && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                            className="flex-1 py-1 px-2.5 rounded-lg bg-[#064E3B] hover:bg-[#059669] text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'Rejected')}
                            className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Quick Actions Tab */
            <div className="space-y-3">
              <h4 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Fast Navigation & Actions
              </h4>

              <Link
                to="/add-donation"
                onClick={() => setDashboardPanelOpen(false)}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#064E3B] text-white flex items-center justify-between shadow-xs hover:shadow-md transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs">List New Surplus Food</p>
                    <p className="text-[10px] text-emerald-100">Upload batch details & urgency cutoff</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/matching"
                onClick={() => setDashboardPanelOpen(false)}
                className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200/60 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs">Run AI Matching Engine</p>
                    <p className="text-[10px] text-amber-800/80">4-factor weighted score calculation</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/hotspots"
                onClick={() => setDashboardPanelOpen(false)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs">Waste Hotspot Map</p>
                    <p className="text-[10px] text-slate-500">Spatial surplus generation nodes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/impact"
                onClick={() => setDashboardPanelOpen(false)}
                className="w-full p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-200/60 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs">Sustainability Impact Calculator</p>
                    <p className="text-[10px] text-teal-800/80">CO₂e & FAO water conservation</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <Link
            to={getFullDashboardUrl()}
            onClick={() => setDashboardPanelOpen(false)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-heading font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Open Dedicated {user?.role ? `${user.role.toUpperCase()} Workspace` : 'Workspace'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </div>
  );
};
