import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Trash2,
  Eye,
  BarChart3,
  UserCheck,
  UserX
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const AdminDashboard = () => {
  const { user, showToast } = useAuth();

  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab: 'overview', 'users', 'donations'
  const [activeTab, setActiveTab] = useState('overview');

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sumData, chartData, userData, donationData] = await Promise.all([
        api.getSummary(),
        api.getCharts(),
        api.getAdminUsers(),
        api.getDonations(),
      ]);

      setSummary(sumData);
      setCharts(chartData);
      setUsers(userData);
      setDonations(donationData);
    } catch (err) {
      showToast(err.message || 'Failed to load administrator data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.toggleUserStatus(userId);
      showToast(res.message, 'success');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteDonation = async () => {
    if (!donationToDelete) return;
    setActionLoading(true);
    try {
      await api.deleteDonation(donationToDelete.id);
      showToast('Listing removed by administrator', 'success');
      setDeleteModalOpen(false);
      setDonationToDelete(null);
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const CATEGORY_COLORS = ['#14532D', '#16A34A', '#F59E0B', '#10B981', '#D97706', '#3B82F6', '#6B7280'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#1F2937] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-800 text-purple-300 border border-gray-700">
              Platform Administration
            </span>
            <span className="text-xs text-gray-400 font-mono">SQLite Real-Time Sync</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            FoodBridge AI Central Administration
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Monitors food donations, algorithmic matching throughput, user verification, and municipal waste reduction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/hotspots"
            className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            <span>Hotspots</span>
          </Link>
          <Link
            to="/impact"
            className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>Impact Report</span>
          </Link>
        </div>
      </div>

      {/* 8 Primary Metrics */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Registered Donors
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">{summary.active_donors}</p>
            <p className="text-[11px] text-gray-500 mt-1">Restaurants & Canteens</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Registered Receivers
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#14532D]">{summary.active_receivers}</p>
            <p className="text-[11px] text-emerald-700 mt-1">NGOs, Shelters, Orphanages</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Total Meals Listed
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">{summary.total_meals_listed}</p>
            <p className="text-[11px] text-gray-500 mt-1">Across all categories</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Meals Saved & Delivered
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16A34A]">
              {summary.total_meals_redistributed}
            </p>
            <p className="text-[11px] text-[#16A34A] font-bold mt-1">
              {summary.redistribution_rate}% Success Rate
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Pending Requests
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-700">{summary.pending_requests}</p>
            <p className="text-[11px] text-blue-600 mt-1">Awaiting donor handover</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Completed Donations
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-purple-700">{summary.completed_donations}</p>
            <p className="text-[11px] text-purple-600 mt-1">Verified redistribution</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Urgent Active Food
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#D97706]">{summary.urgent_donations}</p>
            <p className="text-[11px] text-[#D97706] mt-1">&lt; 5 hrs remaining</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Expired Listings
            </span>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-rose-600">{summary.expired_donations}</p>
            <p className="text-[11px] text-rose-600 mt-1">Safety locked</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'donations'
              ? 'bg-[#14532D] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Donations Moderation ({donations.length})</span>
        </button>
      </div>

      {/* TAB 1: RECHARTS */}
      {activeTab === 'overview' && charts && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div>
                <h3 className="font-heading text-sm font-bold text-gray-900">Weekly Food Listed vs Redistributed (Meals)</h3>
                <p className="text-[11px] text-gray-400">7-Day trend of surplus meals logged and safely handed over.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.weekly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorListed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorRedis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14532D" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14532D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="listed" name="Meals Listed" stroke="#16A34A" fillOpacity={1} fill="url(#colorListed)" />
                    <Area type="monotone" dataKey="redistributed" name="Meals Redistributed" stroke="#14532D" fillOpacity={1} fill="url(#colorRedis)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div>
                <h3 className="font-heading text-sm font-bold text-gray-900">Food Category Distribution</h3>
                <p className="text-[11px] text-gray-400">Volume breakdown across cooked meals, bakery, produce & packaged food.</p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.category_distribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {charts.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div>
                <h3 className="font-heading text-sm font-bold text-gray-900">Donation Lifecycle Status Distribution</h3>
                <p className="text-[11px] text-gray-400">Current state count across all active and completed batches.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.status_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="status" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Bar dataKey="count" name="Donation Count" fill="#16A34A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div>
                <h3 className="font-heading text-sm font-bold text-gray-900">Regional Distribution by Locality</h3>
                <p className="text-[11px] text-gray-400">Top food donor nodes in the Manipal-Udupi geographic cluster.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.location_distribution} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis dataKey="location" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Bar dataKey="donations" name="Donations" fill="#14532D" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">Registered Platform Users</h2>
              <p className="text-xs text-gray-500">Manage access, view participation metrics, and audit roles.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">User / Organization</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Donations</th>
                  <th className="py-3 px-4 text-center">Requests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {u.full_name}
                      <p className="text-[11px] text-gray-400 font-normal">{u.org_name}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'donor'
                          ? 'bg-[#ECFDF5] text-[#14532D]'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">{u.email}</td>

                    <td className="py-3.5 px-4 text-gray-600">{u.location || 'Manipal'}</td>

                    <td className="py-3.5 px-4 text-center font-bold font-mono">{u.donation_count}</td>

                    <td className="py-3.5 px-4 text-center font-bold font-mono">{u.request_count}</td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.is_active ? 'bg-[#ECFDF5] text-[#14532D]' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            u.is_active
                              ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                              : 'text-[#14532D] hover:bg-[#ECFDF5] border border-[#16A34A]/30'
                          }`}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DONATIONS */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">All Platform Food Donations</h2>
              <p className="text-xs text-gray-500">Monitor status, inspect expired entries, and remove non-compliant listings.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Donation</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <Link to={`/donation/${d.id}`} className="hover:text-[#14532D]">
                        {d.food_name}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">{d.category}</td>

                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                      {d.quantity} {d.quantity_unit}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">{d.pickup_location}</td>

                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                      {d.hours_left ? `${d.hours_left} hrs` : 'Expired'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} urgencyLevel={d.urgency_level} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/matching?donationId=${d.id}`}
                          className="p-1.5 text-emerald-800 hover:bg-[#ECFDF5] rounded-lg"
                          title="View AI Match Candidates"
                        >
                          <Flame className="w-4 h-4 text-[#F59E0B]" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setDonationToDelete(d);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Remove Listing"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Admin: Remove Inappropriate Listing?"
        message={`Are you sure you want to administratively delete '${donationToDelete?.food_name}'?`}
        confirmText="Confirm Deletion"
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
