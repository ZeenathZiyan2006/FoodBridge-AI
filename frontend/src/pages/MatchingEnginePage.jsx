import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Clock,
  Utensils,
  RefreshCw,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  HeartHandshake,
  ArrowRight,
  Phone,
  Layers,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { SafetyBanner } from '../components/SafetyBanner';

export const MatchingEnginePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDonationId = searchParams.get('donationId');

  const [donations, setDonations] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(initialDonationId || '');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Load all available/active donations for the selector dropdown
  useEffect(() => {
    const loadDonations = async () => {
      try {
        const data = await api.getDonations();
        setDonations(data || []);
        if (!selectedDonationId && data && data.length > 0) {
          setSelectedDonationId(data[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadDonations();
  }, []);

  // Fetch AI recommendations when selectedDonationId changes
  const fetchMatchingResults = async (id, isRefresh = false) => {
    if (!id) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await api.getDonationRecommendations(id);
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to compute matching recommendations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedDonationId) {
      fetchMatchingResults(selectedDonationId);
      setSearchParams({ donationId: selectedDonationId });
    }
  }, [selectedDonationId]);

  const handleRefresh = () => {
    if (selectedDonationId) {
      fetchMatchingResults(selectedDonationId, true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* 1. AI-POWERED MATCHING HEADER */}
      <div className="bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#16865B]/30">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#42B883]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#E8F5ED] text-xs font-heading font-extrabold border border-white/20">
            <Sparkles className="w-4 h-4 text-[#E9A23B]" />
            <span>AI-POWERED MATCHING ENGINE</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Algorithmic Multi-Factor Food Matching
          </h1>

          <p className="text-xs sm:text-sm text-[#E8F5ED]/90 leading-relaxed font-normal">
            Unlike static bulletin boards that leave perishable meals to spoil, FoodBridge AI computes a continuous weighted compatibility score (0–100%) across four core variables to ensure minimum transit latency, optimal capacity absorption, and strict dietary safety.
          </p>

          {/* 4 Multi-Factor Weighting Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs font-heading">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[#E9A23B] font-extrabold block text-base font-mono">40%</span>
              <span className="text-white font-bold">Location Proximity</span>
              <span className="text-[10px] text-[#E8F5ED]/70 block mt-0.5">Haversine Geodesic</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[#42B883] font-extrabold block text-base font-mono">25%</span>
              <span className="text-white font-bold">Capacity Fit</span>
              <span className="text-[10px] text-[#E8F5ED]/70 block mt-0.5">Shelter Absorption</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[#E9A23B] font-extrabold block text-base font-mono">25%</span>
              <span className="text-white font-bold">Urgency Window</span>
              <span className="text-[10px] text-[#E8F5ED]/70 block mt-0.5">Consumption Deadline</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[#42B883] font-extrabold block text-base font-mono">10%</span>
              <span className="text-white font-bold">Dietary Needs</span>
              <span className="text-[10px] text-[#E8F5ED]/70 block mt-0.5">Veg / Non-Veg / Vegan</span>
            </div>
          </div>
        </div>
      </div>

      <SafetyBanner />

      {/* 2. DONATION BATCH SELECTOR & REFRESH BAR */}
      <div className="bg-white rounded-3xl p-6 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-[11px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-2">
            Select Food Donation Batch to Run AI Matching:
          </label>
          <select
            value={selectedDonationId}
            onChange={(e) => setSelectedDonationId(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[#123C2D]/12 font-heading font-semibold text-xs sm:text-sm text-[#202B25] focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50 cursor-pointer"
          >
            {donations.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id} - {d.food_name} ({d.quantity} {d.quantity_unit} in {d.pickup_location}) - {d.status}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Recalculating...' : 'Refresh AI Matching'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. MATCHING RESULTS */}
      {loading ? (
        <div className="py-24 text-center text-[#718078] text-sm space-y-3">
          <div className="inline-block w-9 h-9 border-3 border-[#16865B] border-t-transparent rounded-full animate-spin" />
          <p className="font-heading font-medium">Computing multi-factor proximity and capacity matrix algorithms...</p>
        </div>
      ) : recommendations ? (
        <div className="space-y-8">
          {/* Target Donation Context Card */}
          <div className="bg-[#E8F5ED] rounded-3xl p-6 border border-[#16865B]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#123C2D] bg-white px-3 py-0.5 rounded-full border border-[#16865B]/20">
                  Optimization Target
                </span>
                <span className="text-xs font-mono font-bold text-[#718078]">Batch #{recommendations.donation_id}</span>
              </div>
              <h2 className="font-heading text-xl font-extrabold text-[#123C2D]">{recommendations.food_name}</h2>
              <p className="text-xs text-[#123C2D]/80">
                {recommendations.quantity} {recommendations.quantity_unit} • {recommendations.dietary_type} • Pickup: <strong>{recommendations.pickup_location}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-2xl border border-[#16865B]/20 text-center shadow-2xs">
                <p className="text-[10px] font-heading font-bold text-[#718078] uppercase">Urgency Window</p>
                <p className="text-xs font-heading font-extrabold text-[#9A6217] font-mono mt-0.5">
                  {recommendations.urgency_level} ({recommendations.hours_left} hrs)
                </p>
              </div>

              <Link
                to={`/donation/${recommendations.donation_id}`}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#123C2D] hover:text-white text-[#123C2D] font-heading font-bold text-xs border border-[#16865B]/30 transition-all shadow-2xs"
              >
                View Listing Details
              </Link>
            </div>
          </div>

          {/* BEST MATCH HIGHLIGHT CARD */}
          {recommendations.best_match && (
            <div className="bg-white rounded-3xl p-7 sm:p-10 border-2 border-[#16865B] shadow-xl relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#123C2D] to-[#16865B] text-white px-6 py-1.5 rounded-bl-2xl text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4 text-[#E9A23B]" />
                <span>#1 Optimal Receiver Match</span>
              </div>

              <div className="space-y-6 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#123C2D] bg-[#E8F5ED] px-3 py-0.5 rounded-full border border-[#16865B]/20">
                      {recommendations.best_match.organization_type}
                    </span>
                    <span className="text-xs text-[#718078]">
                      Target Capacity: <strong>{recommendations.best_match.required_quantity} meals</strong>
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D]">
                    {recommendations.best_match.organization_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#718078] mt-1 flex flex-wrap items-center gap-2">
                    <span>Contact: <strong className="text-[#202B25]">{recommendations.best_match.receiver_name}</strong></span>
                    <span>•</span>
                    <span>Phone: <strong className="text-[#202B25]">{recommendations.best_match.contact_phone}</strong></span>
                    <span>•</span>
                    <span>Locality: <strong className="text-[#202B25]">{recommendations.best_match.location_name}</strong></span>
                  </p>
                </div>

                {/* Score Progress Bar */}
                <div className="bg-[#F8FAF7] p-5 rounded-2xl border border-[#123C2D]/8 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-heading font-extrabold text-[#123C2D] uppercase tracking-wider block">
                        Composite AI Match Score
                      </span>
                      <span className="text-[11px] text-[#718078]">Calculated across all 4 weighted parameters</span>
                    </div>
                    <div className="text-right">
                      <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#16865B] font-mono">
                        {recommendations.best_match.total_match_score}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#123C2D]/10 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#123C2D] via-[#16865B] to-[#42B883] h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${recommendations.best_match.total_match_score}%` }}
                    />
                  </div>
                </div>

                {/* 4 Multi-Factor Breakdown Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  {/* Factor 1: Location */}
                  <div className="p-4 bg-white rounded-2xl border border-[#123C2D]/8 shadow-2xs space-y-1.5 hover:border-[#16865B]/30 transition-all">
                    <div className="flex items-center justify-between text-[#718078]">
                      <span className="font-heading font-bold text-[11px]">1. Proximity (40%)</span>
                      <MapPin className="w-3.5 h-3.5 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-xl font-extrabold text-[#123C2D] font-mono">
                      {recommendations.best_match.factors.location_score}%
                    </p>
                    <p className="text-[11px] text-[#718078]">
                      Transit Distance: <strong className="text-[#202B25]">{recommendations.best_match.factors.distance_km} km</strong>
                    </p>
                  </div>

                  {/* Factor 2: Capacity */}
                  <div className="p-4 bg-white rounded-2xl border border-[#123C2D]/8 shadow-2xs space-y-1.5 hover:border-[#16865B]/30 transition-all">
                    <div className="flex items-center justify-between text-[#718078]">
                      <span className="font-heading font-bold text-[11px]">2. Capacity (25%)</span>
                      <Utensils className="w-3.5 h-3.5 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-xl font-extrabold text-[#123C2D] font-mono">
                      {recommendations.best_match.factors.quantity_score}%
                    </p>
                    <p className="text-[11px] text-[#718078]">
                      Absorption Ratio: <strong className="text-[#202B25]">{Math.round(recommendations.best_match.factors.quantity_ratio * 100)}%</strong>
                    </p>
                  </div>

                  {/* Factor 3: Urgency */}
                  <div className="p-4 bg-white rounded-2xl border border-[#123C2D]/8 shadow-2xs space-y-1.5 hover:border-[#16865B]/30 transition-all">
                    <div className="flex items-center justify-between text-[#718078]">
                      <span className="font-heading font-bold text-[11px]">3. Urgency (25%)</span>
                      <Clock className="w-3.5 h-3.5 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-xl font-extrabold text-[#123C2D] font-mono">
                      {recommendations.best_match.factors.urgency_score}%
                    </p>
                    <p className="text-[11px] text-[#718078]">
                      Safe Window: <strong className="text-[#202B25]">{recommendations.best_match.factors.hours_left} hrs</strong>
                    </p>
                  </div>

                  {/* Factor 4: Dietary Preference */}
                  <div className="p-4 bg-white rounded-2xl border border-[#123C2D]/8 shadow-2xs space-y-1.5 hover:border-[#16865B]/30 transition-all">
                    <div className="flex items-center justify-between text-[#718078]">
                      <span className="font-heading font-bold text-[11px]">4. Dietary (10%)</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16865B]" />
                    </div>
                    <p className="font-heading text-xl font-extrabold text-[#123C2D] font-mono">
                      {recommendations.best_match.factors.preference_score}%
                    </p>
                    <p className="text-[11px] text-[#718078]">
                      Preference: <strong className="text-[#202B25]">{recommendations.best_match.dietary_preference}</strong>
                    </p>
                  </div>
                </div>

                {/* Explainable AI Reasoning */}
                <div className="p-5 bg-[#E8F5ED] rounded-2xl border border-[#16865B]/25 space-y-1">
                  <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D] block">
                    Algorithmic Explanation (Explainable AI Rationale)
                  </span>
                  <p className="text-xs text-[#123C2D] font-medium leading-relaxed">
                    {recommendations.best_match.recommendation_reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ALTERNATIVE RANKED MATCHES LIST */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                Alternative Ranked Receiving Candidates
              </h3>
              <p className="text-xs text-[#718078]">
                Secondary shelters and community kitchens ranked in descending order if the primary receiver is unavailable.
              </p>
            </div>

            <div className="divide-y divide-[#123C2D]/6">
              {recommendations.all_recommendations && recommendations.all_recommendations.slice(1).map((match) => (
                <div key={match.receiver_id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#E8F5ED] text-[#123C2D] text-xs font-mono font-bold flex items-center justify-center border border-[#16865B]/20">
                        {match.rank}
                      </span>
                      <h4 className="font-heading font-bold text-[#202B25] text-sm sm:text-base">
                        {match.organization_name}
                      </h4>
                      <span className="text-[10px] bg-gray-100 text-[#718078] px-2.5 py-0.5 rounded-full font-heading font-semibold">
                        {match.organization_type}
                      </span>
                    </div>

                    <p className="text-xs text-[#718078]">
                      Locality: <strong>{match.location_name}</strong> ({match.factors.distance_km} km) • Capacity: <strong>{match.required_quantity} meals</strong> • Dietary: {match.dietary_preference}
                    </p>

                    <p className="text-xs text-[#16865B] italic pt-0.5">
                      "{match.recommendation_reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-heading font-bold text-[#718078] uppercase block">Match Score</span>
                      <span className="font-heading text-xl font-extrabold text-[#123C2D] font-mono">
                        {match.total_match_score}%
                      </span>
                    </div>

                    <div className="w-20 bg-[#123C2D]/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#16865B] h-full rounded-full"
                        style={{ width: `${match.total_match_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Formulation Footer */}
          <div className="bg-[#123C2D] text-[#E8F5ED]/90 rounded-3xl p-6 sm:p-8 space-y-3 border border-[#16865B]/30">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#42B883]" />
              <span>Algorithm Architecture & Mathematical Formulation</span>
            </h4>
            <p className="text-xs leading-relaxed text-[#E8F5ED]/80">
              This system utilizes a deterministic <strong>multi-factor optimization model</strong> with weighted scoring parameters. It calculates geodesic surface distances using the <strong>Haversine formula</strong> across local geographic nodes (Manipal, Udupi, Santhekatte, Malpe, Brahmavar), bounds quantity absorption ratios to avoid shelter over-saturation, enforces strict dietary compliance (e.g. 0% score penalty if a vegetarian shelter receives meat), and dynamically elevates urgency weights when a food batch approaches its 2-hour consumption deadline.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
