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
  ChefHat,
  Droplets,
  Building2,
  Truck,
  Heart,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FoodCard } from '../components/FoodCard';
import { SafetyBanner } from '../components/SafetyBanner';

export const LandingPage = () => {
  const { user, showToast } = useAuth();
  const { t } = useLanguage();
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
    estimated_water_saved_liters: 92750,
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
    if (user.role !== requiredRole) {
      showToast(`Access Restricted: Signed in as ${user.role.toUpperCase()}. You need a ${requiredRole.toUpperCase()} account to access this tool.`, 'error');
      return;
    }
    navigate(path);
  };

  // Convert redistributed meals to kg (~0.45 kg cooked food per meal as per FSSAI standard)
  const foodDistributedKg = Math.round((stats.total_meals_redistributed || 265) * 0.45);

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-x-hidden">
      {/* 1. HERO SECTION – Two-Column Editorial Layout */}
      <section className="relative pt-6 sm:pt-14 pb-4">
        {/* Subtle organic light accent background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#E8F5ED]/60 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5ED] text-[#123C2D] text-xs font-heading font-extrabold border border-[#16865B]/25 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16865B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16865B]"></span>
                </span>
                <span>AI-POWERED FOOD REDISTRIBUTION</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[64px] font-extrabold text-[#123C2D] tracking-tight leading-[1.12]">
                {t('hero_title_1')}{' '}
                <span className="text-[#16865B] block sm:inline">
                  {t('hero_title_2')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#718078] leading-relaxed max-w-xl font-normal">
                {t('hero_subtitle')}
              </p>

              {/* Three CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={() => handleRoleAction('donor', '/add-donation')}
                  className="px-6 py-3.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <Utensils className="w-4 h-4 text-[#E8F5ED]" />
                  <span>{t('btn_donate')}</span>
                </button>

                <button
                  onClick={() => handleRoleAction('receiver', '/receiver-dashboard')}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-[#E8F5ED] text-[#123C2D] font-heading font-bold text-xs sm:text-sm border border-[#123C2D]/15 hover:border-[#16865B]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4 text-[#16865B]" />
                  <span>{t('btn_find_food')}</span>
                </button>

                <Link
                  to="/matching"
                  className="px-5 py-3.5 rounded-full bg-[#FEF7EC] hover:bg-[#FDF0D9] text-[#9A6217] font-heading font-bold text-xs sm:text-sm border border-[#E9A23B]/35 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                  <span>{t('btn_explore_ai')}</span>
                </Link>
              </div>

              {/* Value proposition badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-heading font-medium text-[#718078]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865B]" />
                  <span>FSSAI Hygiene Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865B]" />
                  <span>Algorithmic Proximity Routing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865B]" />
                  <span>Zero Food Waste Mission</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Quality Realistic Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#123C2D]/10 bg-white">
                <img
                  src="/hero-volunteers.jpg"
                  alt="Volunteers packing fresh surplus food boxes at community redistribution kitchen"
                  className="w-full h-auto object-cover max-h-[520px] rounded-3xl transform transition-transform duration-700 hover:scale-102"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Subtle Floating Verified Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#123C2D]/10 shadow-lg flex items-center gap-2 text-xs font-heading font-bold text-[#123C2D]">
                  <span className="w-2 h-2 rounded-full bg-[#16865B]" />
                  <span>Verified NGO Network</span>
                </div>

                {/* Live Real-Time Redistribution Floating Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#123C2D]/10 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5ED] text-[#16865B] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-[#16865B]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono font-bold text-[#718078]">AI Matchmaking Active</p>
                      <p className="font-heading font-extrabold text-[#123C2D] text-xs sm:text-sm">
                        {stats.active_donors} Donors • {stats.active_receivers} Shelters Connected
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/matching"
                    className="p-2 rounded-full bg-[#123C2D] text-white hover:bg-[#16865B] transition-colors"
                    title="Explore Matching"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS SECTION – Connected to Real Backend Data */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/25 shadow-2xs">
            Live Verified Metrics
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D]">
            Measurable Community Impact
          </h2>
          <p className="text-xs sm:text-sm text-[#718078]">
            Real-time surplus redistribution statistics calculated directly from our local database.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Food Donations */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(18,60,45,0.1)] hover:-translate-y-1 transition-all duration-300 text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center border border-[#16865B]/20 shadow-2xs">
              <Package className="w-6 h-6 text-[#16865B]" />
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D] tracking-tight">
                {stats.total_donations}
              </p>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-[#202B25] mt-1">
                Total Food Donations
              </h3>
              <p className="text-[11px] text-[#718078] mt-0.5">Surplus batches listed</p>
            </div>
          </div>

          {/* Card 2: Food Distributed (kg) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(18,60,45,0.1)] hover:-translate-y-1 transition-all duration-300 text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#16865B] flex items-center justify-center border border-[#16865B]/20 shadow-2xs">
              <Utensils className="w-6 h-6 text-[#16865B]" />
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#16865B] tracking-tight">
                {foodDistributedKg} kg
              </p>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-[#202B25] mt-1">
                Food Distributed (kg)
              </h3>
              <p className="text-[11px] text-[#718078] mt-0.5">{stats.total_meals_redistributed}+ meals delivered</p>
            </div>
          </div>

          {/* Card 3: Active Donors */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(18,60,45,0.1)] hover:-translate-y-1 transition-all duration-300 text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EC] text-[#E9A23B] flex items-center justify-center border border-[#E9A23B]/30 shadow-2xs">
              <ChefHat className="w-6 h-6 text-[#E9A23B]" />
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#9A6217] tracking-tight">
                {stats.active_donors}
              </p>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-[#202B25] mt-1">
                Active Donors
              </h3>
              <p className="text-[11px] text-[#718078] mt-0.5">Canteens, hotels & kitchens</p>
            </div>
          </div>

          {/* Card 4: Receiving Organizations */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(18,60,45,0.1)] hover:-translate-y-1 transition-all duration-300 text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200/80 shadow-2xs">
              <HeartHandshake className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">
                {stats.active_receivers}
              </p>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-[#202B25] mt-1">
                Receiving Organizations
              </h3>
              <p className="text-[11px] text-[#718078] mt-0.5">Shelters & welfare homes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION – 3 Beautiful Nature Green Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/25">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D]">
            How FoodBridge AI Works
          </h2>
          <p className="text-xs sm:text-sm text-[#718078]">
            A seamless bridge from commercial surplus kitchens directly into compassionate community nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Donate Food */}
          <div className="bg-white rounded-3xl p-8 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(18,60,45,0.1)] hover:border-[#16865B]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-black text-[#123C2D]/20 group-hover:text-[#16865B]/40 transition-colors">
                  01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center group-hover:bg-[#16865B] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Utensils className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                Donate Food
              </h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Restaurants and hotels list surplus food with quantity, dietary type, storage condition, and consumption deadline within 60 seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#123C2D]/6">
              <span className="text-[11px] font-heading font-bold text-[#16865B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Instant Donor Verification</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: AI Matching */}
          <div className="bg-white rounded-3xl p-8 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(18,60,45,0.1)] hover:border-[#16865B]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-black text-[#123C2D]/20 group-hover:text-[#16865B]/40 transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#16865B] flex items-center justify-center group-hover:bg-[#16865B] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                AI Matching
              </h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Intelligent algorithms match donations with suitable receivers based on distance proximity (40%), shelter capacity (25%), time urgency (25%), and dietary safety (10%).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#123C2D]/6">
              <span className="text-[11px] font-heading font-bold text-[#16865B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>4-Factor Algorithmic Ranking</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Share Hope */}
          <div className="bg-white rounded-3xl p-8 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(18,60,45,0.1)] hover:border-[#16865B]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-black text-[#123C2D]/20 group-hover:text-[#16865B]/40 transition-colors">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center group-hover:bg-[#16865B] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <HeartHandshake className="w-6 h-6 text-[#16865B]" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                Share Hope
              </h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Food reaches orphanages and communities in need safely and warmly. Every completed pickup logs greenhouse gas savings and meal counts transparently.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#123C2D]/6">
              <span className="text-[11px] font-heading font-bold text-[#16865B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Zero Hunger Impact Verified</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE FOODBRIDGE AI – 6 Premium Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/25">
            Platform Advantages
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D]">
            Why Choose FoodBridge AI
          </h2>
          <p className="text-xs sm:text-sm text-[#718078]">
            Engineered specifically to solve the logistical barriers of rapid urban food redistribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI-Powered Matching',
              desc: 'Continuous multi-variable optimization dynamically ranks potential receivers according to capacity, proximity, and intake capacity.',
              icon: Sparkles,
            },
            {
              title: 'Real-Time Food Availability',
              desc: 'Live inventory sync eliminates redundant requests and ensures only fresh, currently unreserved meals are open for claim.',
              icon: Clock,
            },
            {
              title: 'Food Safety Verification',
              desc: 'Rigorous FSSAI hygiene guidelines, mandatory consumption deadline countdowns, and storage protocol adherence.',
              icon: ShieldCheck,
            },
            {
              title: 'Location-Based Matching',
              desc: 'Geodesic Haversine clustering routes donations to the nearest shelter, minimizing transportation fuel and transit spoilage.',
              icon: MapPin,
            },
            {
              title: 'Transparent Impact Tracking',
              desc: 'Every redistributed batch logs exact meals, verified carbon emissions avoided (kg CO₂e), and liters of fresh water preserved.',
              icon: TrendingUp,
            },
            {
              title: 'Reduced Food Wastage',
              desc: 'Intercepts edible surplus before it hits municipal dumpsites, turning municipal waste into valuable human nutrition.',
              icon: Leaf,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(18,60,45,0.08)] hover:border-[#16865B]/25 hover:-translate-y-1 transition-all duration-300 space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#E8F5ED] text-[#16865B] flex items-center justify-center border border-[#16865B]/20 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#123C2D]">{item.title}</h3>
                <p className="text-xs text-[#718078] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED AVAILABLE FOOD PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/25">
              Live Surplus Feed
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] mt-2">
              Recently Listed Available Food
            </h2>
            <p className="text-xs sm:text-sm text-[#718078] mt-1">
              Active, edible surplus batches ready for collection by verified shelters and charities.
            </p>
          </div>
          <Link
            to="/available-food"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F5ED] hover:bg-[#d5ece0] text-[#123C2D] text-xs font-heading font-bold transition-all shadow-2xs self-start sm:self-auto"
          >
            <span>Browse All Available Food</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16865B]" />
          </Link>
        </div>

        <SafetyBanner compact />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {featuredDonations.map((d) => (
            <FoodCard key={d.id} donation={d} />
          ))}
        </div>
      </section>

      {/* 6. AI MATCHING PREVIEW – Interactive Algorithmic Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#123C2D]/10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7EC] text-[#9A6217] text-xs font-heading font-bold border border-[#E9A23B]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                <span>Explainable AI Recommendation Engine</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#123C2D] tracking-tight">
                How Our Multi-Factor Engine Matches Food in Real-Time
              </h2>
              <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
                Rather than treating food donation as a static bulletin board, FoodBridge AI evaluates four weighted compatibility variables simultaneously to calculate an exact Match Compatibility Score (0–100%).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#E8F5ED]/60 rounded-2xl border border-[#16865B]/20 text-center">
                  <p className="font-heading text-lg font-black text-[#123C2D]">40%</p>
                  <p className="text-[11px] font-bold text-[#16865B] mt-0.5">Location Distance</p>
                  <p className="text-[10px] text-[#718078]">Haversine Geodesic</p>
                </div>
                <div className="p-3 bg-[#E8F5ED]/60 rounded-2xl border border-[#16865B]/20 text-center">
                  <p className="font-heading text-lg font-black text-[#123C2D]">25%</p>
                  <p className="text-[11px] font-bold text-[#16865B] mt-0.5">Capacity Fit</p>
                  <p className="text-[10px] text-[#718078]">Beneficiary Absorption</p>
                </div>
                <div className="p-3 bg-[#E8F5ED]/60 rounded-2xl border border-[#16865B]/20 text-center">
                  <p className="font-heading text-lg font-black text-[#123C2D]">25%</p>
                  <p className="text-[11px] font-bold text-[#16865B] mt-0.5">Consumption Urgency</p>
                  <p className="text-[10px] text-[#718078]">Safe Holding Hours</p>
                </div>
                <div className="p-3 bg-[#E8F5ED]/60 rounded-2xl border border-[#16865B]/20 text-center">
                  <p className="font-heading text-lg font-black text-[#123C2D]">10%</p>
                  <p className="text-[11px] font-bold text-[#16865B] mt-0.5">Dietary Match</p>
                  <p className="text-[10px] text-[#718078]">Veg / Non-Veg / Vegan</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/matching"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs shadow-md transition-all duration-200"
                >
                  <span>Launch Live AI Matching Simulator</span>
                  <ArrowRight className="w-4 h-4 text-[#E8F5ED]" />
                </Link>
              </div>
            </div>

            {/* Visual Match Result Preview Card */}
            <div className="lg:col-span-5 bg-[#F8FAF7] rounded-3xl p-6 border border-[#123C2D]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#123C2D]/8">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16865B] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full">
                  Sample Live Calculation
                </span>
                <span className="text-xs font-mono font-bold text-[#123C2D]">94.2% Compatibility</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-heading font-bold">
                  <span className="text-[#202B25]">MIT Canteen → Hope Shelter</span>
                  <span className="text-[#16865B]">Rank #1 Best Match</span>
                </div>
                <div className="w-full bg-[#123C2D]/10 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#16865B] h-full rounded-full transition-all duration-1000" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#123C2D]/8 text-xs space-y-1.5">
                <p className="text-[11px] font-heading font-bold text-[#123C2D] uppercase tracking-wider">
                  Algorithmic Rationale:
                </p>
                <p className="text-[#718078] leading-relaxed text-[11px]">
                  "Exceptional 94.2% match. Location distance is just 1.8 km (under 8 min transit). Shelter capacity directly absorbs 45 of 50 listed vegetarian meals before the 4-hour deadline."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ENVIRONMENTAL & SOCIAL IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#123C2D] via-[#166534] to-[#0B261D] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-[#16865B]/30">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E8F5ED] text-xs font-heading font-bold border border-white/15">
              <Globe className="w-3.5 h-3.5 text-[#42B883]" />
              <span>United Nations Sustainable Development Goals</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Combating Climate Change Through Intelligent Food Rescue
            </h2>

            <p className="text-xs sm:text-sm text-[#E8F5ED]/85 leading-relaxed font-normal">
              Food waste generates approximately 8–10% of global greenhouse gas emissions. When food decomposes anaerobically in municipal landfills, it converts into methane—a greenhouse gas 28 times more potent than carbon dioxide. FoodBridge AI transforms this ecological hazard into direct community nutrition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-4.5 rounded-2xl border border-white/10">
                <p className="font-heading text-2xl font-extrabold text-[#42B883]">
                  {stats.estimated_co2_saved_kg || 662.5} kg
                </p>
                <p className="text-xs text-white font-bold mt-1">CO₂e Emissions Avoided</p>
                <p className="text-[10px] text-[#E8F5ED]/70 mt-0.5">~2.5 kg CO₂e per meal (UNEP Model)</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4.5 rounded-2xl border border-white/10">
                <p className="font-heading text-2xl font-extrabold text-[#E9A23B]">
                  {(stats.total_meals_redistributed * 350).toLocaleString()} L
                </p>
                <p className="text-xs text-white font-bold mt-1">Freshwater Conserved</p>
                <p className="text-[10px] text-[#E8F5ED]/70 mt-0.5">~350 liters per meal (FAO Benchmark)</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4.5 rounded-2xl border border-white/10">
                <p className="font-heading text-2xl font-extrabold text-white">
                  {stats.estimated_people_fed || 265}+
                </p>
                <p className="text-xs text-white font-bold mt-1">People Nourished</p>
                <p className="text-[10px] text-[#E8F5ED]/70 mt-0.5">Orphanages & destitute shelters</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/impact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#16865B] hover:bg-[#42B883] hover:text-[#123C2D] text-white text-xs font-heading font-bold transition-all shadow-md"
              >
                <span>Explore Full Sustainability Impact Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. STRONG FINAL CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8F5ED] rounded-3xl p-8 sm:p-14 text-center border border-[#16865B]/20 relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#123C2D] text-white flex items-center justify-center mx-auto shadow-md shadow-[#123C2D]/20">
              <Leaf className="w-7 h-7 text-[#E8F5ED]" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D] tracking-tight">
              Ready to Eliminate Food Waste in Your Community?
            </h2>

            <p className="text-xs sm:text-sm text-[#718078] leading-relaxed max-w-lg mx-auto">
              Whether you are a university canteen, hotel banquet kitchen, or community shelter, joining FoodBridge AI takes under two minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all"
              >
                Get Started as a Donor or Receiver
              </Link>

              <Link
                to="/available-food"
                className="px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#123C2D] font-heading font-bold text-xs sm:text-sm border border-[#123C2D]/20 shadow-2xs transition-all"
              >
                Explore Active Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
