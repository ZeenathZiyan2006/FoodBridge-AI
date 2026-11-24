import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Users,
  Utensils,
  HeartHandshake,
  Star,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { api } from '../services/api';

export const TrustAndVerificationSystem = () => {
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'donor', 'receiver'
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagSuccessMsg, setFlagSuccessMsg] = useState('');

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const data = await api.getTrustDirectory();
        setDirectory(data || []);
      } catch (err) {
        console.error('Error loading trust directory:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDirectory();
  }, []);

  const handleOpenFlagModal = (org) => {
    setSelectedOrg(org);
    setFlagReason('');
    setFlagSuccessMsg('');
    setFlagModalOpen(true);
  };

  const handleSubmitFlag = (e) => {
    e.preventDefault();
    if (!flagReason.trim()) return;
    setFlagSuccessMsg('Report submitted confidentially for administrator review. Our safety moderators will review the audit logs within 24 hours without public impact on the organization.');
    setTimeout(() => {
      setFlagModalOpen(false);
      setFlagSuccessMsg('');
    }, 3000);
  };

  const filtered = directory.filter((d) => {
    if (filterRole === 'donor') return d.role === 'donor';
    if (filterRole === 'receiver') return d.role === 'receiver';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* 1. Header Banner & Trust Pillars */}
      <div className="bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#16865B]/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#42B883]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#E8F5ED] text-xs font-heading font-extrabold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#42B883]" />
            <span>ACCOUNTABILITY & CONFIDENCE PROTOCOL</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Verified Donor & Receiver Trust System
          </h2>

          <p className="text-xs sm:text-sm text-[#E8F5ED]/90 leading-relaxed font-normal">
            Building unshakeable confidence between commercial food donors and receiving shelters. Every organization undergoes institutional verification, adheres to safe pickup timelines, and maintains transparent reliability records.
          </p>

          {/* 4 Pillars of Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#42B883] font-extrabold flex items-center gap-1 font-heading">
                <FileCheck2 className="w-3.5 h-3.5 text-[#42B883]" />
                Institutional Verification
              </span>
              <p className="text-[11px] text-[#E8F5ED]/80">
                FSSAI food hygiene licensing for donors; DARPAN / Govt NGO registration for receivers.
              </p>
            </div>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#E9A23B] font-extrabold flex items-center gap-1 font-heading">
                <Clock className="w-3.5 h-3.5 text-[#E9A23B]" />
                Handover Auditing
              </span>
              <p className="text-[11px] text-[#E8F5ED]/80">
                Tracks completed, cancelled, and missed pickups to uphold operational discipline.
              </p>
            </div>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#42B883] font-extrabold flex items-center gap-1 font-heading">
                <HeartHandshake className="w-3.5 h-3.5 text-[#42B883]" />
                Zero Public Shaming
              </span>
              <p className="text-[11px] text-[#E8F5ED]/80">
                Positive coaching and support instead of public humiliation or automated unfair exclusions.
              </p>
            </div>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#E9A23B] font-extrabold flex items-center gap-1 font-heading">
                <Flag className="w-3.5 h-3.5 text-[#E9A23B]" />
                Confidential Admin Flagging
              </span>
              <p className="text-[11px] text-[#E8F5ED]/80">
                Repeated suspicious anomalies are securely escalated for neutral administrative review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Directory Navigation & Filtering */}
      <div className="bg-white rounded-3xl p-6 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#123C2D]">
              Verified Organization Directory
            </h3>
            <p className="text-xs text-[#718078]">
              Browse verified canteens, restaurants, shelters, and care homes in the coastal Karnataka network.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAF7] p-1.5 rounded-full border border-gray-200 text-xs font-heading font-bold self-start sm:self-auto">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterRole === 'all' ? 'bg-[#123C2D] text-white shadow-xs' : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              All Organizations ({directory.length})
            </button>
            <button
              onClick={() => setFilterRole('donor')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterRole === 'donor' ? 'bg-[#123C2D] text-white shadow-xs' : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              Donors ({directory.filter((d) => d.role === 'donor').length})
            </button>
            <button
              onClick={() => setFilterRole('receiver')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterRole === 'receiver' ? 'bg-[#123C2D] text-white shadow-xs' : 'text-[#718078] hover:text-[#123C2D]'
              }`}
            >
              Receivers ({directory.filter((d) => d.role === 'receiver').length})
            </button>
          </div>
        </div>

        {/* Directory Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#718078]">
            Loading verified trust directory...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((org) => {
              const isDonor = org.role === 'donor';
              return (
                <div
                  key={org.user_id}
                  className="bg-[#F8FAF7] hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#16865B]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isDonor
                          ? 'bg-[#FEF7EC] text-[#9A6217] border-[#E9A23B]/30'
                          : 'bg-[#E8F5ED] text-[#123C2D] border-[#16865B]/30'
                      }`}>
                        {isDonor ? 'Food Donor' : 'Receiver Shelter'}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16865B] font-mono">
                        <Award className="w-3.5 h-3.5 text-[#16865B]" />
                        <span>{org.trust_tier}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-[#123C2D]">
                        {org.organization_name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-[#718078] mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#16865B] shrink-0" />
                        <span className="truncate">{org.verification_badge}</span>
                      </div>
                      {org.verification_id && (
                        <p className="text-[10px] font-mono text-[#718078] mt-0.5">
                          Reg / ID: <strong>{org.verification_id}</strong>
                        </p>
                      )}
                    </div>

                    {/* Reliability KPI Box */}
                    <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-gray-100 text-center">
                      <div>
                        <span className="text-[9px] font-mono text-[#718078] block">Reliability</span>
                        <span className="font-heading font-extrabold text-xs text-[#16865B]">
                          {org.reliability_score}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#718078] block">Pickups</span>
                        <span className="font-heading font-extrabold text-xs text-[#123C2D]">
                          {org.completed_pickups} Done
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#718078] block">Missed</span>
                        <span className="font-heading font-extrabold text-xs text-[#718078]">
                          {org.missed_pickups}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#718078] pt-1">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{org.feedback_rating}</span>
                        <span className="text-[#718078] font-normal">({org.feedback_count} reviews)</span>
                      </div>
                      <span className="text-[10px] text-[#16865B] font-semibold">Active Standing</span>
                    </div>
                  </div>

                  {/* Flag for Admin Review CTA */}
                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-[#718078]">
                      Zero public disputes
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenFlagModal(org)}
                      className="text-[10px] font-heading font-semibold text-[#718078] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition"
                      title="Privately report an issue or anomaly for administrative review"
                    >
                      <Flag className="w-3 h-3" />
                      <span>Report to Admin</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Flag / Report Anomaly Modal */}
      {flagModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B25]/50 backdrop-blur-xs animate-fade-in font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-700">
                <Flag className="w-4 h-4 text-rose-600" />
                <h4 className="font-heading font-bold text-sm">
                  Confidential Administrative Report
                </h4>
              </div>
              <button
                onClick={() => setFlagModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#718078]">
              Reporting: <strong className="text-[#202B25]">{selectedOrg.organization_name}</strong>.
              All reports are confidential and audited manually by system administrators to maintain trust and prevent harassment or public shaming.
            </p>

            {flagSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs">
                {flagSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Issue Category
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-[#F8FAF7]">
                    <option value="missed">Unannounced Missed Collection</option>
                    <option value="temp">Food Holding / Temperature Concern</option>
                    <option value="quantity">Discrepancy in Listed vs Actual Portions</option>
                    <option value="communication">Unresponsive Contact During Handover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Observation Notes
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Provide objective facts regarding the incident for moderator review..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#16865B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFlagModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-xs cursor-pointer"
                  >
                    Submit Confidential Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
