import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Package,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  Users,
  Eye,
  Check,
  X,
  AlertCircle,
  Truck,
  Leaf,
  Droplets,
  ArrowRight,
  ChevronRight,
  ChefHat,
  Filter,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SafetyBanner } from '../components/SafetyBanner';

export const DonorDashboard = () => {
  const { user, deleteAccount, showToast } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'available', 'pending', 'completed'

  // Modal states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [allocationInputs, setAllocationInputs] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadMyDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getMyDonations();
      setDonations(data || []);
    } catch (err) {
      showToast(err.message || 'Failed to load donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyDonations();
  }, []);

  // Compute dashboard metrics
  const totalListed = donations.length;
  const availableCount = donations.filter((d) => d.status === 'Available').length;
  const requestedCount = donations.filter((d) => ['Requested', 'Accepted', 'Ready for Pickup'].includes(d.status)).length;
  const completedCount = donations.filter((d) => ['Completed', 'Collected'].includes(d.status)).length;

  const totalMealsDelivered = donations
    .filter((d) => ['Completed', 'Collected'].includes(d.status))
    .reduce((sum, d) => sum + (d.quantity || 0), 0);

  const estimatedCo2Saved = Math.round(totalMealsDelivered * 2.5);

  const handleOpenRequests = async (donation) => {
    setSelectedDonation(donation);
    try {
      const reqData = await api.getDonationRequests(donation.id);
      setRequests(reqData || []);
      setRequestsModalOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to load requests for this donation', 'error');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus, notes, approvedQuantity = null) => {
    setActionLoading(true);
    try {
      await api.updateRequestStatus(requestId, newStatus, notes, approvedQuantity);
      showToast(`Request updated to '${newStatus}'!`, 'success');
      const reqData = await api.getDonationRequests(selectedDonation.id);
      setRequests(reqData || []);
      const updatedDonation = await api.getDonation(selectedDonation.id);
      setSelectedDonation(updatedDonation);
      loadMyDonations();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDonation = async () => {
    if (!donationToDelete) return;
    setActionLoading(true);
    try {
      await api.deleteDonation(donationToDelete.id);
      showToast('Donation removed successfully', 'success');
      setDeleteModalOpen(false);
      setDonationToDelete(null);
      loadMyDonations();
    } catch (err) {
      showToast(err.message || 'Failed to delete donation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMyAccount = async () => {
    setActionLoading(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      // Handled in auth context
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered list
  const filteredDonations = donations.filter((d) => {
    if (activeFilter === 'available') return d.status === 'Available';
    if (activeFilter === 'pending') return ['Requested', 'Accepted', 'Ready for Pickup'].includes(d.status);
    if (activeFilter === 'completed') return ['Completed', 'Collected'].includes(d.status);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in font-sans">
      {/* 1. TOP WELCOME & ACTION BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-heading font-extrabold uppercase tracking-wider bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20">
              Food Donor Dashboard
            </span>
            <span className="text-xs text-[#718078] font-medium">
              {user?.donor_profile?.organization_type || 'Commercial Kitchen Partner'}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D]">
            Welcome back, {user?.full_name || 'Donor Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-1 max-w-xl">
            Manage your surplus food batches, review incoming shelter requests, and track your verified carbon reduction impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/add-donation"
            className="px-6 py-3 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-[#123C2D]/15 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#E8F5ED]" />
            <span>Add New Donation</span>
          </Link>

          <button
            type="button"
            onClick={() => setDeleteAccountModalOpen(true)}
            className="px-4 py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-heading font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Permanently delete your account and listings"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      <SafetyBanner />

      {/* 2. SUMMARY KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Total Batches</span>
            <Package className="w-5 h-5 text-[#123C2D]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#123C2D] tracking-tight">{totalListed}</p>
          <p className="text-[11px] text-[#718078] mt-1">Listed surplus donations</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Active Available</span>
            <Clock className="w-5 h-5 text-[#16865B]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#16865B] tracking-tight">{availableCount}</p>
          <p className="text-[11px] text-[#16865B] font-medium mt-1">Open for shelter matching</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Pending Requests</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-blue-700 tracking-tight">{requestedCount}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Awaiting donor action</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Completed Impact</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-purple-700 tracking-tight">{completedCount}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Successfully distributed</p>
        </div>
      </div>

      {/* 3. DONATIONS MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-6">
        {/* Table Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#123C2D]/8">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-[#123C2D]">My Food Donation Batches</h2>
            <p className="text-xs text-[#718078]">Monitor status, approve shelter requests, and track handovers in real time.</p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAF7] rounded-full border border-[#123C2D]/8 text-xs font-heading">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#123C2D] text-white font-bold shadow-xs'
                  : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              All ({donations.length})
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'available'
                  ? 'bg-[#123C2D] text-white font-bold shadow-xs'
                  : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-[#123C2D] text-white font-bold shadow-xs'
                  : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              Requests ({requestedCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-[#123C2D] text-white font-bold shadow-xs'
                  : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center text-[#718078] text-sm">Loading your donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center mx-auto">
              <Package className="w-7 h-7 text-[#16865B]" />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#123C2D]">No Donations in this Filter</h3>
            <p className="text-xs text-[#718078] max-w-sm mx-auto leading-relaxed">
              {activeFilter === 'all'
                ? "You haven't listed any surplus food batches yet. Whenever your kitchen has excess meals, list them here to feed community shelters."
                : "No donation batches currently match this filter state."}
            </p>
            <Link
              to="/add-donation"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#123C2D] text-white font-heading font-bold text-xs hover:bg-[#16865B] transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-[#E8F5ED]" />
              <span>List Surplus Food</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF7] text-[#718078] uppercase font-heading font-bold text-[10px] tracking-wider border-y border-[#123C2D]/6">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Diet / Storage</th>
                  <th className="py-3 px-4">Deadline & Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Requests</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123C2D]/6 text-[#202B25]">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8FAF7]/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.image_url}
                          alt={d.food_name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#123C2D]/10"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div>
                          <p className="font-heading font-bold text-[#123C2D] hover:underline">
                            <Link to={`/donation/${d.id}`}>{d.food_name}</Link>
                          </p>
                          <p className="text-[11px] text-[#718078]">{d.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-heading font-extrabold text-[#123C2D] font-mono text-sm">
                      {d.quantity} {d.quantity_unit}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-heading font-semibold text-[#202B25]">{d.dietary_type}</span>
                      <p className="text-[11px] text-[#718078]">{d.storage_condition}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-heading font-bold ${d.hours_left <= 3 ? 'text-[#9A6217]' : 'text-[#202B25]'}`}>
                        {d.hours_left ? `${d.hours_left} hrs left` : 'Expired'}
                      </span>
                      <p className="text-[11px] text-[#718078]">
                        {new Date(d.consumption_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} urgencyLevel={d.urgency_level} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenRequests(d)}
                        className={`px-3 py-1 rounded-full font-heading font-bold text-xs transition border cursor-pointer ${
                          d.requests && d.requests.length > 0
                            ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 text-[#718078] border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {d.requests?.length || 0} Requests
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/matching?donationId=${d.id}`}
                          className="p-2 text-[#16865B] hover:bg-[#E8F5ED] rounded-xl transition"
                          title="Run AI Matching"
                        >
                          <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                        </Link>

                        <Link
                          to={`/donation/${d.id}`}
                          className="p-2 text-[#718078] hover:text-[#123C2D] hover:bg-gray-100 rounded-xl transition"
                          title="View Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setDonationToDelete(d);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-[#718078] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DONOR IMPACT STATS HIGHLIGHT */}
      <div className="bg-[#E8F5ED] rounded-3xl p-6 sm:p-8 border border-[#16865B]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D]">
            Your Contribution to Date
          </span>
          <h3 className="font-heading text-lg font-bold text-[#123C2D]">
            Zero-Waste Verified Impact
          </h3>
          <p className="text-xs text-[#718078] max-w-lg">
            Every verified meal you donate avoids municipal landfill methane emissions while providing wholesome calories to local shelters.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16865B] font-mono block">
              {totalMealsDelivered}
            </span>
            <span className="text-[11px] text-[#718078] font-medium">Meals Delivered</span>
          </div>

          <div className="w-px h-10 bg-[#16865B]/20" />

          <div className="text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] font-mono block">
              {estimatedCo2Saved} kg
            </span>
            <span className="text-[11px] text-[#718078] font-medium">CO₂e Avoided</span>
          </div>
        </div>
      </div>

      {/* Requests Management Modal */}
      {requestsModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#123C2D]/10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#123C2D]/8">
              <div>
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3 py-0.5 rounded-full border border-[#16865B]/20">
                  Manage Requests
                </span>
                <h3 className="font-heading text-lg font-bold text-[#123C2D] mt-1.5">
                  Requests for: {selectedDonation.food_name}
                </h3>
                <p className="text-xs text-[#718078] mt-1">
                  Remaining Available: <strong className="text-[#16865B] font-bold">{selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity} {selectedDonation.quantity_unit}</strong> (Total Listed: {selectedDonation.quantity} {selectedDonation.quantity_unit})
                </p>
              </div>
              <button
                onClick={() => setRequestsModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-10 space-y-3 text-[#718078]">
                <p className="text-sm font-heading font-medium">No requests have been submitted yet.</p>
                <p className="text-xs max-w-sm mx-auto">
                  Matched receiver shelters will appear here when they submit allocation requests.
                </p>
                <div className="pt-2">
                  <Link
                    to={`/matching?donationId=${selectedDonation.id}`}
                    className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#123C2D] bg-[#E8F5ED] hover:bg-[#d5ece0] px-4 py-2 rounded-full transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                    <span>View AI Matching Candidate Receivers</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl border border-[#123C2D]/8 bg-[#F8FAF7] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-[#123C2D] text-sm sm:text-base">
                          {r.receiver?.receiver_profile?.organization_name || r.receiver?.full_name}
                        </h4>
                        <p className="text-xs text-[#718078]">
                          {r.receiver?.receiver_profile?.organization_type || 'Shelter'} • {r.receiver?.location_name || 'Manipal'} • {r.receiver?.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-heading font-bold text-[#123C2D] bg-[#E8F5ED] px-3 py-1 rounded-full border border-[#16865B]/20">
                          Requested: {r.requested_quantity} {selectedDonation.quantity_unit}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>

                    {r.message && (
                      <p className="text-xs text-[#202B25] bg-white p-3 rounded-xl border border-[#123C2D]/6 italic">
                        "{r.message}"
                      </p>
                    )}

                    {r.approved_quantity && (
                      <div className="text-[11px] font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-3 py-1.5 rounded-xl border border-[#16865B]/20 inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B]" />
                        <span>Allocated: {r.approved_quantity} {selectedDonation.quantity_unit}</span>
                      </div>
                    )}

                    {/* Sequential Lifecycle Progression Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#123C2D]/6">
                      {r.status === 'Requested' ? (
                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#123C2D]/8">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-heading font-bold text-[#123C2D]">
                              Quantity to Allocate ({selectedDonation.quantity_unit}):
                            </label>
                            <input
                              type="number"
                              step="1"
                              min="1"
                              max={selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity}
                              value={allocationInputs[r.id] ?? Math.min(r.requested_quantity, selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity)}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setAllocationInputs((prev) => ({ ...prev, [r.id]: isNaN(val) ? 1 : val }));
                              }}
                              className="w-20 px-2.5 py-1.5 rounded-lg border border-[#123C2D]/20 text-xs font-mono font-bold text-[#123C2D] bg-[#F8FAF7]"
                            />
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleUpdateStatus(r.id, 'Rejected', 'Donor declined request.')}
                              className="px-3.5 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-heading font-bold transition cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading || ((selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity) <= 0)}
                              onClick={() => {
                                const maxAvail = selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity;
                                const qty = allocationInputs[r.id] ?? Math.min(r.requested_quantity, maxAvail);
                                handleUpdateStatus(r.id, 'Accepted', `Donor accepted and allocated ${qty} ${selectedDonation.quantity_unit}.`, qty);
                              }}
                              className="px-4 py-1.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-xs transition cursor-pointer disabled:opacity-40"
                            >
                              Approve & Allocate ({allocationInputs[r.id] ?? Math.min(r.requested_quantity, selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity)})
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {r.status === 'Accepted' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(r.id, 'Ready for Pickup', 'Food packaged and verified ready at pickup counter.')}
                          className="px-5 py-2 rounded-full bg-teal-800 hover:bg-teal-900 text-white text-xs font-heading font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Mark Ready for Pickup</span>
                        </button>
                      )}

                      {r.status === 'Ready for Pickup' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(r.id, 'Collected', 'Food handed over to receiver volunteer van.')}
                          className="px-5 py-2 rounded-full bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-heading font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Mark Collected</span>
                        </button>
                      )}

                      {r.status === 'Collected' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(r.id, 'Completed', 'Redistribution fully verified and recorded.')}
                          className="px-5 py-2 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {r.status === 'Completed' && (
                        <span className="text-xs font-heading font-bold text-[#16865B] flex items-center gap-1.5 bg-[#E8F5ED] px-3.5 py-1.5 rounded-full border border-[#16865B]/20">
                          <CheckCircle2 className="w-4 h-4 text-[#16865B]" />
                          <span>Delivered & Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Food Donation?"
        message={`Are you sure you want to delete '${donationToDelete?.food_name}'? This will remove the listing and cancel any pending requests.`}
        confirmText="Delete Listing"
        confirmVariant="rose"
        isLoading={actionLoading}
        onConfirm={handleDeleteDonation}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDonationToDelete(null);
        }}
      />

      {/* Account Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAccountModalOpen}
        title="Permanently Delete Your Account?"
        message="Are you sure you want to delete your donor account? All your surplus listings, allocation history, and organization profile will be permanently deleted."
        confirmText="Yes, Permanently Delete My Account"
        cancelText="Cancel"
        confirmVariant="rose"
        isLoading={actionLoading}
        onConfirm={handleDeleteMyAccount}
        onCancel={() => setDeleteAccountModalOpen(false)}
      />
    </div>
  );
};
