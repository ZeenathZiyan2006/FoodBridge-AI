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
  CheckCircle2,
  X,
  AlertCircle,
  Navigation,
  ExternalLink,
  Store,
  Leaf,
  Bell,
  Droplets
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { LifecycleTracker } from '../components/LifecycleTracker';
import { SafetyBanner } from '../components/SafetyBanner';
import { parseUtcDate, isDonationExpired, getRemainingHours, formatRemainingTime } from '../utils/dateUtils';

export const DonationDetailPage = () => {
  const { id } = useParams();
  const { user, showToast } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Request modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestQty, setRequestQty] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [broadcastingAlert, setBroadcastingAlert] = useState(false);
  const [, setTick] = useState(0);

  const loadDonation = async () => {
    setLoading(true);
    try {
      const data = await api.getDonation(id);
      setDonation(data);
      const availableRemaining = (data.remaining_quantity !== null && data.remaining_quantity !== undefined)
        ? data.remaining_quantity
        : data.quantity;
      const initialIntQty = Math.max(1, Math.floor(availableRemaining));
      setRequestQty(initialIntQty.toString());
      setRequestMsg(`Requesting ${initialIntQty} ${data.quantity_unit} for community shelter distribution.`);
    } catch (err) {
      setError(err.message || 'Donation not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonation();
  }, [id]);

  // Automatically transition UI to Expired if the viewed food item reaches its deadline
  useEffect(() => {
    if (!donation || ['Completed', 'Collected', 'Cancelled', 'Expired'].includes(donation.status)) {
      return;
    }
    const checkExpiry = async () => {
      if (isDonationExpired(donation)) {
        setRequestModalOpen(false);
        showToast('This food listing has expired and is no longer available for collection.', 'info');
        await loadDonation();
      } else {
        setTick((t) => (t + 1) % 1000000);
      }
    };
    const interval = setInterval(checkExpiry, 5000);
    return () => clearInterval(interval);
  }, [donation]);

  const handleBroadcastAlert = async () => {
    setBroadcastingAlert(true);
    try {
      const res = await api.notifyUrgentDonation(donation.id);
      showToast(res.message || 'Urgent proximity alert sent to nearby verified receivers!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to dispatch alert', 'error');
    } finally {
      setBroadcastingAlert(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    const qty = parseInt(requestQty, 10);
    if (!qty || qty <= 0 || isNaN(qty)) {
      showToast('Quantity must be an integer greater than zero.', 'error');
      return;
    }

    const availableRemaining = (donation.remaining_quantity !== null && donation.remaining_quantity !== undefined)
      ? donation.remaining_quantity
      : donation.quantity;

    if (qty > availableRemaining) {
      showToast(`Cannot request more than the remaining available quantity (${availableRemaining} ${donation.quantity_unit}).`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (!user) {
        showToast('Please sign in with a Food Receiver account to request this food.', 'error');
        navigate('/login');
        return;
      }

      if (user.role !== 'receiver') {
        showToast('Access Restricted: Food Donors cannot request food. Please sign in with an authorized Receiver account.', 'error');
        return;
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
      <div className="max-w-4xl mx-auto py-24 text-center text-[#718078] text-sm space-y-3">
        <div className="inline-block w-8 h-8 border-3 border-[#16865B] border-t-transparent rounded-full animate-spin" />
        <p>Loading donation specifications...</p>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="font-heading text-lg font-bold text-[#123C2D]">{error || 'Donation Not Found'}</p>
        <Link to="/available-food" className="inline-block px-6 py-2.5 rounded-full bg-[#123C2D] text-white font-heading font-bold text-xs">
          Return to Food Listings
        </Link>
      </div>
    );
  }

  const isExpired = isDonationExpired(donation);
  const remainingHours = getRemainingHours(donation);
  const remainingQty = (donation.remaining_quantity !== null && donation.remaining_quantity !== undefined)
    ? donation.remaining_quantity
    : donation.quantity;

  // Travel Time ETA calculation
  const donorLat = donation.latitude || 13.3525;
  const donorLon = donation.longitude || 74.7928;
  const userLat = user?.latitude || 13.3450;
  const userLon = user?.longitude || 74.7880;

  const R = 6371; // km
  const dLat = ((donorLat - userLat) * Math.PI) / 180;
  const dLon = ((donorLon - userLon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((donorLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.max(0.8, Math.round(R * c * 10) / 10);
  const travelTimeMins = Math.max(6, Math.round((distanceKm / 22) * 60 + 3));

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${donorLat},${donorLon}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${donorLon - 0.007}%2C${donorLat - 0.007}%2C${donorLon + 0.007}%2C${donorLat + 0.007}&layer=mapnik&marker=${donorLat}%2C${donorLon}`;

  const donorHours = donation.donor?.donor_profile?.operating_hours || '8:30 AM - 10:30 PM (Daily)';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Back button and status header */}
      <div className="flex items-center justify-between">
        <Link
          to="/available-food"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#718078] hover:text-[#123C2D] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surplus Listings</span>
        </Link>

        <StatusBadge status={donation.status} urgencyLevel={donation.urgency_level} />
      </div>

      <SafetyBanner />

      {/* Main Details Split Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#123C2D]/10 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.06)] grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image & Quick Specs */}
        <div className="relative h-72 md:h-full bg-[#E8F5ED]/30 min-h-[340px]">
          <img
            src={donation.image_url}
            alt={donation.food_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20">
                {donation.category}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#16865B] text-white backdrop-blur-md">
                {donation.dietary_type}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold drop-shadow-xs leading-tight">
              {donation.food_name}
            </h1>
            <p className="font-heading text-lg font-bold text-[#E9A23B]">
              {remainingQty} {donation.quantity_unit} Available {donation.remaining_quantity !== null && donation.remaining_quantity < donation.quantity && `(${donation.quantity} Total Listed)`}
            </p>
          </div>
        </div>

        {/* Right: Technical Details & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-heading font-extrabold text-[#123C2D] uppercase tracking-wider bg-[#E8F5ED] px-3 py-0.5 rounded-full border border-[#16865B]/20">
                Food Specifications
              </span>
              <p className="text-xs text-[#718078] mt-2 leading-relaxed">
                {donation.description || "Prepared with fresh, high-quality ingredients and packaged for direct food shelter distribution."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs border-y border-[#123C2D]/8 py-4">
              <div>
                <span className="text-[#718078] block text-[10px] uppercase font-heading font-bold tracking-wider">Dietary Type</span>
                <span className="font-heading font-bold text-[#202B25]">{donation.dietary_type}</span>
              </div>
              <div>
                <span className="text-[#718078] block text-[10px] uppercase font-heading font-bold tracking-wider">Storage Condition</span>
                <span className="font-heading font-bold text-[#202B25]">{donation.storage_condition}</span>
              </div>
              <div>
                <span className="text-[#718078] block text-[10px] uppercase font-heading font-bold tracking-wider">Preparation Time</span>
                <span className="font-medium text-[#202B25]">
                  {parseUtcDate(donation.prep_time)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div>
                <span className="text-[#718078] block text-[10px] uppercase font-heading font-bold tracking-wider">Consumption Deadline</span>
                <span className={`font-heading font-bold ${remainingHours <= 3 ? 'text-[#9A6217]' : 'text-[#202B25]'}`}>
                  {formatRemainingTime(donation)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#718078] block text-[10px] uppercase font-heading font-bold tracking-wider">Allergens</span>
                <span className="font-medium text-[#202B25]">{donation.allergen_info || 'None reported'}</span>
              </div>
            </div>

            {/* Logistics & Donor Hours Info */}
            <div className="space-y-2.5 text-xs text-[#718078] bg-[#F8FAF7] p-4 rounded-2xl border border-[#123C2D]/8">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#16865B] shrink-0 mt-0.5" />
                <span>Pickup Location: <strong className="text-[#202B25]">{donation.pickup_location}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Store className="w-3.5 h-3.5 text-[#16865B] shrink-0 mt-0.5" />
                <span>Donor Operating Hours: <strong className="text-[#123C2D]">{donorHours}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#16865B] shrink-0 mt-0.5" />
                <span>Pickup Window: <strong className="text-[#202B25]">{donation.available_pickup_time || 'Contact Donor'}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#16865B] shrink-0 mt-0.5" />
                <span>Donor Contact: <strong className="text-[#202B25]">{donation.donor_contact || donation.donor?.phone || 'Available upon request'}</strong></span>
              </div>

              {/* Travel Time ETA (Visible for receivers only) */}
              {user?.role !== 'donor' && (
                <div className="mt-2 pt-2 border-t border-[#123C2D]/8 flex items-start gap-2.5 bg-[#E8F5ED]/80 p-2.5 rounded-xl">
                  <Navigation className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-heading font-extrabold text-[#123C2D] text-xs">
                      Receiver Travel Time: ~{travelTimeMins} mins ({distanceKm} km away)
                    </p>
                    <p className="text-[10px] text-[#718078]">
                      Estimated volunteer route duration from receiver depot to donor kitchen.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Urgent Proximity Notification Trigger for Donors */}
            {user?.role === 'donor' && donation.status === 'Available' && !isExpired && (
              <button
                type="button"
                onClick={handleBroadcastAlert}
                disabled={broadcastingAlert}
                className="w-full py-3 px-4 rounded-full bg-[#FEF7EC] hover:bg-[#FDF0D9] text-[#9A6217] border border-[#E9A23B]/40 font-heading font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                title="Send automated push notification to nearby verified receivers"
              >
                <Bell className="w-4 h-4 text-[#E9A23B] animate-pulse" />
                <span>{broadcastingAlert ? 'Dispatching Proximity Alert...' : 'Notify Nearby Verified Receivers'}</span>
              </button>
            )}

            <button
              onClick={() => setRequestModalOpen(true)}
              disabled={isExpired || donation.status !== 'Available' || remainingQty <= 0}
              className="w-full py-3.5 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-[#123C2D]/15 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
            >
              <HeartHandshake className="w-4 h-4 text-[#E8F5ED]" />
              <span>
                {isExpired
                  ? 'Expired (Cannot Request)'
                  : remainingQty <= 0
                  ? 'Fully Allocated'
                  : donation.status === 'Available'
                  ? 'Request Surplus Food Allocation'
                  : `Currently ${donation.status}`}
              </span>
            </button>

            {!isExpired && (
              <Link
                to={`/matching?donationId=${donation.id}`}
                className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#F8FAF7] text-[#123C2D] font-heading font-bold text-xs border border-[#123C2D]/15 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                <span>Run AI Matching For This Batch</span>
              </Link>
            )}

            {/* Display Positive Impact Created by This Donation */}
            <div className="p-4 bg-gradient-to-br from-[#E8F5ED] to-white rounded-2xl border border-[#16865B]/20 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#123C2D] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#16865B]" />
                  <span>Positive Environmental & Social Impact</span>
                </span>
                <span className="text-[10px] font-bold text-[#16865B] bg-white px-2 py-0.5 rounded-full border border-[#16865B]/20 font-mono">
                  UN SDG 12.3
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white/80 p-2 rounded-xl border border-[#16865B]/10">
                  <span className="text-[9px] font-mono text-[#718078] block">Meals Saved</span>
                  <span className="font-heading font-extrabold text-[#123C2D] text-sm">{donation.quantity}</span>
                  <span className="text-[9px] text-[#718078] block">People Fed</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#16865B]/10">
                  <span className="text-[9px] font-mono text-[#718078] block">CO₂e Averted</span>
                  <span className="font-heading font-extrabold text-[#16865B] text-sm">{Math.round(donation.quantity * 2.5)} kg</span>
                  <span className="text-[9px] text-[#718078] block">GHG Emissions</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#16865B]/10">
                  <span className="text-[9px] font-mono text-[#718078] block">Water Saved</span>
                  <span className="font-heading font-extrabold text-[#123C2D] text-sm">{Math.round(donation.quantity * 350)} L</span>
                  <span className="text-[9px] text-[#718078] block">Freshwater</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Donor Location Map & Google Directions (Shown strictly to Receivers, not Donors) */}
      {user?.role !== 'donor' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/10 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#123C2D]/8">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16865B]" />
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#123C2D]">
                  Donor Pickup Location & Navigation Map
                </h3>
              </div>
              <p className="text-xs text-[#718078] mt-0.5">
                {donation.pickup_location} • GPS Coordinates: {donorLat.toFixed(4)}, {donorLon.toFixed(4)}
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 hover:shadow-lg transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#E8F5ED]" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
          </div>

          {/* Embedded OpenStreetMap */}
          <div className="rounded-2xl overflow-hidden border border-[#123C2D]/12 h-64 sm:h-72 w-full relative shadow-inner">
            <iframe
              title="Donor Pickup Map"
              src={osmEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Visual Lifecycle Progress Tracker & History */}
      <LifecycleTracker
        currentStatus={donation.status}
        statusHistory={donation.status_history}
      />

      {/* Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#123C2D]/10 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#123C2D]/8">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full border border-[#16865B]/20">
                  Receiver Allocation
                </span>
                <h3 className="font-heading text-lg font-bold text-[#123C2D] mt-1">
                  Request {donation.food_name}
                </h3>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider">
                    Quantity ({donation.quantity_unit}) * (Whole Integer)
                  </label>
                  <span className="text-[11px] text-[#16865B] font-mono font-bold">
                    Available: {remainingQty} {donation.quantity_unit}
                  </span>
                </div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={remainingQty}
                  required
                  value={requestQty}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setRequestQty(val);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Message / Pickup Van ETA
                </label>
                <textarea
                  rows="3"
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  placeholder="e.g. Community van will arrive by 3:30 PM..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-[#718078] text-xs font-heading font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 transition disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {submitting ? 'Submitting...' : 'Confirm Food Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
