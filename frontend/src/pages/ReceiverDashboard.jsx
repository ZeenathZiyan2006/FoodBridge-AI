import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FoodCard } from '../components/FoodCard';
import { StatusBadge } from '../components/StatusBadge';
import { SafetyBanner } from '../components/SafetyBanner';

export const ReceiverDashboard = () => {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'personalized', 'my-requests'
  const [donations, setDonations] = useState([]);
  const [personalizedFeed, setPersonalizedFeed] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'urgency', 'quantity'

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
          urgency: urgencyFilter,
        }),
        api.getMyRequests().catch(() => []),
        api.getReceiverFeed().catch(() => []),
      ]);

      setDonations(allDonations);
      setMyRequests(myReqs);
      setPersonalizedFeed(feed);
    } catch (err) {
      showToast(err.message || 'Failed to load food listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, dietaryFilter, locationFilter, urgencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenRequestModal = (donation) => {
    setSelectedDonation(donation);
    setRequestQuantity(donation.quantity.toString());
    setRequestMessage(`Requesting ${donation.quantity} ${donation.quantity_unit} for our community beneficiaries.`);
    setRequestError('');
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestError('');

    const qty = parseFloat(requestQuantity);
    if (!qty || qty <= 0) {
      setRequestError('Requested quantity must be greater than zero.');
      return;
    }
    if (qty > selectedDonation.quantity) {
      setRequestError(`Cannot request more than the available quantity (${selectedDonation.quantity} ${selectedDonation.quantity_unit}).`);
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

  const sortedDonations = [...donations].sort((a, b) => {
    if (sortBy === 'urgency') {
      return (a.hours_left || 99) - (b.hours_left || 99);
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#14532D] border border-[#16A34A]/20">
              Receiver Organization Portal
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {user?.receiver_profile?.organization_type || 'NGO'} • Capacity: {user?.receiver_profile?.required_capacity_meals || 40} Meals
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
            {user?.receiver_profile?.organization_name || user?.full_name || 'Receiver Shelter'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse available food donations, check AI recommendations, and track active food collections.
          </p>
        </div>

        <Link
          to="/matching"
          className="px-5 py-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] font-bold text-xs border border-[#F59E0B]/30 shadow-2xs transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>AI Matching Engine</span>
        </Link>
      </div>

      <SafetyBanner />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Browse All Donations ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('personalized')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'personalized'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>AI High Matches ({personalizedFeed.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-requests')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'my-requests'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>My Active Requests ({myRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: BROWSE ALL DONATIONS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search food by name, donor, category or location..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold transition cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
                >
                  <option value="All">All Categories</option>
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Rice and Grains">Rice and Grains</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Bakery Items">Bakery Items</option>
                  <option value="Packaged Food">Packaged Food</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Dietary
                </label>
                <select
                  value={dietaryFilter}
                  onChange={(e) => setDietaryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
                >
                  <option value="All">All Dietary</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
                >
                  <option value="All">All Areas</option>
                  <option value="Manipal">Manipal</option>
                  <option value="Udupi">Udupi</option>
                  <option value="Santhekatte">Santhekatte</option>
                  <option value="Malpe">Malpe</option>
                  <option value="Brahmavar">Brahmavar</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Urgency
                </label>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
                >
                  <option value="All">All Urgency</option>
                  <option value="Urgent">Critical & Urgent (&lt; 5 hrs)</option>
                  <option value="Normal">Normal (&gt; 5 hrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="urgency">Most Urgent Deadline</option>
                  <option value="quantity">Largest Quantity</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading surplus food listings...</div>
          ) : sortedDonations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-gray-200/80">
              <p className="font-heading text-base font-bold text-gray-700">No Food Matching Your Filters</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your category, location or dietary filters to view more available donations.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('All');
                  setDietaryFilter('All');
                  setLocationFilter('All');
                  setUrgencyFilter('All');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedDonations.map((d) => (
                <FoodCard
                  key={d.id}
                  donation={d}
                  receiverView={true}
                  onRequest={handleOpenRequestModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI PERSONALIZED FEED */}
      {activeTab === 'personalized' && (
        <div className="space-y-6">
          <div className="bg-[#14532D] rounded-2xl p-6 sm:p-8 text-white space-y-2 border border-[#14532D]">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Multi-Factor Recommendation Feed</span>
            </span>
            <h2 className="font-heading text-2xl font-bold">Food Opportunities Tailored For You</h2>
            <p className="text-xs text-[#ECFDF5]/80 max-w-2xl leading-relaxed">
              Ranked specifically for your organization based on proximity ({user?.location_name || 'Manipal'}), capacity ({user?.receiver_profile?.required_capacity_meals || 40} meals), urgency, and dietary compatibility.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Computing AI match scores...</div>
          ) : personalizedFeed.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500 text-sm border border-gray-200/80">
              No active surplus food currently matches your profile preferences.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {personalizedFeed.map((item) => (
                <div key={item.donation.id} className="relative">
                  <FoodCard
                    donation={item.donation}
                    receiverView={true}
                    matchScore={item.match_score}
                    onRequest={handleOpenRequestModal}
                  />
                  <div className="bg-[#ECFDF5] border border-[#16A34A]/20 rounded-b-2xl -mt-2 p-3 text-[11px] text-[#14532D] shadow-2xs">
                    <strong>AI Reason:</strong> {item.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY ACTIVE REQUESTS */}
      {activeTab === 'my-requests' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-gray-900">My Food Requests & Pickup Status</h2>
            <p className="text-xs text-gray-500">Track the lifecycle of your food requests from submission to collection.</p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading your requests...</div>
          ) : myRequests.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="font-heading text-sm font-bold text-gray-700">No Food Requests Submitted</p>
              <p className="text-xs text-gray-500">Browse available food listings and submit requests to receive surplus food.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold cursor-pointer"
              >
                Browse Available Food
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Food Item</th>
                    <th className="py-3 px-4">Requested Qty</th>
                    <th className="py-3 px-4">Pickup Location</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {myRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <Link to={`/donation/${r.donation_id}`} className="hover:text-[#14532D]">
                          {r.donation?.food_name || `Donation #${r.donation_id}`}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#14532D] font-mono">
                        {r.requested_quantity} {r.donation?.quantity_unit || 'Meals'}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        {r.donation?.pickup_location || 'Contact Donor'}
                      </td>

                      <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/donation/${r.donation_id}`}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#ECFDF5] text-[#14532D] font-bold text-[11px] transition"
                        >
                          View Tracker
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Request Modal */}
      {requestModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20">
                  Submit Food Request
                </span>
                <h3 className="font-heading text-base font-bold text-gray-900 mt-1">
                  {selectedDonation.food_name}
                </h3>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl mb-4 text-xs space-y-1 text-gray-600">
              <p><strong>Available:</strong> {selectedDonation.quantity} {selectedDonation.quantity_unit}</p>
              <p><strong>Location:</strong> {selectedDonation.pickup_location}</p>
              <p><strong>Deadline:</strong> {new Date(selectedDonation.consumption_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {requestError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{requestError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Requested Quantity ({selectedDonation.quantity_unit}) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max={selectedDonation.quantity}
                  required
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message for Donor (Vehicle ETA / Beneficiary Details)
                </label>
                <textarea
                  rows="3"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="e.g. We have 35 children in our care shelter. Our volunteer van can collect at 4:30 PM."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-5 py-2 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold shadow-2xs transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingRequest ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
