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
  UserX,
  Sparkles,
  ArrowRight
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
import { isDonationExpired } from '../utils/dateUtils';
import { useExpiryWatcher } from '../hooks/useExpiryWatcher';

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

  const loadAdminData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [sumData, chartData, userData, donationData] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getCharts().catch(() => null),
        api.getAdminUsers().catch(() => []),
        api.getDonations().catch(() => []),
      ]);

      setSummary(sumData);
      setCharts(chartData);
      setUsers(userData || []);
      setDonations(donationData || []);
    } catch (err) {
      if (!silent) showToast(err.message || 'Failed to load administrator data', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Preserve historical Expired items in Admin Dashboard while syncing status & KPIs live
  useExpiryWatcher(donations, setDonations, () => loadAdminData(true), (item) => item, 5000, true);

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

  const CATEGORY_COLORS = ['#123C2D', '#16865B', '#42B883', '#E9A23B', '#10B981', '#3B82F6', '#6B7280'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#16865B]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider bg-white/10 text-[#E8F5ED] border border-white/20">
              Platform Administration
            </span>
            <span className="text-xs text-[#E8F5ED]/80 font-mono">SQLite Real-Time Sync</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            FoodBridge AI Central Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#E8F5ED]/80 mt-1 max-w-xl">
            Monitors food donations, algorithmic matching throughput, user verification, and municipal waste reduction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/hotspots"
            className="px-5 py-2.5 rounded-full bg-[#FEF7EC] hover:bg-[#FDF0D9] text-[#9A6217] font-heading font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-[#E9A23B]" />
            <span>Hotspots</span>
          </Link>
          <Link
            to="/impact"
            className="px-5 py-2.5 rounded-full bg-[#E8F5ED] hover:bg-[#d5ece0] text-[#123C2D] font-heading font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-[#16865B]" />
            <span>Impact Report</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)]">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078] block mb-1">
              Registered Donors
            </span>
            <p className="font-heading text-3xl font-extrabold text-[#123C2D] font-mono">{summary.active_donors}</p>
            <p className="text-[11px] text-[#718078] mt-1">Restaurants & Canteens</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)]">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078] block mb-1">
              Registered Receivers
            </span>
            <p className="font-heading text-3xl font-extrabold text-[#16865B] font-mono">{summary.active_receivers}</p>
            <p className="text-[11px] text-[#718078] mt-1">Shelters & NGOs</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)]">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078] block mb-1">
              Total Meals Listed
            </span>
            <p className="font-heading text-3xl font-extrabold text-[#123C2D] font-mono">{summary.total_meals_listed}</p>
            <p className="text-[11px] text-[#718078] mt-1">Total surplus volume</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)]">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#718078] block mb-1">
              Redistributed Meals
            </span>
            <p className="font-heading text-3xl font-extrabold text-[#16865B] font-mono">{summary.total_meals_redistributed}</p>
            <p className="text-[11px] text-[#16865B] font-medium mt-1">{summary.redistribution_rate}% success rate</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#123C2D]/8 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`py-2.5 px-5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'donations'
              ? 'bg-[#123C2D] text-white shadow-xs'
              : 'text-[#718078] hover:bg-[#E8F5ED] hover:text-[#123C2D]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Donations ({donations.length})</span>
        </button>
      </div>

      {/* Tab 1: Charts Overview */}
      {activeTab === 'overview' && charts && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#123C2D]">
              7-Day Redistribution Throughput
            </h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.weekly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid rgba(18,60,45,0.1)',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="listed" name="Listed Meals" stroke="#123C2D" strokeWidth={2.5} fill="#E8F5ED" />
                  <Area type="monotone" dataKey="redistributed" name="Delivered Meals" stroke="#16865B" strokeWidth={2.5} fill="#42B883" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#123C2D]">
              Category Breakdown
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.category_distribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {charts.category_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF7] text-[#718078] uppercase font-heading font-bold text-[10px] tracking-wider border-y border-[#123C2D]/6">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Locality</th>
                  <th className="py-3 px-4">Donations / Reqs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123C2D]/6 text-[#202B25]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAF7]/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-heading font-bold text-[#123C2D]">{u.full_name}</p>
                      <p className="text-[11px] text-[#718078] font-mono">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[#E8F5ED] text-[#123C2D]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{u.location || '-'}</td>
                    <td className="py-3.5 px-4 font-mono">{u.donation_count} don / {u.request_count} req</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition cursor-pointer ${u.is_active ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
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

      {/* Tab 3: Donations Management */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF7] text-[#718078] uppercase font-heading font-bold text-[10px] tracking-wider border-y border-[#123C2D]/6">
                <tr>
                  <th className="py-3 px-4">Donation</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123C2D]/6 text-[#202B25]">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8FAF7]/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-heading font-bold text-[#123C2D]">{d.food_name}</p>
                      <p className="text-[11px] text-[#718078]">{d.category}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#123C2D]">{d.quantity} {d.quantity_unit}</td>
                    <td className="py-3.5 px-4">{d.pickup_location}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        status={isDonationExpired(d) && !['Completed', 'Collected', 'Cancelled'].includes(d.status) ? 'Expired' : d.status}
                        urgencyLevel={d.urgency_level}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/donation/${d.id}`} className="p-1.5 rounded-lg text-[#718078] hover:text-[#123C2D] hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setDonationToDelete(d);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
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
        title="Admin Delete Listing?"
        message={`Are you sure you want to permanently delete '${donationToDelete?.food_name}'?`}
        confirmText="Delete Permanently"
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
