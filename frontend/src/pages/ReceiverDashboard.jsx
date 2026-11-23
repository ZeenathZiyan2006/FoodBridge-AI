import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  HeartHandshake,
  Clock,
  MapPin,
  X,
  Package,
  Layers,
  ArrowRight,
  AlertCircle,
  Truck,
  CheckCircle2,
  Utensils,
  ChefHat,
  Filter,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FoodCard } from '../components/FoodCard';
import { StatusBadge } from '../components/StatusBadge';
import { SafetyBanner } from '../components/SafetyBanner';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ReceiverDashboard = () => {
  const { user, deleteAccount, showToast } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personalized'); // 'personalized', 'browse', 'my-requests'
  const [donations, setDonations] = useState([]);
  const [personalizedFeed, setPersonalizedFeed] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Filters for browse tab
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Request Food Modal
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [allDonations, myReqs, feed] = await Promise.all([
        api.getDonations({
          category: categoryFilter,
          dietary_type: dietaryFilter,
          location: locationFilter,
          search: searchTerm,
          status: 'Available',
          only_available: true,
        }).catch(() => []),
        api.getMyRequests().catch(() => []),
        api.getReceiverFeed().catch(() => []),
      ]);

      // Filter out any expired or fully claimed food listings
      const freshAvailable = (allDonations || []).filter(
        (d) => d.status === 'Available' && d.hours_left > 0 && ((d.remaining_quantity !== null && d.remaining_quantity !== undefined ? d.remaining_quantity : d.quantity) > 0)
      );
      setDonations(freshAvailable);
      setMyRequests(myReqs || []);

      const activeFeed = (feed || []).filter(
        (f) => f.donation && f.donation.status === 'Available' && f.donation.hours_left > 0 && ((f.donation.remaining_quantity !== null && f.donation.remaining_quantity !== undefined ? f.donation.remaining_quantity : f.donation.quantity) > 0)
      );
      setPersonalizedFeed(activeFeed);
    } catch (err) {
      showToast(err.message || 'Failed to load food listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, dietaryFilter, locationFilter]);

  const handleOpenRequestModal = (donation) => {
    setSelectedDonation(donation);
    const avail = donation.remaining_quantity !== null && donation.remaining_quantity !== undefined ? donation.remaining_quantity : donation.quantity;
    const initialInt = Math.max(1, Math.floor(avail));
    setRequestQuantity(initialInt.toString());
    setRequestMessage(`Requesting ${initialInt} ${donation.quantity_unit} for our community beneficiaries.`);
    setRequestError('');
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestError('');

    const qty = parseInt(requestQuantity, 10);
    if (!qty || qty <= 0 || isNaN(qty)) {
      setRequestError('Requested quantity must be a whole positive integer.');
      return;
    }
    const avail = selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity;
    if (qty > avail) {
      setRequestError(`Cannot request more than the remaining available quantity (${avail} ${selectedDonation.quantity_unit}).`);
      return;
    }

    setSubmittingRequest(true);
    try {
      await api.createRequest({
        donation_id: selectedDonation.id,
        requested_quantity: qty,
        message: requestMessage,
      });

      showToast(`Food request for '${selectedDonation.food_name}' submitted successfully!`, 'success');
      setRequestModalOpen(false);
      setSelectedDonation(null);
      loadData();
    } catch (err) {
      setRequestError(err.message || 'Failed to submit food request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDeleteMyAccount = async () => {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      // Handled in auth context
    } finally {
      setDeletingAccount(false);
    }
  };

  // Metrics
  const pendingRequestsCount = myRequests.filter((r) => r.status === 'Requested').length;
  const acceptedPickupsCount = myRequests.filter((r) => ['Accepted', 'Ready for Pickup'].includes(r.status)).length;
  const completedPickupsCount = myRequests.filter((r) => ['Collected', 'Completed'].includes(r.status)).length;
  const totalMealsReceived = myRequests
    .filter((r) => ['Collected', 'Completed'].includes(r.status))
    .reduce((sum, r) => sum + (r.requested_quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in font-sans">
      {/* 1. TOP WELCOME & PORTAL BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-heading font-extrabold uppercase tracking-wider bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20">
              Receiver Organization Portal
            </span>
            <span className="text-xs text-[#718078] font-medium">
              {user?.receiver_profile?.organization_type || 'Shelter'} • Capacity: {user?.receiver_profile?.required_capacity_meals || 40} Meals
            </span>
            {user?.receiver_profile?.organization_id && (
              <span className="text-[11px] font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full border border-[#16865B]/30 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#16865B]" /> Org ID: {user.receiver_profile.organization_id}
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D]">
            {user?.receiver_profile?.organization_name || user?.full_name || 'Receiver Shelter'}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-1 max-w-xl">
            Review personalized AI recommendations, submit allocation requests for surplus meals, and coordinate volunteer pickups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/matching"
            className="px-6 py-3 rounded-full bg-[#FEF7EC] hover:bg-[#FDF0D9] text-[#9A6217] font-heading font-bold text-xs sm:text-sm border border-[#E9A23B]/35 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#E9A23B]" />
            <span>AI Matching Simulator</span>
          </Link>

          <button
            type="button"
            onClick={() => setDeleteAccountModalOpen(true)}
            className="px-4 py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-heading font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Permanently delete your account"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      <SafetyBanner />

      {/* 2. RECEIVER SUMMARY KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">AI High Matches</span>
            <Sparkles className="w-5 h-5 text-[#E9A23B]" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#123C2D] tracking-tight">{personalizedFeed.length}</p>
          <p className="text-[11px] text-[#16865B] font-medium mt-1">Recommended for your shelter</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Pending Requests</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-blue-700 tracking-tight">{pendingRequestsCount}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Awaiting donor approval</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Ready for Pickup</span>
            <Truck className="w-5 h-5 text-teal-700" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-teal-800 tracking-tight">{acceptedPickupsCount}</p>
          <p className="text-[11px] text-teal-700 font-medium mt-1">Ready at depot/canteen</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#718078] mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#718078]">Total Received</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-purple-700 tracking-tight">{totalMealsReceived}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Meals served to beneficiaries</p>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-[#123C2D]/8 pb-2">
        <button
          onClick={() => setActiveTab('personalized')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'personalized'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#E9A23B]" />
          <span>AI Recommendations ({personalizedFeed.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('browse')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Available Food ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-requests')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'my-requests'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Request History ({myRequests.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}
      {loading ? (
        <div className="py-24 text-center text-[#718078] text-sm">
          <div className="inline-block w-8 h-8 border-3 border-[#16865B] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading receiver portal feeds...</p>
        </div>
      ) : activeTab === 'personalized' ? (
        /* TAB 1: AI RECOMMENDED FOOD */
        <div className="space-y-6">
          <div className="bg-[#E8F5ED] p-5 rounded-3xl border border-[#16865B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#123C2D]">
                Ranked Specifically for Your Organization
              </h3>
              <p className="text-xs text-[#718078] mt-0.5">
                Evaluated against your location, dietary preferences ({user?.receiver_profile?.dietary_preference || 'Both'}), and capacity.
              </p>
            </div>
            <span className="text-[11px] font-heading font-extrabold text-[#16865B] bg-white px-3 py-1 rounded-full border border-[#16865B]/20">
              {personalizedFeed.length} AI Ranked Matches
            </span>
          </div>

          {personalizedFeed.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-[#123C2D]/8">
              <p className="font-heading text-base font-bold text-[#123C2D]">No Direct Recommendations Currently</p>
              <p className="text-xs text-[#718078] max-w-sm mx-auto">
                Check the "All Available Food" tab to browse all surplus listings in the regional area.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 rounded-full bg-[#123C2D] text-white font-heading font-bold text-xs"
              >
                Browse All Surplus Food
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {personalizedFeed.map((item) => (
                <FoodCard
                  key={item.donation.id}
                  donation={item.donation}
                  receiverView={true}
                  matchScore={item.match_score}
                  onRequest={handleOpenRequestModal}
                />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'browse' ? (
        /* TAB 2: BROWSE ALL AVAILABLE FOOD */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donations.map((d) => (
              <FoodCard
                key={d.id}
                donation={d}
                receiverView={true}
                onRequest={handleOpenRequestModal}
              />
            ))}
          </div>
        </div>
      ) : (
        /* TAB 3: REQUEST HISTORY */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-6">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-[#123C2D]">Food Request Tracking</h2>
            <p className="text-xs text-[#718078]">Track approved allocations, van dispatch schedules, and pickup completions.</p>
          </div>

          {myRequests.length === 0 ? (
            <div className="py-12 text-center text-[#718078] text-xs">
              You haven't requested any food yet. Browse available donations and click "Request" to start.
            </div>
          ) : (
            <div className="divide-y divide-[#123C2D]/6">
              {myRequests.map((req) => (
                <div key={req.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-bold text-[#123C2D]">
                        {req.donation?.food_name || `Donation #${req.donation_id}`}
                      </span>
                      <StatusBadge status={req.status} />
                    </div>

                    <p className="text-xs text-[#718078]">
                      Requested Quantity: <strong className="text-[#202B25]">{req.requested_quantity} {req.donation?.quantity_unit || 'Meals'}</strong> • Pickup: {req.donation?.pickup_location}
                    </p>

                    {req.message && (
                      <p className="text-xs text-[#202B25] italic pt-1">
                        "{req.message}"
                      </p>
                    )}

                    <p className="text-[11px] text-[#718078] font-mono">
                      Submitted on: {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/donation/${req.donation_id}`}
                      className="px-4 py-2 rounded-full bg-[#F8FAF7] hover:bg-[#E8F5ED] text-[#123C2D] font-heading font-bold text-xs border border-[#123C2D]/10 transition-all"
                    >
                      View Batch Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Request Food Modal */}
      {requestModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#123C2D]/10 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#123C2D]/8">
              <div>
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3 py-0.5 rounded-full border border-[#16865B]/20">
                  Receiver Allocation Request
                </span>
                <h3 className="font-heading text-lg font-bold text-[#123C2D] mt-1.5">
                  Request {selectedDonation.food_name}
                </h3>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{requestError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider">
                    Quantity Required ({selectedDonation.quantity_unit}) * (Integer)
                  </label>
                  <span className="text-[11px] text-[#16865B] font-mono font-bold">
                    Available: {selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity} {selectedDonation.quantity_unit}
                  </span>
                </div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={selectedDonation.remaining_quantity !== null && selectedDonation.remaining_quantity !== undefined ? selectedDonation.remaining_quantity : selectedDonation.quantity}
                  required
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Pickup Van Schedule / Note to Donor
                </label>
                <textarea
                  rows="3"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="e.g. Volunteer van scheduled for pickup at 3:15 PM..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-[#718078] hover:bg-gray-100 text-xs font-heading font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-6 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingRequest ? 'Submitting...' : 'Confirm Food Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAccountModalOpen}
        title="Permanently Delete Your Account?"
        message="Are you sure you want to delete your receiver shelter account? All your active allocation requests and organization profile will be permanently deleted."
        confirmText="Yes, Permanently Delete My Account"
        cancelText="Cancel"
        confirmVariant="rose"
        isLoading={deletingAccount}
        onConfirm={handleDeleteMyAccount}
        onCancel={() => setDeleteAccountModalOpen(false)}
      />
    </div>
  );
};
