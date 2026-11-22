import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  HeartHandshake,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Utensils,
  Leaf,
  Globe,
  Layers,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Flame,
  Check,
  Package,
  ChefHat
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FoodCard } from '../components/FoodCard';
import { SafetyBanner } from '../components/SafetyBanner';

export const LandingPage = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_donations: 12,
    active_donors: 6,
    active_receivers: 6,
    total_meals_listed: 420,
    total_meals_redistributed: 265,
    redistribution_rate: 63.1,
    estimated_people_fed: 265,
    estimated_co2_saved_kg: 662.5,
  });
  const [featuredDonations, setFeaturedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [summaryData, donationsData] = await Promise.all([
          api.getSummary().catch(() => null),
          api.getDonations({ limit: 8, status: 'Available', only_available: true }).catch(() => []),
        ]);
        if (summaryData) setStats(summaryData);
        if (donationsData) {
          // Strictly show only available and unexpired food in featured cards
          const activeOnly = donationsData.filter(
            (d) => d.status === 'Available' && d.hours_left > 0
          );
          setFeaturedDonations(activeOnly.slice(0, 4));
        }
      } catch (err) {
        console.error('Landing load error', err);
      } finally {
        setLoading(false);
      }
    };
    loadLandingData();
  }, []);

  const handleRoleAction = (requiredRole, path) => {
    if (!user) {
      showToast(`Please sign in with your ${requiredRole === 'donor' ? 'Food Donor' : 'Receiver'} account to continue.`, 'info');
      navigate('/login');
      return;
    }
    if (user.role !== requiredRole && user.role !== 'admin') {
      showToast(`Access Restricted: Signed in as ${user.role.toUpperCase()}. You need a ${requiredRole.toUpperCase()} account to access this tool.`, 'error');
      return;
    }
    navigate(path);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* College Project Exhibition Ribbon */}
      <div className="bg-[#14532D] text-[#ECFDF5] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap border-b border-[#14532D]/30">
        <span className="bg-[#0f3d21] text-[#ECFDF5] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
          College Innovation Exhibition
        </span>
        <span>Category: <strong className="text-white">Sustainability & Environment</strong></span>
        <span>•</span>
        <span className="text-[#ECFDF5]/90">Theme: <em>"Technology for a Sustainable and Smarter Future"</em></span>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-12">
        <div className="text-center max-w-3.5xl mx-auto space-y-6">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[#14532D] text-xs font-bold font-heading border border-emerald-950/10 shadow-[0_2px_12px_-2px_rgba(20,83,45,0.08)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            <span>Smart Food Redistribution Network</span>
            <span className="text-gray-300">|</span>
            <span className="text-[#16A34A] font-semibold">AI Powered</span>
          </div>

          {/* Hero Heading: Striking, elegant, without any underlines */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-[#1F2937] tracking-tight leading-[1.12]">
            Don't Waste Food.{' '}
            <span className="bg-gradient-to-r from-[#14532D] via-[#16A34A] to-emerald-600 bg-clip-text text-transparent block sm:inline">
              Share Hope.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-2xl mx-auto">
            An intelligent platform connecting restaurants, college canteens, and caterers with orphanages and community shelters. Powered by algorithmic multi-factor matching to eliminate food wastage before it spoils.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => handleRoleAction('donor', '/add-donation')}
              className="px-7 py-3.5 rounded-2xl bg-[#14532D] hover:bg-[#0f3d21] text-white font-heading font-bold text-sm shadow-md shadow-[#14532D]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Utensils className="w-4 h-4 text-[#ECFDF5]" />
              <span>Donate Surplus Food</span>
            </button>

            <button
              onClick={() => handleRoleAction('receiver', '/receiver-dashboard')}
              className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#ECFDF5] text-[#14532D] font-heading font-bold text-sm border border-emerald-950/10 hover:border-[#16A34A]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-[#16A34A]" />
              <span>Find Food (Receivers)</span>
            </button>

            <Link
              to="/matching"
              className="px-6 py-3.5 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] font-heading font-bold text-sm border border-[#F59E0B]/30 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Explore AI Matching</span>
            </Link>
          </div>

          {/* Key Value Micro-pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Zero external paid APIs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Dynamic 4-Factor Matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>FSSAI Hygiene Compliant</span>
            </div>
          </div>
        </div>

        {/* Live Real-Time Impact Statistics Section: 4 Distinct Aesthetic Cards */}
        <div className="mt-14 max-w-5xl mx-auto space-y-4">
          <div className="text-center">
            <span className="text-[11px] font-bold font-heading text-[#14532D] uppercase tracking-wider bg-[#ECFDF5] px-3.5 py-1 rounded-full border border-[#16A34A]/20 shadow-2xs">
              Live Real-Time Impact Statistics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] text-center space-y-1 hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                <Package className="w-4.5 h-4.5" />
              </div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#14532D] tracking-tight">
                {stats.total_donations}
              </p>
              <p className="text-xs font-semibold text-gray-500">Donations Listed</p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] text-center space-y-1 hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                <Utensils className="w-4.5 h-4.5" />
              </div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#16A34A] tracking-tight">
                {stats.total_meals_redistributed}+
              </p>
              <p className="text-xs font-semibold text-gray-500">Meals Redistributed</p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] text-center space-y-1 hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mx-auto mb-2 border border-amber-200">
                <ChefHat className="w-4.5 h-4.5" />
              </div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">
                {stats.active_donors}
              </p>
              <p className="text-xs font-semibold text-gray-500">Active Food Donors</p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] text-center space-y-1 hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                <HeartHandshake className="w-4.5 h-4.5" />
              </div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-purple-700 tracking-tight">
                {stats.active_receivers}
              </p>
              <p className="text-xs font-semibold text-gray-500">Shelters & NGOs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluator Quick Demo Fast Track */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#0F3820] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14532D]/40">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FFFBEB] font-bold text-[11px] uppercase tracking-wider mb-1 border border-white/15">
              <span>⚡ Project Evaluator Fast Track</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Instantly Test Any Role with 1 Click</h3>
            <p className="text-[#ECFDF5]/85 text-xs max-w-xl leading-relaxed">
              Pre-seeded with real regional data across Manipal & Udupi (donors, shelters, urgency levels, and full database records).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => handleRoleAction('donor', '/donor-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#14532D] font-heading font-bold text-xs hover:bg-[#ECFDF5] transition shadow-xs cursor-pointer active:scale-95"
            >
              🍲 Donor (MIT Canteen)
            </button>
            <button
              onClick={() => handleRoleAction('receiver', '/receiver-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs transition shadow-xs cursor-pointer active:scale-95"
            >
              🏠 Receiver (Hope Shelter)
            </button>
            <button
              onClick={() => handleRoleAction('admin', '/admin-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-heading font-bold text-xs transition shadow-xs cursor-pointer active:scale-95"
            >
              🛡️ Admin Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#16A34A]/20">
            Intelligent Workflow
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            How FoodBridge AI Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            A technology-enabled pipeline transforming surplus food into life-saving meals in 4 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Donors List Surplus Food',
              desc: 'Canteens, restaurants, and caterers list excess food with quantity, dietary type, storage condition, and consumption deadline.',
              icon: Utensils,
            },
            {
              step: '02',
              title: 'AI Matches & Prioritizes',
              desc: 'Our 4-factor algorithm calculates compatibility scores based on Location (40%), Quantity (25%), Urgency (25%), and Dietary Needs (10%).',
              icon: Sparkles,
            },
            {
              step: '03',
              title: 'Receivers Request Food',
              desc: 'NGOs and shelters review ranked matches, submit requests for required quantities, and get notified immediately upon approval.',
              icon: HeartHandshake,
            },
            {
              step: '04',
              title: 'Collected & Tracked',
              desc: 'Volunteers collect the food following safety hygiene protocols, and the donation moves to Completed status with verified impact metrics.',
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-2xl font-black text-gray-300">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#14532D] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#16A34A]" />
                    </div>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#14532D]">
                  <Link to="/matching" className="flex items-center gap-1 hover:text-[#16A34A] transition">
                    <span>Explore logic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Available Food Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#16A34A]/20">
              Surplus Feed
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1.5">
              Recently Listed Surplus Food
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Active listings ready for immediate pickup and redistribution in the Manipal-Udupi cluster.
            </p>
          </div>
          <Link
            to="/available-food"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] hover:text-[#0f3d21] bg-[#ECFDF5] hover:bg-[#d1fae5] px-4 py-2 rounded-xl transition"
          >
            <span>View All Available Food</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <SafetyBanner compact />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {featuredDonations.map((d) => (
            <FoodCard key={d.id} donation={d} />
          ))}
        </div>
      </section>

      {/* Environmental & Social Impact Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1F2937] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-gray-800 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-emerald-400 text-xs font-bold border border-gray-700">
              <Globe className="w-3.5 h-3.5" />
              <span>United Nations Sustainable Development Goals</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Combating Climate Change Through Smart Food Waste Prevention
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              Food waste generates approximately 8–10% of global greenhouse gas emissions. When food decomposes anaerobically in municipal landfills, it converts into methane—a potent greenhouse gas. FoodBridge AI transforms this ecological hazard into direct community nutrition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="font-heading text-2xl font-black text-[#16A34A] font-mono">
                  {stats.estimated_co2_saved_kg || 660} kg
                </p>
                <p className="text-xs text-gray-300 font-semibold mt-1">CO₂e Emissions Prevented</p>
                <p className="text-[10px] text-gray-400 mt-0.5">~2.5 kg CO₂e per meal (UNEP)</p>
              </div>

              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="font-heading text-2xl font-black text-cyan-400 font-mono">
                  {(stats.total_meals_redistributed * 350).toLocaleString()} L
                </p>
                <p className="text-xs text-gray-300 font-semibold mt-1">Water Footprint Conserved</p>
                <p className="text-[10px] text-gray-400 mt-0.5">~350 liters per meal (FAO)</p>
              </div>

              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="font-heading text-2xl font-black text-[#F59E0B] font-mono">
                  {stats.estimated_people_fed || 265}
                </p>
                <p className="text-xs text-gray-300 font-semibold mt-1">People Nourished</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Orphanages & destitute shelters</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/impact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-xs"
              >
                <span>Explore Full Sustainability Impact Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
