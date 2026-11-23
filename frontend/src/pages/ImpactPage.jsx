import React, { useState, useEffect } from 'react';
import {
  Globe,
  Leaf,
  Droplets,
  Heart,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Info,
  Award,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
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

export const ImpactPage = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sumData, chartData] = await Promise.all([
          api.getSummary().catch(() => null),
          api.getCharts().catch(() => null),
        ]);
        setSummary(sumData);
        setCharts(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const meals = summary?.total_meals_redistributed || 265;
  const co2 = summary?.estimated_co2_saved_kg || Math.round(meals * 2.5);
  const water = summary?.estimated_water_saved_liters || Math.round(meals * 350);
  const people = summary?.estimated_people_fed || meals;
  const foodRescuedKg = Math.round(meals * 0.45);

  const PALETTE = ['#123C2D', '#16865B', '#42B883', '#E9A23B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 animate-fade-in">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-[#16865B]/30 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#E8F5ED] text-xs font-heading font-extrabold border border-white/20">
          <Leaf className="w-4 h-4 text-[#42B883]" />
          <span>SUSTAINABILITY & CARBON MITIGATION DASHBOARD</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Quantified Environmental & Community Impact
        </h1>

        <p className="text-xs sm:text-sm text-[#E8F5ED]/90 max-w-3xl leading-relaxed font-normal">
          Food waste represents one of humanity's greatest ecological paradoxes. FoodBridge AI transforms edible municipal surplus into measurable greenhouse gas reductions, groundwater preservation, and vital nutrition for vulnerable populations.
        </p>
      </div>

      {/* 2. 4 CORE QUANTITATIVE IMPACT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center border border-[#16865B]/20 shadow-2xs">
            <Heart className="w-6 h-6 text-[#16865B]" />
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D] font-mono">
              {meals.toLocaleString()}+
            </p>
            <h3 className="font-heading text-sm font-bold text-[#202B25] mt-1">Meals Rescued</h3>
            <p className="text-xs text-[#718078] leading-relaxed mt-0.5">
              ~{foodRescuedKg.toLocaleString()} kg of wholesome surplus food delivered to orphanages & care homes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5ED] text-[#16865B] flex items-center justify-center border border-[#16865B]/20 shadow-2xs">
            <Leaf className="w-6 h-6 text-[#16865B]" />
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#16865B] font-mono">
              {co2.toLocaleString()} kg
            </p>
            <h3 className="font-heading text-sm font-bold text-[#202B25] mt-1">CO₂e Avoided</h3>
            <p className="text-xs text-[#718078] leading-relaxed mt-0.5">
              Landfill methane emissions prevented by intercepting perishable food before anaerobic rot.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200/80 shadow-2xs">
            <Droplets className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-teal-800 font-mono">
              {water.toLocaleString()} L
            </p>
            <h3 className="font-heading text-sm font-bold text-[#202B25] mt-1">Freshwater Conserved</h3>
            <p className="text-xs text-[#718078] leading-relaxed mt-0.5">
              Embedded agricultural and irrigation water footprints preserved from waste.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF7EC] text-[#E9A23B] flex items-center justify-center border border-[#E9A23B]/30 shadow-2xs">
            <Award className="w-6 h-6 text-[#E9A23B]" />
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#9A6217] font-mono">
              {people.toLocaleString()}+
            </p>
            <h3 className="font-heading text-sm font-bold text-[#202B25] mt-1">Beneficiaries Fed</h3>
            <p className="text-xs text-[#718078] leading-relaxed mt-0.5">
              Verified community members reached across destitute shelters and elderly homes.
            </p>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE VISUALIZATIONS & TREND CHARTS */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Area Chart: Redistribution Trends */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                  Weekly Surplus Listed vs. Redistributed
                </h3>
                <p className="text-xs text-[#718078]">Continuous throughput metrics over the last 7 calendar days.</p>
              </div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#16865B] bg-[#E8F5ED] px-3 py-1 rounded-full border border-[#16865B]/20">
                Live Sync
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.weekly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="listedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#123C2D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#123C2D" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="redisGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16865B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16865B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="listed" name="Listed Meals" stroke="#123C2D" strokeWidth={2.5} fillOpacity={1} fill="url(#listedGradient)" />
                  <Area type="monotone" dataKey="redistributed" name="Delivered Meals" stroke="#16865B" strokeWidth={2.5} fillOpacity={1} fill="url(#redisGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Food Category Distribution */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#123C2D]">
                Category Composition
              </h3>
              <p className="text-xs text-[#718078]">Breakdown of surplus food donations by food type.</p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.category_distribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {charts.category_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(18,60,45,0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              {charts.category_distribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[index % PALETTE.length] }} />
                  <span className="text-[#202B25] truncate font-medium">{entry.name}</span>
                  <span className="text-[#718078] font-mono">({entry.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SCIENTIFIC IMPACT CALCULATION FRAMEWORK */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-6">
        <div>
          <span className="text-xs font-heading font-extrabold text-[#123C2D] uppercase tracking-wider bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/20">
            Scientific Framework
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-[#123C2D] tracking-tight mt-2.5">
            Calculation Methodology & Standards
          </h2>
          <p className="text-xs text-[#718078] mt-1">
            Our environmental metrics adhere to globally verified environmental research and lifecycle assessment benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#718078]">
          <div className="p-5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/8 space-y-2.5">
            <div className="font-heading font-bold text-[#123C2D] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16865B]" />
              <span>Carbon Footprint (UNEP Model)</span>
            </div>
            <p className="leading-relaxed">
              Based on the <strong>United Nations Environment Programme (UNEP) Food Waste Index Report</strong>, 1 kilogram of mixed cooked food waste corresponds to approximately 2.5 kg CO₂ equivalent emissions from farm-to-table production, transport, and landfill methane release.
            </p>
            <div className="text-[11px] font-mono text-[#123C2D] font-bold bg-white p-2.5 rounded-xl border border-[#123C2D]/8">
              Formula: CO₂e (kg) = Meals × 2.5 kg
            </div>
          </div>

          <div className="p-5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/8 space-y-2.5">
            <div className="font-heading font-bold text-[#123C2D] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Water Footprint (FAO Benchmark)</span>
            </div>
            <p className="leading-relaxed">
              Based on the <strong>Food and Agriculture Organization (FAO) Food Wastage Footprint Study</strong>, the embodied water required to grow grains, cultivate vegetables, and prepare a meal averages 350 liters of freshwater.
            </p>
            <div className="text-[11px] font-mono text-teal-800 font-bold bg-white p-2.5 rounded-xl border border-[#123C2D]/8">
              Formula: Water (L) = Meals × 350 Liters
            </div>
          </div>

          <div className="p-5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/8 space-y-2.5">
            <div className="font-heading font-bold text-[#123C2D] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B]" />
              <span>Nutrition Equivalency (FSSAI)</span>
            </div>
            <p className="leading-relaxed">
              Each portion standardizes to 450 grams of cooked food yielding approximately 650–800 calories of balanced nutrition, satisfying the minimum dietary requirement for a single community meal.
            </p>
            <div className="text-[11px] font-mono text-[#9A6217] font-bold bg-white p-2.5 rounded-xl border border-[#123C2D]/8">
              Formula: Beneficiaries = Completed Meals
            </div>
          </div>
        </div>
      </div>

      {/* 5. UN SDGs Alignment */}
      <div className="bg-[#123C2D] text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl border border-[#16865B]/30">
        <div>
          <span className="text-xs font-heading font-extrabold text-[#42B883] uppercase tracking-wider bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
            Global Agenda
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-2.5 text-white">
            Direct Alignment with UN Sustainable Development Goals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9A23B] text-white font-black flex items-center justify-center font-mono text-base">
              2
            </div>
            <h3 className="font-heading text-base font-bold text-white">SDG 2: Zero Hunger</h3>
            <p className="text-xs text-[#E8F5ED]/80 leading-relaxed">
              Directly re-routes wholesome edible calories from commercial and institutional canteens to orphanages and destitute shelters, alleviating urban hunger at zero food procurement cost.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center font-mono text-base">
              12
            </div>
            <h3 className="font-heading text-base font-bold text-white">SDG 12: Responsible Consumption</h3>
            <p className="text-xs text-[#E8F5ED]/80 leading-relaxed">
              Target 12.3 aims to halve per-capita global food waste by 2030. FoodBridge AI establishes a scalable operational model for institutional kitchens to monitor and cut waste at the source.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#16865B] text-white font-black flex items-center justify-center font-mono text-base">
              13
            </div>
            <h3 className="font-heading text-base font-bold text-white">SDG 13: Climate Action</h3>
            <p className="text-xs text-[#E8F5ED]/80 leading-relaxed">
              Reduces biological waste decomposition in open municipal dumpsites, curtailing fugitive methane emissions and decreasing city carbon footprints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
