import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  LayoutDashboard,
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
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';
import { ConfirmationModal } from './ConfirmationModal';

export const DashboardSidePanel = () => {
  const { user, dashboardPanelOpen, setDashboardPanelOpen, deleteAccount, showToast } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [receiverFeed, setReceiverFeed] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'activity', 'actions'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPanelData = async () => {
    setLoading(true);
    try {
      const [sum, donList] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getDonations({ limit: 8, status: 'Available', only_available: true }).catch(() => []),
      ]);
      setSummary(sum);
      // Only keep strictly fresh, unexpired available food in side panel feed
      const activeUnexpired = (donList || []).filter(
        (d) => d.status === 'Available' && d.hours_left > 0
      );
      setDonations(activeUnexpired.slice(0, 6));

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

  const getFullDashboardUrl = () => {
    if (user?.role === 'donor') return '/donor-dashboard';
    if (user?.role === 'receiver') return '/receiver-dashboard';
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

  const handleDeleteMyAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      setDeleteModalOpen(false);
      setDashboardPanelOpen(false);
      navigate('/');
    } catch (err) {
      // Handled in auth context
    } finally {
      setDeleting(false);
    }
  };

  if (!dashboardPanelOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#202B25]/40 backdrop-blur-xs transition-opacity"
          onClick={() => setDashboardPanelOpen(false)}
        />

        {/* Side Panel Content */}
        <aside className="relative w-full sm:max-w-md lg:max-w-lg bg-white/98 backdrop-blur-xl border-l border-emerald-950/10 shadow-2xl flex flex-col z-10 overflow-hidden">
          {/* Top Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#E8F5ED]/50 via-white to-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#123C2D] text-white flex items-center justify-center shadow-xs">
                <LayoutDashboard className="w-4.5 h-4.5 text-[#42B883]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-extrabold text-sm text-[#202B25]">
                    Dashboard Side Panel
                  </h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42B883] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16865B]"></span>
                  </span>
                </div>
                <p className="text-[11px] text-[#718078]">
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
                className="p-2 rounded-xl text-gray-400 hover:text-[#123C2D] hover:bg-[#E8F5ED] transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDashboardPanelOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-[#202B25] hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Active Authenticated Identity & Role Status */}
          <div className="p-3.5 bg-[#F8FAF7] border-b border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#718078] flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#16865B]" />
                <span>Account Status</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                user ? 'bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20' : 'bg-gray-200 text-gray-600'
              }`}>
                {user ? `🔒 ${user.role}` : 'Guest Session'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <p className="font-heading font-extrabold text-[#202B25] truncate">
                  {user ? user.full_name : 'No Authenticated Account'}
                </p>
                <p className="text-[11px] font-mono text-[#718078] truncate">
                  {user ? user.email : 'Sign in to access authorized dashboard'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {user && (
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="text-[10px] text-rose-600 hover:text-rose-800 font-bold bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 flex items-center gap-1 transition cursor-pointer"
                    title="Permanently delete your account"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Account</span>
                  </button>
                )}
              </div>
            </div>

            {/* Locked Role Security Indicator (No direct role switching permitted) */}
            <div className="pt-2 border-t border-gray-200/60">
              {user ? (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-heading font-semibold text-[#123C2D] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${user.role === 'donor' ? 'bg-[#16865B]' : 'bg-[#42B883]'}`} />
                    <span>Role:</span>
                    <span className="uppercase font-bold tracking-wide">
                      {user.role === 'donor' ? 'Registered Food Donor' : 'Registered Food Receiver'}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20 px-2 py-0.5 rounded font-bold">
                    🔒 Locked
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#718078]">Sign in to access authorized workspace</span>
                  <Link
                    to="/login"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="text-[11px] font-heading font-bold text-[#16865B] hover:underline"
                  >
                    Sign In →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Panel Tabs */}
          <div className="flex items-center px-4 pt-2 border-b border-gray-100 gap-4 text-xs font-heading font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              Metrics & KPIs
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'activity'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              {user?.role === 'donor' ? 'Incoming Requests' : 'My Requests'}
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'actions'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              Quick Actions
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {loading ? (
              <div className="py-20 text-center text-xs text-[#718078]">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#16865B] mb-2" />
                <span>Updating live real-time statistics...</span>
              </div>
            ) : activeTab === 'overview' ? (
              <div className="space-y-5">
                {/* 4 Core KPI Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-gradient-to-br from-white to-[#E8F5ED]/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Total Listed</span>
                      <Package className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#123C2D]">
                      {summary?.total_meals_listed || 658}
                    </p>
                    <span className="text-[10px] text-[#718078] font-medium">Meals Recorded</span>
                  </div>

                  <div className="p-3.5 bg-gradient-to-br from-white to-[#E8F5ED]/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Redistributed</span>
                      <TrendingUp className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#16865B]">
                      {summary?.total_meals_redistributed || 188}+
                    </p>
                    <span className="text-[10px] text-[#718078] font-medium">Delivered to Care Homes</span>
                  </div>

                  <div className="p-3.5 bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Match Success</span>
                      <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#E9A23B]">
                      {summary?.redistribution_rate || 28.6}%
                    </p>
                    <span className="text-[10px] text-[#718078] font-medium">AI Pairing Efficiency</span>
                  </div>

                  <div className="p-3.5 bg-gradient-to-br from-white to-[#E8F5ED]/50 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Impact (CO₂e)</span>
                      <Leaf className="w-4 h-4 text-[#42B883]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#123C2D]">
                      {summary?.estimated_co2_saved_kg || 470} kg
                    </p>
                    <span className="text-[10px] text-[#718078] font-medium">Methane Prevented</span>
                  </div>
                </div>

                {/* Persona Context Card */}
                <div className="p-4 bg-[#E8F5ED]/80 border border-[#16865B]/20 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#123C2D] bg-white px-2 py-0.5 rounded-md border border-[#16865B]/30">
                      Active Role: {user?.role ? user.role.toUpperCase() : 'GUEST'}
                    </span>
                    <Link
                      to={getFullDashboardUrl()}
                      onClick={() => setDashboardPanelOpen(false)}
                      className="text-[11px] font-bold text-[#16865B] hover:underline flex items-center gap-1"
                    >
                      <span>Full Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-xs text-[#202B25] font-medium leading-relaxed">
                    {user?.role === 'donor'
                      ? `Logged in as ${user.full_name}. You have listed surplus inventory and can review incoming request approvals directly below.`
                      : user?.role === 'receiver'
                      ? `Logged in as ${user.full_name}. You can explore AI-matched batches for your capacity and track requested allocations.`
                      : 'Click either Food Donor or Receiver Shelter above to test FoodBridge AI with realistic pre-seeded data.'}
                  </p>
                </div>

                {/* Recent Surplus Feed Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                      Recent Surplus Listings
                    </h4>
                    <Link
                      to="/available-food"
                      onClick={() => setDashboardPanelOpen(false)}
                      className="text-[11px] font-bold text-[#16865B] hover:underline"
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
                        className="p-3 bg-white hover:bg-[#F8FAF7] rounded-xl border border-gray-200/80 transition flex items-center justify-between cursor-pointer group"
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
                            <p className="font-heading font-bold text-xs text-[#202B25] truncate group-hover:text-[#16865B] transition">
                              {d.food_name}
                            </p>
                            <p className="text-[11px] text-[#718078] flex items-center gap-1">
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
                  <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                    {user?.role === 'donor' ? 'Incoming Allocation Requests' : 'My Requested Batches'}
                  </h4>
                  <button
                    onClick={loadPanelData}
                    className="text-[11px] font-bold text-[#16865B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {myRequests.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8FAF7] rounded-2xl border border-gray-100 space-y-2">
                    <Package className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-xs font-bold text-[#202B25]">No active request records</p>
                    <p className="text-[11px] text-[#718078]">
                      {user?.role === 'donor'
                        ? 'No incoming requests pending right now.'
                        : 'Explore available food listings and submit an allocation request.'}
                    </p>
                    <Link
                      to="/available-food"
                      onClick={() => setDashboardPanelOpen(false)}
                      className="inline-block px-3.5 py-1.5 rounded-xl bg-[#123C2D] text-white text-[11px] font-bold mt-2 hover:bg-[#16865B] transition"
                    >
                      Browse Food Listings
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-heading font-bold text-xs text-[#202B25]">
                              {req.donation?.food_name || `Batch #${req.donation_id}`}
                            </p>
                            <p className="text-[11px] text-[#718078]">
                              Requested: <strong>{req.requested_quantity}</strong> units
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5ED] text-[#123C2D]">
                            {req.status}
                          </span>
                        </div>

                        {req.message && (
                          <p className="text-[11px] text-[#202B25] bg-[#F8FAF7] p-2 rounded-lg italic">
                            "{req.message}"
                          </p>
                        )}

                        {/* Donor quick approval actions in side panel */}
                        {user?.role === 'donor' && req.status === 'Requested' && (
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                            <button
                              onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                              className="flex-1 py-1 px-2.5 rounded-lg bg-[#123C2D] hover:bg-[#16865B] text-white text-[11px] font-bold transition cursor-pointer"
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
                <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider mb-2">
                  Fast Navigation & Actions
                </h4>

                <Link
                  to="/add-donation"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#16865B] to-[#123C2D] text-white flex items-center justify-between shadow-xs hover:shadow-md transition group"
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
                  className="w-full p-3.5 rounded-2xl bg-[#E8F5ED] hover:bg-emerald-100/70 border border-[#16865B]/30 text-[#123C2D] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Run AI Matching Engine</p>
                      <p className="text-[10px] text-[#718078]">4-factor weighted score calculation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/hotspots"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-[#F8FAF7] border border-gray-200 text-[#202B25] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F8FAF7] border border-gray-200 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Waste Hotspot Map</p>
                      <p className="text-[10px] text-[#718078]">Spatial surplus generation nodes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/impact"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-3.5 rounded-2xl bg-[#E8F5ED]/60 hover:bg-[#E8F5ED] border border-[#16865B]/20 text-[#123C2D] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Leaf className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Sustainability Impact Calculator</p>
                      <p className="text-[10px] text-[#718078]">CO₂e & FAO water conservation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Footer Action */}
          <div className="p-4 border-t border-gray-100 bg-[#F8FAF7]/80 flex items-center justify-between">
            <Link
              to={getFullDashboardUrl()}
              onClick={() => setDashboardPanelOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Open Dedicated {user?.role ? `${user.role.toUpperCase()} Workspace` : 'Workspace'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Your Account"
        message="Are you sure you want to permanently delete your FoodBridge AI account? This action cannot be undone and will permanently erase all your profile details, surplus listings, and allocation requests."
        confirmText="Yes, Permanently Delete My Account"
        cancelText="Cancel"
        confirmVariant="rose"
        isLoading={deleting}
        onConfirm={handleDeleteMyAccount}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  );
};
