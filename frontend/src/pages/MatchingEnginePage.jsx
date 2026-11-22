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
  HeartHandshake
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
        setDonations(data);
        if (!selectedDonationId && data.length > 0) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#14532D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#14532D]">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Core AI Innovation</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI-Powered Multi-Factor Food Matching Engine
          </h1>

          <p className="text-xs sm:text-sm text-[#ECFDF5]/90 leading-relaxed">
            Unlike static bulletin boards that leave perishable food to spoil, FoodBridge AI computes a continuous weighted compatibility score (0–100) across four core variables to ensure minimum transit latency, optimal capacity absorption, and strict dietary safety.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs font-semibold">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#F59E0B] font-bold block text-sm">40%</span>
              <span className="text-gray-200">Location Proximity</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#F59E0B] font-bold block text-sm">25%</span>
              <span className="text-gray-200">Capacity Fit</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#F59E0B] font-bold block text-sm">25%</span>
              <span className="text-gray-200">Consumption Urgency</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#F59E0B] font-bold block text-sm">10%</span>
              <span className="text-gray-200">Dietary Verification</span>
            </div>
          </div>
        </div>
      </div>

      <SafetyBanner />

      {/* Selector & Refresh */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Select Food Donation Batch to Run AI Matching:
          </label>
          <select
            value={selectedDonationId}
            onChange={(e) => setSelectedDonationId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white cursor-pointer"
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
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Recalculating...' : 'Refresh Matching'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">
          <div className="inline-block w-8 h-8 border-3 border-[#16A34A] border-t-transparent rounded-full animate-spin mb-3" />
          <p>Running multi-factor proximity and capacity matrix algorithms...</p>
        </div>
      ) : recommendations ? (
        <div className="space-y-8">
          {/* Target Donation Context Card */}
          <div className="bg-[#ECFDF5] rounded-2xl p-5 border border-[#16A34A]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] bg-white px-2 py-0.5 rounded-md border border-[#16A34A]/20">
                  Optimization Target
                </span>
                <span className="text-xs font-bold text-gray-500">Donation #{recommendations.donation_id}</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-[#14532D]">{recommendations.food_name}</h2>
              <p className="text-xs text-[#14532D]/80">
                {recommendations.quantity} {recommendations.quantity_unit} • {recommendations.dietary_type} • Location: {recommendations.pickup_location}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#16A34A]/20 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Urgency Status</p>
                <p className="text-xs font-bold text-amber-800 font-mono">{recommendations.urgency_level} ({recommendations.hours_left} hrs)</p>
              </div>

              <Link
                to={`/donation/${recommendations.donation_id}`}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ECFDF5] text-[#14532D] font-bold text-xs border border-[#16A34A]/30 transition"
              >
                View Listing
              </Link>
            </div>
          </div>

          {/* BEST MATCH HIGHLIGHT CARD */}
          {recommendations.best_match && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#16A34A] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#16A34A] text-white px-5 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#FFFBEB]" />
                <span>#1 Best Match</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#14532D] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20">
                      {recommendations.best_match.organization_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      Capacity: {recommendations.best_match.required_quantity} meals
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                    {recommendations.best_match.organization_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Contact: {recommendations.best_match.receiver_name} • {recommendations.best_match.contact_phone} • Locality: {recommendations.best_match.location_name}
                  </p>
                </div>

                {/* Score Progress Bar */}
                <div className="bg-gray-50 p-4.5 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Overall Recommendation Score
                    </span>
                    <span className="font-heading text-2xl font-extrabold text-[#14532D]">
                      {recommendations.best_match.total_match_score}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#16A34A] h-full rounded-full transition-all duration-700"
                      style={{ width: `${recommendations.best_match.total_match_score}%` }}
                    />
                  </div>
                </div>

                {/* 4 Multi-Factor Breakdown Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                  {/* Factor 1: Location */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="font-bold">1. Location (40%)</span>
                      <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-gray-900">
                      {recommendations.best_match.factors.location_score}%
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Distance: <strong>{recommendations.best_match.factors.distance_km} km</strong>
                    </p>
                  </div>

                  {/* Factor 2: Quantity */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="font-bold">2. Capacity (25%)</span>
                      <Utensils className="w-3.5 h-3.5 text-[#16A34A]" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-gray-900">
                      {recommendations.best_match.factors.quantity_score}%
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Absorption: <strong>{recommendations.best_match.factors.quantity_ratio * 100}%</strong>
                    </p>
                  </div>

                  {/* Factor 3: Urgency */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="font-bold">3. Urgency (25%)</span>
                      <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-gray-900">
                      {recommendations.best_match.factors.urgency_score}%
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Time Left: <strong>{recommendations.best_match.factors.hours_left} hrs</strong>
                    </p>
                  </div>

                  {/* Factor 4: Preference */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="font-bold">4. Dietary (10%)</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-gray-900">
                      {recommendations.best_match.factors.preference_score}%
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Pref: <strong>{recommendations.best_match.dietary_preference}</strong>
                    </p>
                  </div>
                </div>

                {/* Explainable AI Reasoning */}
                <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#16A34A]/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#14532D] block mb-1">
                    Algorithmic Explanation (Explainable AI)
                  </span>
                  <p className="text-xs text-[#14532D] font-medium leading-relaxed">
                    {recommendations.best_match.recommendation_reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ALTERNATIVE MATCHES LIST */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900">Alternative Ranked Candidates</h3>
              <p className="text-xs text-gray-500">
                Secondary receivers ranked in decreasing order of suitability if the primary receiver is unavailable.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {recommendations.all_recommendations.slice(1).map((match) => (
                <div key={match.receiver_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center font-mono">
                        {match.rank}
                      </span>
                      <h4 className="font-heading font-bold text-gray-900 text-sm">{match.organization_name}</h4>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                        {match.organization_type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Location: {match.location_name} ({match.factors.distance_km} km) • Capacity: {match.required_quantity} meals • Dietary: {match.dietary_preference}
                    </p>

                    <p className="text-xs text-[#14532D] italic pt-0.5">
                      "{match.recommendation_reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 block">Match Score</span>
                      <span className="font-heading text-xl font-extrabold text-gray-900 font-mono">
                        {match.total_match_score}%
                      </span>
                    </div>

                    <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#16A34A] h-full rounded-full"
                        style={{ width: `${match.total_match_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm Architecture Methodology */}
          <div className="bg-[#1F2937] text-gray-300 rounded-2xl p-6 sm:p-8 space-y-3 border border-gray-800">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#16A34A]" />
              <span>Algorithm Architecture & Mathematical Formulation</span>
            </h4>
            <p className="text-xs leading-relaxed text-gray-400">
              This prototype utilizes an <strong>intelligent rule-based multi-factor optimization algorithm</strong>. It continuously computes geodesic distances using the <strong>Haversine formula</strong> across local geographic nodes (Manipal, Udupi, Santhekatte, Malpe, Brahmavar, Karkala), bounds quantity absorption ratios to avoid shelter over-saturation, enforces strict dietary compliance (e.g., 0% score penalty for vegetarian shelters receiving meat), and amplifies location priority during critical 2-hour consumption deadlines.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
