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
  Truck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SafetyBanner } from '../components/SafetyBanner';

export const DonorDashboard = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadMyDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getMyDonations();
      setDonations(data);
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

  const handleOpenRequests = async (donation) => {
    setSelectedDonation(donation);
    try {
      const reqData = await api.getDonationRequests(donation.id);
      setRequests(reqData);
      setRequestsModalOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to load requests for this donation', 'error');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus, notes) => {
    setActionLoading(true);
    try {
      await api.updateRequestStatus(requestId, newStatus, notes);
      showToast(`Request marked as '${newStatus}'!`, 'success');
      const reqData = await api.getDonationRequests(selectedDonation.id);
      setRequests(reqData);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#14532D] border border-[#16A34A]/20">
              Donor Portal
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {user?.donor_profile?.organization_type || 'Restaurant Partner'}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome, {user?.full_name || 'Donor'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your surplus food donations, accept shelter requests, and track zero-waste community impact.
          </p>
        </div>

        <Link
          to="/add-donation"
          className="px-5 py-3 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white font-bold text-xs shadow-2xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#ECFDF5]" />
          <span>Add Food Donation</span>
        </Link>
      </div>

      <SafetyBanner />

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Listed</span>
            <Package className="w-4 h-4 text-[#14532D]" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">{totalListed}</p>
          <p className="text-[11px] text-gray-400 mt-1">Surplus food batches</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Available</span>
            <Clock className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16A34A]">{availableCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Ready for receiver matching</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Requests</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-700">{requestedCount}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Needs donor approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Redistributed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-purple-700">{completedCount}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Successfully rescued food</p>
        </div>
      </div>

      {/* My Donations Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-heading text-lg font-bold text-gray-900">My Listed Food Donations</h2>
            <p className="text-xs text-gray-500">Track and manage every donation batch in real-time.</p>
          </div>

          <Link
            to="/add-donation"
            className="px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] text-[#14532D] hover:bg-[#d1fae5] text-xs font-bold transition flex items-center gap-1.5 w-fit"
          >
            <PlusCircle className="w-4 h-4 text-[#16A34A]" />
            <span>List New Batch</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading your donations...</div>
        ) : donations.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#14532D] flex items-center justify-center mx-auto">
              <Package className="w-7 h-7 text-[#16A34A]" />
            </div>
            <h3 className="font-heading text-base font-bold text-gray-800">No Food Donations Listed Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Whenever you have surplus cooked meals, vegetables, or bakery items, list them here to feed community shelters.
            </p>
            <Link
              to="/add-donation"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#14532D] text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4 text-[#ECFDF5]" />
              <span>Add Food Donation</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-y border-gray-100">
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
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.image_url}
                          alt={d.food_name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div>
                          <p className="font-heading font-bold text-gray-900 hover:text-[#14532D]">
                            <Link to={`/donation/${d.id}`}>{d.food_name}</Link>
                          </p>
                          <p className="text-[11px] text-gray-400">{d.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                      {d.quantity} {d.quantity_unit}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800">{d.dietary_type}</span>
                      <p className="text-[11px] text-gray-400">{d.storage_condition}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${d.hours_left <= 3 ? 'text-amber-800' : 'text-gray-800'}`}>
                        {d.hours_left ? `${d.hours_left} hrs remaining` : 'Expired'}
                      </span>
                      <p className="text-[11px] text-gray-400">
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
                        className={`px-3 py-1 rounded-xl font-bold text-xs transition border cursor-pointer ${
                          d.requests && d.requests.length > 0
                            ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {d.requests?.length || 0} Requests
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/matching?donationId=${d.id}`}
                          className="p-1.5 text-emerald-800 hover:bg-[#ECFDF5] rounded-lg transition"
                          title="View AI Matching Candidates"
                        >
                          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                        </Link>

                        <Link
                          to={`/donation/${d.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
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
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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

      {/* Requests Modal */}
      {requestsModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20">
                  Manage Requests
                </span>
                <h3 className="font-heading text-lg font-bold text-gray-900 mt-1">
                  Requests for: {selectedDonation.food_name}
                </h3>
                <p className="text-xs text-gray-500">
                  Available: {selectedDonation.quantity} {selectedDonation.quantity_unit}
                </p>
              </div>
              <button
                onClick={() => setRequestsModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-gray-400">
                <p className="text-sm font-medium">No requests have been submitted yet.</p>
                <p className="text-xs">
                  Receivers matched by the AI engine will appear here when they submit requests.
                </p>
                <div className="pt-2">
                  <Link
                    to={`/matching?donationId=${selectedDonation.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#14532D] font-bold bg-[#ECFDF5] px-3.5 py-2 rounded-xl"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>View AI Matching Candidate Receivers</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-gray-900 text-sm">
                          {r.receiver?.receiver_profile?.organization_name || r.receiver?.full_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {r.receiver?.receiver_profile?.organization_type || 'NGO'} • {r.receiver?.location_name || 'Manipal'} • {r.receiver?.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#14532D] bg-[#ECFDF5] px-2.5 py-1 rounded-lg">
                          Requested: {r.requested_quantity} {selectedDonation.quantity_unit}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>

                    {r.message && (
                      <p className="text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 italic">
                        "{r.message}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      {r.status === 'Requested' && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(r.id, 'Rejected', 'Donor declined request.')}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(r.id, 'Accepted', 'Donor accepted food redistribution request.')}
                            className="px-4 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                          >
                            Accept Request
                          </button>
                        </>
                      )}

                      {r.status === 'Accepted' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(r.id, 'Ready for Pickup', 'Food packaged and verified ready at pickup counter.')}
                          className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
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
                          className="px-4 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
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
                          className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {r.status === 'Completed' && (
                        <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Verified
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
    </div>
  );
};
