import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Sparkles,
  ChefHat,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Package,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LifecycleTracker } from '../components/LifecycleTracker';
import { SafetyBanner } from '../components/SafetyBanner';

export const DonationDetailPage = () => {
  const { id } = useParams();
  const { user, showToast, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Request modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestQty, setRequestQty] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDonation = async () => {
    setLoading(true);
    try {
      const data = await api.getDonation(id);
      setDonation(data);
      setRequestQty(data.quantity.toString());
      setRequestMsg(`Requesting ${data.quantity} ${data.quantity_unit} for community distribution.`);
    } catch (err) {
      setError(err.message || 'Donation not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonation();
  }, [id]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    const qty = parseFloat(requestQty);
    if (!qty || qty <= 0) {
      showToast('Quantity must be greater than zero.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // If user is not logged in or is currently a donor, automatically switch to receiver demo
      if (!user || user.role === 'donor') {
        await quickLogin('receiver');
        showToast("Switched to Receiver account (Hope Children's Orphanage) to submit request.", "info");
      }

      await api.createRequest({
        donation_id: donation.id,
        requested_quantity: qty,
        message: requestMsg,
      });
      showToast('Food request submitted to donor successfully!', 'success');
      setRequestModalOpen(false);
      loadDonation();
    } catch (err) {
      showToast(err.message || 'Failed to submit food request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center text-gray-400 text-sm">
        Loading donation specifications...
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="font-heading text-base font-bold text-gray-800">{error || 'Donation Not Found'}</p>
        <Link to="/available-food" className="inline-block px-4 py-2 rounded-xl bg-[#14532D] text-white font-bold text-xs">
          Return to Food Listings
        </Link>
      </div>
    );
  }

  const isExpired = donation.status === 'Expired' || donation.hours_left <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/available-food"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#14532D] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surplus Listings</span>
        </Link>

        <StatusBadge status={donation.status} urgencyLevel={donation.urgency_level} />
      </div>

      <SafetyBanner />

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl overflow-hidden border border-emerald-950/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image & Quick Specs */}
        <div className="relative h-72 md:h-full bg-gray-100 min-h-[320px]">
          <img
            src={donation.image_url}
            alt={donation.food_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20">
                {donation.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/80 backdrop-blur-md">
                {donation.dietary_type}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold drop-shadow-xs leading-tight">
              {donation.food_name}
            </h1>
            <p className="font-heading text-lg font-bold text-[#F59E0B]">
              {donation.quantity} {donation.quantity_unit} Available
            </p>
          </div>
        </div>

        {/* Right: Technical Details & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20">
                Food Specifications
              </span>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {donation.description || "Prepared with high quality ingredients and packaged for direct food shelter distribution."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-y border-gray-100 py-3.5">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Dietary Type</span>
                <span className="font-bold text-gray-900">{donation.dietary_type}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Storage Condition</span>
                <span className="font-bold text-gray-900">{donation.storage_condition}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Preparation Time</span>
                <span className="font-semibold text-gray-800">
                  {new Date(donation.prep_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Consumption Deadline</span>
                <span className={`font-bold ${donation.hours_left <= 3 ? 'text-amber-800' : 'text-gray-900'}`}>
                  {donation.hours_left ? `${donation.hours_left} hrs remaining` : 'Expired'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Reported Allergens</span>
                <span className="font-semibold text-gray-700">{donation.allergen_info || 'None reported'}</span>
              </div>
            </div>

            {/* Logistics Info */}
            <div className="space-y-2 text-xs text-gray-600 bg-[#F8FAF7] p-3.5 rounded-2xl border border-gray-200/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
                <span>Pickup: <strong className="text-gray-800">{donation.pickup_location}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
                <span>Pickup Window: <strong className="text-gray-800">{donation.available_pickup_time || 'Contact Donor'}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
                <span>Donor Contact: <strong className="text-gray-800">{donation.donor_contact || donation.donor?.phone || 'Available upon request'}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setRequestModalOpen(true)}
              disabled={isExpired || donation.status !== 'Available'}
              className="w-full py-3.5 px-4 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white font-heading font-bold text-xs shadow-md shadow-[#14532D]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
            >
              <HeartHandshake className="w-4 h-4 text-[#ECFDF5]" />
              <span>
                {isExpired
                  ? 'Expired (Cannot Request)'
                  : donation.status === 'Available'
                  ? user?.role === 'donor'
                    ? 'Request Surplus Food (as Receiver)'
                    : 'Request Surplus Food'
                  : `Currently ${donation.status}`}
              </span>
            </button>

            <Link
              to={`/matching?donationId=${donation.id}`}
              className="w-full py-3 px-4 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] font-heading font-bold text-xs border border-[#F59E0B]/30 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Run AI Matching For This Batch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Lifecycle Progress Tracker & History */}
      <LifecycleTracker
        currentStatus={donation.status}
        statusHistory={donation.status_history}
      />

      {/* Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-emerald-950/10 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#14532D] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20">
                  Receiver Allocation
                </span>
                <span className="text-xs text-gray-400 font-mono">Batch #{donation.id}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mt-1">Request Food Allocation</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Submit requested quantity for <strong>{donation.food_name}</strong>.
              </p>
            </div>

            {/* Smart Role Context Banner */}
            {user?.role === 'donor' && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Signed in as Food Donor ({user.full_name})</p>
                  <p className="text-amber-800/80 leading-relaxed text-[11px]">
                    Allocation requests are reserved for verified Receivers (NGOs/Shelters). Submitting will seamlessly use our demo receiver account <strong>(Hope Children's Orphanage)</strong> so your request is accepted immediately!
                  </p>
                </div>
              </div>
            )}

            {!user && (
              <div className="p-3.5 bg-[#ECFDF5] border border-emerald-200/90 rounded-2xl flex items-start gap-3 text-xs text-[#14532D]">
                <Sparkles className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Instant 1-Click Evaluation</p>
                  <p className="text-emerald-800/80 leading-relaxed text-[11px]">
                    You will be seamlessly connected as <strong>Hope Children's Orphanage (Receiver)</strong> with zero password hassle.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider">
                    Quantity ({donation.quantity_unit}) *
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    Max: {donation.quantity} {donation.quantity_unit}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max={donation.quantity}
                  required
                  value={requestQty}
                  onChange={(e) => setRequestQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Message / Pickup Van ETA
                </label>
                <textarea
                  rows="3"
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  placeholder="e.g. Community van will arrive by 3:30 PM..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-heading font-bold shadow-md shadow-[#14532D]/20 transition disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {submitting
                    ? 'Submitting Request...'
                    : user?.role === 'donor'
                    ? '⚡ Switch & Request Food'
                    : !user
                    ? '⚡ Request as Hope Shelter'
                    : 'Confirm Food Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
