import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  TrendingUp,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Leaf,
  PlusCircle,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  Pencil,
  Save,
  Camera,
  Lock,
  Layers,
  Truck,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';
import { ConfirmationModal } from './ConfirmationModal';
import { isDonationExpired, parseUtcDate, formatRemainingTime } from '../utils/dateUtils';
import { useExpiryWatcher } from '../hooks/useExpiryWatcher';

function getInitials(name) {
  if (!name) return 'FB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRoleDisplayLabel(role) {
  if (role === 'donor') return 'FOOD DONOR';
  if (role === 'receiver') return 'FOOD RECEIVER';
  if (role === 'admin') return 'ADMINISTRATOR';
  return 'GUEST';
}

function compressImageToDataUrl(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export const DashboardSidePanel = () => {
  const { user, dashboardPanelOpen, setDashboardPanelOpen, deleteAccount, updateProfile, showToast } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [allDonorDonations, setAllDonorDonations] = useState([]);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [receiverFeed, setReceiverFeed] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'overview', 'activity', 'actions'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  const initProfileForm = (u) => {
    if (!u) return;
    setProfileForm({
      full_name: u.full_name || '',
      phone: u.phone || '',
      location_name: u.location_name || '',
      address: u.address || '',
      profile_picture: u.profile_picture || '',
      // Donor fields
      organization_type: u.donor_profile?.organization_type || u.receiver_profile?.organization_type || 'Restaurant',
      fssai_license: u.donor_profile?.fssai_license || '',
      operating_hours: u.donor_profile?.operating_hours || '9:00 AM - 10:00 PM',
      description: u.donor_profile?.description || '',
      // Receiver fields
      organization_name: u.receiver_profile?.organization_name || '',
      contact_person: u.receiver_profile?.contact_person || '',
      required_capacity_meals: u.receiver_profile?.required_capacity_meals || 40,
      dietary_preference: u.receiver_profile?.dietary_preference || 'Both',
      preferred_categories: u.receiver_profile?.preferred_categories || '',
    });
  };

  useEffect(() => {
    if (user) {
      initProfileForm(user);
    }
  }, [user]);

  const loadPanelData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const sum = await api.getSummary().catch(() => null);
      setSummary(sum);

      if (user?.role === 'donor') {
        const myDons = await api.getMyDonations().catch(() => []);
        const list = myDons || [];
        setAllDonorDonations(list);
        setDonations(list.filter((d) => !isDonationExpired(d) && d.status !== 'Expired'));
      } else {
        const donList = await api.getDonations({ limit: 12, status: 'Available', only_available: true }).catch(() => []);
        const activeUnexpired = (donList || []).filter(
          (d) => d.status === 'Available' && !isDonationExpired(d) && ((d.remaining_quantity ?? d.quantity) > 0)
        );
        setDonations(activeUnexpired.slice(0, 6));
      }

      if (user?.role === 'receiver') {
        const [reqs, feed] = await Promise.all([
          api.getMyRequests().catch(() => []),
          api.getReceiverFeed().catch(() => []),
        ]);
        setMyRequests(reqs || []);
        setReceiverFeed((feed || []).filter((f) => f.donation && !isDonationExpired(f.donation)));
      } else if (user?.role === 'donor') {
        const myDons = await api.getMyDonations().catch(() => []);
        let allIncoming = [];
        for (const d of (myDons || []).slice(0, 6)) {
          const reqs = await api.getDonationRequests(d.id).catch(() => []);
          allIncoming = [...allIncoming, ...(reqs || [])];
        }
        setMyRequests(allIncoming);
      }
    } catch (err) {
      console.error('Error loading dashboard side panel data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardPanelOpen) {
      setIsEditingProfile(false);
      loadPanelData();
    }
  }, [dashboardPanelOpen, user?.id, user?.role]);

  useExpiryWatcher(donations, setDonations, () => {
    if (dashboardPanelOpen) loadPanelData(true);
  });

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
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/login';
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await api.updateRequestStatus(
        requestId,
        newStatus,
        `Updated to ${newStatus} from Dashboard Side Panel.`
      );
      showToast(`Request marked as '${newStatus}' successfully!`, 'success');
      loadPanelData(true);
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
    } catch {
      // Handled in auth context
    } finally {
      setDeleting(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file, 256);
      setProfileForm((prev) => ({ ...prev, profile_picture: dataUrl }));
    } catch (err) {
      showToast(err.message || 'Could not process image file', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.full_name?.trim()) {
      showToast('Full name is required.', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        full_name: profileForm.full_name.trim(),
        phone: profileForm.phone,
        location_name: profileForm.location_name,
        address: profileForm.address,
        profile_picture: profileForm.profile_picture,
      };

      if (user?.role === 'donor') {
        payload.organization_type = profileForm.organization_type;
        payload.fssai_license = profileForm.fssai_license;
        payload.operating_hours = profileForm.operating_hours;
        payload.description = profileForm.description;
      } else if (user?.role === 'receiver') {
        payload.organization_name = profileForm.organization_name;
        payload.organization_type = profileForm.organization_type;
        payload.contact_person = profileForm.contact_person;
        payload.required_capacity_meals = Number(profileForm.required_capacity_meals) || 40;
        payload.dietary_preference = profileForm.dietary_preference;
        payload.preferred_categories = profileForm.preferred_categories;
      }

      await updateProfile(payload);
      setIsEditingProfile(false);
    } catch {
      // Handled in auth context
    } finally {
      setSavingProfile(false);
    }
  };

  if (!dashboardPanelOpen) return null;

  // Computed donor / receiver personal metrics
  const donorTotalBatches = allDonorDonations.length;
  const donorActiveCount = allDonorDonations.filter((d) => d.status === 'Available' && !isDonationExpired(d)).length;
  const donorPendingCount = allDonorDonations.filter((d) => ['Requested', 'Accepted', 'Ready for Pickup'].includes(d.status) && !isDonationExpired(d)).length;
  const donorCompletedCount = allDonorDonations.filter((d) => ['Completed', 'Collected'].includes(d.status)).length;
  const donorExpiredCount = allDonorDonations.filter((d) => d.status === 'Expired' || isDonationExpired(d)).length;
  const donorMealsDelivered = allDonorDonations
    .filter((d) => ['Completed', 'Collected'].includes(d.status))
    .reduce((sum, d) => sum + (d.quantity || 0), 0);
  const donorCo2Saved = Math.round(donorMealsDelivered * 2.5);

  const recPendingCount = myRequests.filter((r) => r.status === 'Requested').length;
  const recPickupReadyCount = myRequests.filter((r) => ['Accepted', 'Ready for Pickup'].includes(r.status)).length;
  const recMealsReceived = myRequests
    .filter((r) => ['Collected', 'Completed'].includes(r.status))
    .reduce((sum, r) => sum + (r.approved_quantity || r.requested_quantity || 0), 0);

  const registrationDateStr = user?.created_at
    ? parseUtcDate(user.created_at)?.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const completeAddress = [user?.address, user?.location_name].filter(Boolean).join(', ') || 'Address not provided';

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
        {/* Subtle Backdrop keeping main dashboard visible */}
        <div
          className="fixed inset-0 bg-[#123C2D]/35 backdrop-blur-[2px] transition-opacity"
          onClick={() => setDashboardPanelOpen(false)}
        />

        {/* Enlarged Responsive Side Panel (500-600px on desktop, almost full screen height) */}
        <aside className="relative w-full sm:w-[540px] md:w-[580px] lg:w-[600px] h-full sm:h-[calc(100vh-1rem)] sm:my-2 sm:mr-2 sm:rounded-3xl bg-white/98 backdrop-blur-xl border border-emerald-950/15 shadow-2xl flex flex-col z-10 overflow-hidden">
          {/* Top Header */}
          <div className="px-6 py-4 border-b border-[#123C2D]/10 flex items-center justify-between bg-gradient-to-r from-[#E8F5ED] via-white to-[#F8FAF7] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#123C2D] text-white flex items-center justify-center shadow-sm shrink-0">
                <LayoutDashboard className="w-5 h-5 text-[#42B883]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-base text-[#123C2D] truncate">
                    {user?.role === 'donor'
                      ? 'Donor Profile & Control Panel'
                      : user?.role === 'receiver'
                      ? 'Receiver Profile & Control Panel'
                      : 'FoodBridge AI Panel'}
                  </h3>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42B883] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16865B]"></span>
                  </span>
                </div>
                <p className="text-xs text-[#718078] truncate">
                  {user ? `${user.full_name} • ${getRoleDisplayLabel(user.role)}` : 'Guest Evaluator Preview'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => loadPanelData(false)}
                title="Refresh Panel Data"
                className="p-2 rounded-xl text-[#718078] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#16865B]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDashboardPanelOpen(false);
                  navigate(getFullDashboardUrl());
                }}
                title="Open Full Dashboard Page"
                className="p-2 rounded-xl text-[#718078] hover:text-[#123C2D] hover:bg-[#E8F5ED] transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDashboardPanelOpen(false)}
                aria-label="Close panel"
                className="p-2 rounded-xl text-[#718078] hover:text-[#202B25] hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Panel Tabs */}
          <div className="flex items-center px-6 pt-2 border-b border-[#123C2D]/10 gap-5 text-xs font-heading font-bold bg-white shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              Complete Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              Metrics & Batches
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              {user?.role === 'donor' ? `Incoming Requests (${myRequests.length})` : `My Requests (${myRequests.length})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('actions')}
              className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'actions'
                  ? 'border-[#16865B] text-[#123C2D]'
                  : 'border-transparent text-[#718078] hover:text-[#202B25]'
              }`}
            >
              Quick Actions
            </button>
          </div>

          {/* Independently Scrollable Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
            {loading && !user ? (
              <div className="py-20 text-center text-xs text-[#718078]">
                <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#16865B] mb-2" />
                <span>Loading panel data...</span>
              </div>
            ) : activeTab === 'profile' ? (
              /* TAB 1: COMPLETE DONOR / RECEIVER PROFILE */
              !user ? (
                <div className="bg-[#F8FAF7] rounded-3xl p-8 border border-[#123C2D]/10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center mx-auto font-heading font-extrabold text-xl border border-[#16865B]/20">
                    FB
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-extrabold text-[#123C2D]">Guest Session Active</h4>
                    <p className="text-xs text-[#718078] mt-1 max-w-sm mx-auto">
                      Sign in with your Food Donor or Receiver Shelter account to view complete profile details, edit your information, and manage allocations.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold transition shadow-sm"
                  >
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Profile Hero Card */}
                  <div className="bg-gradient-to-br from-[#F8FAF7] via-white to-[#E8F5ED]/60 rounded-3xl p-5 border border-[#123C2D]/10 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Profile Picture / Avatar */}
                        <div className="relative shrink-0">
                          {(isEditingProfile ? profileForm.profile_picture : user.profile_picture) ? (
                            <img
                              src={isEditingProfile ? profileForm.profile_picture : user.profile_picture}
                              alt={user.full_name}
                              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#16865B]/30 shadow-sm"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#123C2D] to-[#16865B] text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-sm border-2 border-[#E8F5ED]">
                              {getInitials(user.full_name)}
                            </div>
                          )}
                          {isEditingProfile && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              title="Upload Profile Photo"
                              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#123C2D] text-white">
                              <Shield className="w-3 h-3 text-[#42B883]" />
                              <span>{getRoleDisplayLabel(user.role)}</span>
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold ${
                                user.is_active
                                  ? 'bg-[#E8F5ED] text-[#16865B] border border-[#16865B]/25'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[#16865B]' : 'bg-rose-600'}`} />
                              <span>{user.is_active ? 'Active Account' : 'Inactive'}</span>
                            </span>
                          </div>
                          <h4 className="font-heading text-lg font-extrabold text-[#123C2D] truncate">
                            {user.full_name}
                          </h4>
                          <p className="text-xs font-mono text-[#718078] truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Edit Profile Trigger */}
                      {!isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => {
                            initProfileForm(user);
                            setIsEditingProfile(true);
                          }}
                          className="self-start sm:self-center px-4 py-2 rounded-full bg-white hover:bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/30 text-xs font-heading font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#16865B]" />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>

                    {isEditingProfile ? (
                      /* EDIT PROFILE FORM */
                      <form onSubmit={handleSaveProfile} className="space-y-4 pt-3 border-t border-[#123C2D]/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D]">
                            Update Permitted Profile Details
                          </span>
                          <span className="text-[10px] text-[#718078] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Email & Role locked
                          </span>
                        </div>

                        {/* Photo Upload / URL Controls */}
                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-[11px] font-heading font-bold text-[#202B25] uppercase tracking-wider">
                              Profile Picture
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-heading font-bold text-[#16865B] hover:underline cursor-pointer"
                              >
                                Upload Photo
                              </button>
                              {profileForm.profile_picture && (
                                <button
                                  type="button"
                                  onClick={() => setProfileForm((prev) => ({ ...prev, profile_picture: '' }))}
                                  className="text-[11px] font-heading font-bold text-rose-600 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          <input
                            type="text"
                            value={profileForm.profile_picture || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, profile_picture: e.target.value }))}
                            placeholder="Paste profile image URL or click Upload Photo"
                            className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7] focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={profileForm.full_name || ''}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone || ''}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                              placeholder="+91 98450 12345"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                              City / Locality
                            </label>
                            <input
                              type="text"
                              value={profileForm.location_name || ''}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, location_name: e.target.value }))}
                              placeholder="e.g. Manipal"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                              Complete Address
                            </label>
                            <input
                              type="text"
                              value={profileForm.address || ''}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                              placeholder="Building, Street, Landmark"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                            />
                          </div>

                          {user.role === 'donor' && (
                            <>
                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Organization Type
                                </label>
                                <select
                                  value={profileForm.organization_type || 'Restaurant'}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, organization_type: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs cursor-pointer"
                                >
                                  <option value="Restaurant">Restaurant</option>
                                  <option value="College Canteen">College Canteen</option>
                                  <option value="Hotel">Hotel</option>
                                  <option value="Hostel">Hostel</option>
                                  <option value="Bakery">Bakery</option>
                                  <option value="Event Organizer">Event Organizer</option>
                                  <option value="Supermarket">Supermarket</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Operating Hours
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.operating_hours || ''}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, operating_hours: e.target.value }))}
                                  placeholder="9:00 AM - 10:00 PM"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  FSSAI License Number
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.fssai_license || ''}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, fssai_license: e.target.value }))}
                                  placeholder="e.g. FSSAI-11223344556677"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Kitchen / Organization Description
                                </label>
                                <textarea
                                  rows="2"
                                  value={profileForm.description || ''}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, description: e.target.value }))}
                                  placeholder="Brief details about your kitchen or surplus redistribution schedule..."
                                  className="w-full px-3.5 py-2 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>
                            </>
                          )}

                          {user.role === 'receiver' && (
                            <>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Organization Name
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.organization_name || ''}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, organization_name: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Organization Type
                                </label>
                                <select
                                  value={profileForm.organization_type || 'NGO'}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, organization_type: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs cursor-pointer"
                                >
                                  <option value="NGO">NGO</option>
                                  <option value="Orphanage">Orphanage</option>
                                  <option value="Shelter">Shelter</option>
                                  <option value="Community Kitchen">Community Kitchen</option>
                                  <option value="Food Bank">Food Bank</option>
                                  <option value="Old Age Home">Old Age Home</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Contact Person
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.contact_person || ''}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, contact_person: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Daily Capacity (Meals)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={profileForm.required_capacity_meals || 40}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, required_capacity_meals: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1">
                                  Dietary Preference
                                </label>
                                <select
                                  value={profileForm.dietary_preference || 'Both'}
                                  onChange={(e) => setProfileForm((prev) => ({ ...prev, dietary_preference: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/15 bg-white text-xs cursor-pointer"
                                >
                                  <option value="Both">Both (Veg & Non-Veg)</option>
                                  <option value="Vegetarian">Vegetarian</option>
                                  <option value="Vegan">Vegan</option>
                                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              initProfileForm(user);
                              setIsEditingProfile(false);
                            }}
                            className="px-4 py-2 rounded-full text-xs font-heading font-bold text-[#718078] hover:bg-gray-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={savingProfile}
                            className="px-5 py-2 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* READ-ONLY PERSONAL INFORMATION GRID */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#123C2D]/10 text-xs">
                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/8 flex items-start gap-2.5">
                          <Mail className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078]">
                              Email Address
                            </span>
                            <span className="font-mono font-semibold text-[#202B25] break-all">{user.email}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/8 flex items-start gap-2.5">
                          <Phone className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078]">
                              Mobile Number
                            </span>
                            <span className="font-mono font-semibold text-[#202B25]">
                              {user.phone || 'Not provided'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/8 flex items-start gap-2.5 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078]">
                              Complete Location / Address
                            </span>
                            <span className="font-medium text-[#202B25]">{completeAddress}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/8 flex items-start gap-2.5">
                          <Calendar className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078]">
                              Registered On
                            </span>
                            <span className="font-semibold text-[#202B25]">{registrationDateStr}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-[#123C2D]/8 flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078]">
                              Account Role & Lock
                            </span>
                            <span className="font-heading font-bold text-[#123C2D]">
                              {getRoleDisplayLabel(user.role)} (Locked)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organization / Verification Details Card */}
                  {user.role === 'donor' && (
                    <div className="bg-white rounded-3xl p-5 border border-[#123C2D]/10 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#123C2D] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#16865B]" />
                          <span>Donor Organization Details</span>
                        </h5>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20">
                          {user.donor_profile?.organization_type || 'Food Partner'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6">
                          <span className="block text-[10px] font-heading font-bold uppercase text-[#718078]">Operating Hours</span>
                          <span className="font-semibold text-[#202B25]">{user.donor_profile?.operating_hours || '9:00 AM - 10:00 PM'}</span>
                        </div>
                        <div className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6">
                          <span className="block text-[10px] font-heading font-bold uppercase text-[#718078]">FSSAI License</span>
                          <span className="font-mono font-semibold text-[#202B25]">{user.donor_profile?.fssai_license || 'Not specified'}</span>
                        </div>
                      </div>
                      {user.donor_profile?.description && (
                        <p className="text-xs text-[#718078] bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6 leading-relaxed">
                          {user.donor_profile.description}
                        </p>
                      )}
                    </div>
                  )}

                  {user.role === 'receiver' && (
                    <div className="bg-white rounded-3xl p-5 border border-[#123C2D]/10 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#123C2D] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#16865B]" />
                          <span>Receiver Organization Details</span>
                        </h5>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5ED] text-[#16865B] border border-[#16865B]/20">
                          {user.receiver_profile?.verification_status || 'Verified'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6 sm:col-span-2">
                          <span className="block text-[10px] font-heading font-bold uppercase text-[#718078]">Organization Name</span>
                          <span className="font-heading font-bold text-[#123C2D]">
                            {user.receiver_profile?.organization_name || user.full_name}
                          </span>
                        </div>
                        <div className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6">
                          <span className="block text-[10px] font-heading font-bold uppercase text-[#718078]">Org Type & Reg ID</span>
                          <span className="font-semibold text-[#202B25]">
                            {user.receiver_profile?.organization_type || 'NGO'} • {user.receiver_profile?.organization_id || 'VERIFIED'}
                          </span>
                        </div>
                        <div className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#123C2D]/6">
                          <span className="block text-[10px] font-heading font-bold uppercase text-[#718078]">Capacity & Diet</span>
                          <span className="font-semibold text-[#202B25]">
                            {user.receiver_profile?.required_capacity_meals || 40} Meals • {user.receiver_profile?.dietary_preference || 'Both'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Activity Summary Cards */}
                  {user.role === 'donor' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-white border border-[#123C2D]/10">
                        <span className="text-[10px] font-heading font-bold uppercase text-[#718078] block">Total Listed</span>
                        <span className="font-heading text-2xl font-extrabold text-[#123C2D]">{donorTotalBatches}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#E8F5ED]/60 border border-[#16865B]/20">
                        <span className="text-[10px] font-heading font-bold uppercase text-[#123C2D] block">Active</span>
                        <span className="font-heading text-2xl font-extrabold text-[#16865B]">{donorActiveCount}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                        <span className="text-[10px] font-heading font-bold uppercase text-purple-800 block">Completed</span>
                        <span className="font-heading text-2xl font-extrabold text-purple-700">{donorCompletedCount}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                        <span className="text-[10px] font-heading font-bold uppercase text-rose-800 block">Expired</span>
                        <span className="font-heading text-2xl font-extrabold text-rose-700">{donorExpiredCount}</span>
                      </div>
                    </div>
                  )}

                  {user.role === 'receiver' && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#E8F5ED]/60 border border-[#16865B]/20">
                        <span className="text-[10px] font-heading font-bold uppercase text-[#123C2D] block">AI Matches</span>
                        <span className="font-heading text-2xl font-extrabold text-[#16865B]">{receiverFeed.length}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                        <span className="text-[10px] font-heading font-bold uppercase text-blue-800 block">Pending</span>
                        <span className="font-heading text-2xl font-extrabold text-blue-700">{recPendingCount}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                        <span className="text-[10px] font-heading font-bold uppercase text-purple-800 block">Meals Saved</span>
                        <span className="font-heading text-2xl font-extrabold text-purple-700">{recMealsReceived}</span>
                      </div>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="pt-2 flex items-center justify-between p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                    <div>
                      <p className="font-heading font-bold text-xs text-rose-900">Account Deletion</p>
                      <p className="text-[11px] text-rose-700">Permanently delete your account and associated records.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-heading font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              )
            ) : activeTab === 'overview' ? (
              /* TAB 2: METRICS & ACTIVE BATCHES */
              <div className="space-y-5">
                {user?.role === 'donor' && (
                  <div className="p-4 rounded-3xl bg-[#E8F5ED]/75 border border-[#16865B]/25 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D]">
                        Your Personal Impact
                      </span>
                      <p className="font-heading text-base font-extrabold text-[#123C2D] mt-0.5">
                        {donorMealsDelivered} Meals Delivered • {donorCo2Saved} kg CO₂e Avoided
                      </p>
                      <p className="text-[11px] text-[#718078]">
                        {donorActiveCount} active • {donorPendingCount} in progress • {donorExpiredCount} expired
                      </p>
                    </div>
                    <Leaf className="w-8 h-8 text-[#16865B] shrink-0" />
                  </div>
                )}

                {user?.role === 'receiver' && (
                  <div className="p-4 rounded-3xl bg-[#E8F5ED]/75 border border-[#16865B]/25 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D]">
                        Shelter Activity
                      </span>
                      <p className="font-heading text-base font-extrabold text-[#123C2D] mt-0.5">
                        {recMealsReceived} Meals Received • {recPickupReadyCount} Ready for Pickup
                      </p>
                      <p className="text-[11px] text-[#718078]">
                        {receiverFeed.length} active AI matches available nearby
                      </p>
                    </div>
                    <Truck className="w-8 h-8 text-[#16865B] shrink-0" />
                  </div>
                )}

                {/* 4 Platform KPI Tiles */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 bg-gradient-to-br from-white to-[#E8F5ED]/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Total Listed</span>
                      <Package className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#123C2D]">
                      {summary?.total_meals_listed ?? 0}
                    </p>
                    <span className="text-[11px] text-[#718078] font-medium">Meals Recorded</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-white to-[#E8F5ED]/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Redistributed</span>
                      <TrendingUp className="w-4 h-4 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#16865B]">
                      {summary?.total_meals_redistributed ?? 0}
                    </p>
                    <span className="text-[11px] text-[#718078] font-medium">Delivered to Care Homes</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Match Success</span>
                      <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#E9A23B]">
                      {summary?.redistribution_rate ?? 0}%
                    </p>
                    <span className="text-[11px] text-[#718078] font-medium">AI Pairing Efficiency</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-white to-[#E8F5ED]/50 rounded-2xl border border-emerald-950/10 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Impact (CO₂e)</span>
                      <Leaf className="w-4 h-4 text-[#42B883]" />
                    </div>
                    <p className="font-heading text-2xl font-black text-[#123C2D]">
                      {summary?.estimated_co2_saved_kg ?? 0} kg
                    </p>
                    <span className="text-[11px] text-[#718078] font-medium">Methane Prevented</span>
                  </div>
                </div>

                {/* Active Surplus Feed Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                      {user?.role === 'donor' ? 'My Active Surplus Batches' : 'Available Surplus Listings'}
                    </h4>
                    <Link
                      to={user?.role === 'donor' ? '/donor-dashboard' : '/available-food'}
                      onClick={() => setDashboardPanelOpen(false)}
                      className="text-xs font-bold text-[#16865B] hover:underline"
                    >
                      View All ({donations.length})
                    </Link>
                  </div>

                  {donations.length === 0 ? (
                    <div className="p-6 text-center bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/8 text-xs text-[#718078]">
                      No active unexpired food batches right now.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {donations.slice(0, 5).map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setDashboardPanelOpen(false);
                            navigate(`/donation/${d.id}`);
                          }}
                          className="p-3.5 bg-white hover:bg-[#F8FAF7] rounded-2xl border border-gray-200/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={d.image_url}
                              alt={d.food_name}
                              className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#123C2D]/10"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-xs text-[#202B25] truncate group-hover:text-[#16865B] transition">
                                {d.food_name}
                              </p>
                              <p className="text-[11px] text-[#718078] truncate">
                                {d.remaining_quantity ?? d.quantity} {d.quantity_unit} • {d.pickup_location}
                              </p>
                              {!['Completed', 'Collected'].includes(d.status) && (
                                <p className="text-[10px] font-medium text-[#9A6217] flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatRemainingTime(d, 'left')}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            <StatusBadge status={d.status} urgencyLevel={d.urgency_level} receiverView={user?.role === 'receiver'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'activity' ? (
              /* TAB 3: REQUESTS ACTIVITY */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                    {user?.role === 'donor' ? 'Incoming Allocation Requests' : 'My Requested Batches'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => loadPanelData(false)}
                    className="text-xs font-bold text-[#16865B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {myRequests.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8FAF7] rounded-3xl border border-gray-100 space-y-2.5">
                    <Package className="w-9 h-9 text-gray-300 mx-auto" />
                    <p className="text-sm font-heading font-bold text-[#202B25]">No request records yet</p>
                    <p className="text-xs text-[#718078]">
                      {user?.role === 'donor'
                        ? 'No incoming requests pending right now.'
                        : 'Explore available food listings and submit an allocation request.'}
                    </p>
                    <Link
                      to="/available-food"
                      onClick={() => setDashboardPanelOpen(false)}
                      className="inline-block px-4 py-2 rounded-full bg-[#123C2D] text-white text-xs font-heading font-bold mt-2 hover:bg-[#16865B] transition"
                    >
                      Browse Food Listings
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-xs text-[#202B25] truncate">
                              {req.donation?.food_name || `Batch #${req.donation_id}`}
                            </p>
                            <p className="text-[11px] text-[#718078]">
                              Requested: <strong>{req.requested_quantity}</strong> {req.donation?.quantity_unit || 'units'}
                              {req.receiver?.receiver_profile?.organization_name ? ` • ${req.receiver.receiver_profile.organization_name}` : ''}
                            </p>
                          </div>
                          <StatusBadge status={req.status} />
                        </div>

                        {req.message && (
                          <p className="text-[11px] text-[#202B25] bg-[#F8FAF7] p-2.5 rounded-xl italic">
                            "{req.message}"
                          </p>
                        )}

                        {user?.role === 'donor' && req.status === 'Requested' && (
                          <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold transition cursor-pointer"
                            >
                              Accept Request
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateRequestStatus(req.id, 'Rejected')}
                              className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-heading font-bold transition cursor-pointer"
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
              /* TAB 4: QUICK ACTIONS */
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider mb-2">
                  Fast Navigation & Actions
                </h4>

                {(user?.role === 'donor' || user?.role === 'admin' || !user) ? (
                  <Link
                    to="/add-donation"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#16865B] to-[#123C2D] text-white flex items-center justify-between shadow-xs hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <PlusCircle className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xs">List New Surplus Food</p>
                        <p className="text-[11px] text-emerald-100">Upload batch details & consumption deadline</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/available-food"
                    onClick={() => setDashboardPanelOpen(false)}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#16865B] to-[#123C2D] text-white flex items-center justify-between shadow-xs hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Layers className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xs">Browse Available Food</p>
                        <p className="text-[11px] text-emerald-100">Explore unexpired surplus food nearby</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <Link
                  to="/matching"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-4 rounded-2xl bg-[#E8F5ED] hover:bg-emerald-100/70 border border-[#16865B]/30 text-[#123C2D] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Sparkles className="w-4.5 h-4.5 text-[#E9A23B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Run AI Matching Engine</p>
                      <p className="text-[11px] text-[#718078]">4-factor weighted score calculation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/hotspots"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-4 rounded-2xl bg-white hover:bg-[#F8FAF7] border border-gray-200 text-[#202B25] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F8FAF7] border border-gray-200 flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5 text-[#16865B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Waste Hotspot Map</p>
                      <p className="text-[11px] text-[#718078]">Spatial surplus generation nodes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/impact"
                  onClick={() => setDashboardPanelOpen(false)}
                  className="w-full p-4 rounded-2xl bg-[#E8F5ED]/60 hover:bg-[#E8F5ED] border border-[#16865B]/20 text-[#123C2D] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Leaf className="w-4.5 h-4.5 text-[#16865B]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs">Sustainability Impact Calculator</p>
                      <p className="text-[11px] text-[#718078]">CO₂e & FAO water conservation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Footer Action */}
          <div className="px-6 py-4 border-t border-[#123C2D]/10 bg-[#F8FAF7] flex items-center justify-between gap-3 shrink-0">
            <Link
              to={getFullDashboardUrl()}
              onClick={() => setDashboardPanelOpen(false)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
