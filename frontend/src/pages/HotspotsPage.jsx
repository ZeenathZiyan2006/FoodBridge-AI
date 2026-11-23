import React, { useState, useEffect } from 'react';
import {
  Flame,
  MapPin,
  Utensils,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Truck,
  Building2,
  Navigation,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../services/api';

export const HotspotsPage = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const loadHotspots = async () => {
      try {
        const data = await api.getHotspots();
        setHotspots(data || []);
        if (data && data.length > 0) {
          setSelectedLocation(data[0].location);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHotspots();
  }, []);

  const REGIONAL_NODES = [
    { name: 'Manipal', coords: '13.3525° N, 74.7928° E', type: 'University & Canteen Cluster', radiusKm: 3.5 },
    { name: 'Udupi', coords: '13.3409° N, 74.7421° E', type: 'Temple & Commercial Kitchens', radiusKm: 4.2 },
    { name: 'Santhekatte', coords: '13.3712° N, 74.7380° E', type: 'Convention & Banquet Halls', radiusKm: 2.8 },
    { name: 'Malpe', coords: '13.3489° N, 74.7042° E', type: 'Coastal Fisheries & Markets', radiusKm: 3.0 },
    { name: 'Brahmavar', coords: '13.4350° N, 74.7485° E', type: 'Agricultural & Produce Hub', radiusKm: 5.0 },
  ];

  const activeHotspot = hotspots.find((h) => h.location === selectedLocation) || hotspots[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-[#16865B]/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#E8F5ED] text-xs font-heading font-extrabold border border-white/20">
          <Flame className="w-4 h-4 text-[#E9A23B]" />
          <span>SPATIAL SURPLUS INTELLIGENCE</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Food Waste Hotspot Analysis
        </h1>
        <p className="text-xs sm:text-sm text-[#E8F5ED]/90 max-w-3xl leading-relaxed font-normal">
          Identifies high-density geographic nodes where significant volumes of surplus food are recurringly generated. This geospatial intelligence enables volunteer logistics networks and community food vans to pre-position collection routes and minimize transit latency.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#718078] text-sm space-y-3">
          <div className="inline-block w-8 h-8 border-3 border-[#16865B] border-t-transparent rounded-full animate-spin" />
          <p>Analyzing regional food waste patterns across geographic nodes...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 2. INTERACTIVE GEOGRAPHIC CLUSTER SELECTOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#123C2D] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#16865B]" />
                  <span>Geospatial Hotspot Map & Node Inspector</span>
                </h3>
                <p className="text-xs text-[#718078]">Click any regional node to inspect surplus volume, donor density, and dispatch recommendation.</p>
              </div>

              <span className="text-[11px] font-heading font-extrabold text-[#16865B] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/20 self-start sm:self-auto">
                Manipal - Udupi Regional Pilot
              </span>
            </div>

            {/* Interactive Node Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {REGIONAL_NODES.map((node) => {
                const isSelected = selectedLocation === node.name;
                const matchHotspot = hotspots.find((h) => h.location.toLowerCase() === node.name.toLowerCase());
                return (
                  <button
                    key={node.name}
                    type="button"
                    onClick={() => setSelectedLocation(node.name)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#123C2D] text-white border-[#123C2D] shadow-md scale-102'
                        : 'bg-[#F8FAF7] hover:bg-[#E8F5ED] text-[#202B25] border-[#123C2D]/8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-extrabold text-sm">{node.name}</span>
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#42B883]' : 'text-[#16865B]'}`} />
                    </div>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-[#E8F5ED]/80' : 'text-[#718078]'}`}>
                      {node.type}
                    </p>
                    <p className={`text-xs font-mono font-bold mt-2 ${isSelected ? 'text-[#42B883]' : 'text-[#16865B]'}`}>
                      {matchHotspot ? `${matchHotspot.total_meals} meals` : 'Active Node'}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Node Active Inspector Box */}
            {activeHotspot && (
              <div className="p-5 bg-[#E8F5ED] rounded-2xl border border-[#16865B]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#123C2D] bg-white px-2.5 py-0.5 rounded-full border border-[#16865B]/20">
                      Active Inspector Node
                    </span>
                    <span className="text-xs font-heading font-bold text-[#16865B]">{activeHotspot.location}</span>
                  </div>
                  <p className="font-heading text-lg font-bold text-[#123C2D]">
                    {activeHotspot.total_meals} Meals from {activeHotspot.donation_count} Surplus Batches
                  </p>
                  <p className="text-xs text-[#718078]">
                    Primary Surplus Category: <strong className="text-[#202B25]">{activeHotspot.top_category}</strong> • Active Donor Kitchens: <strong className="text-[#202B25]">{activeHotspot.active_donors_count}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2 rounded-xl border border-[#16865B]/20 text-center shadow-2xs">
                    <span className="text-[10px] font-heading font-bold text-[#718078] uppercase block">Van Route Priority</span>
                    <span className="text-xs font-heading font-extrabold text-[#16865B] flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16865B]" />
                      Tier 1 Scheduled
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. HOTSPOTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotspots.map((h, idx) => (
              <div
                key={h.location}
                className="bg-white rounded-3xl p-6 border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.04)] hover:shadow-xl hover:border-[#16865B]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-2xl bg-[#E8F5ED] text-[#123C2D] font-mono font-extrabold text-xs flex items-center justify-center border border-[#16865B]/20">
                      #{idx + 1}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[11px] font-heading font-semibold bg-[#F8FAF7] text-[#718078] border border-[#123C2D]/6">
                      Top: {h.top_category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-[#123C2D] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#E9A23B] shrink-0" />
                      <span>{h.location}</span>
                    </h3>
                    <p className="text-xs text-[#718078] mt-0.5">Regional Waste Generation Cluster</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/6">
                      <span className="text-[#718078] text-[10px] uppercase font-heading font-bold tracking-wider block">Total Volume</span>
                      <span className="font-heading text-2xl font-black text-[#123C2D] font-mono mt-0.5 block">{h.total_meals}</span>
                      <span className="text-[10px] text-[#718078] block">Meals Recorded</span>
                    </div>

                    <div className="p-3.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/6">
                      <span className="text-[#718078] text-[10px] uppercase font-heading font-bold tracking-wider block">Batches</span>
                      <span className="font-heading text-2xl font-black text-[#16865B] font-mono mt-0.5 block">{h.donation_count}</span>
                      <span className="text-[10px] text-[#718078] block">Donations Listed</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#123C2D]/6 text-xs text-[#718078] flex items-center justify-between">
                  <span>Active Donors: <strong className="text-[#202B25] font-bold">{h.active_donors_count}</strong></span>
                  <span className="text-[#16865B] font-heading font-bold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16865B]" />
                    High Route Priority
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 4. MUNICIPAL MITIGATION & LOGISTICS ADVISORY */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-5">
            <div>
              <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/20">
                Strategic Logistics Recommendations
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#123C2D] mt-2">
                Operational Dispatch Directives for Volunteer Van Networks
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#718078] leading-relaxed">
              <div className="p-5 bg-[#E8F5ED]/50 rounded-2xl border border-[#16865B]/20 space-y-2">
                <h4 className="font-heading font-bold text-[#123C2D] text-sm">
                  1. Pre-scheduled Afternoon Van Dispatch
                </h4>
                <p>
                  Manipal Food Court generates high surplus between 2:00 PM and 3:30 PM. Dispatching collection vans directly at 2:30 PM reduces hold times by 65% and ensures food remains at optimal serving temperatures.
                </p>
              </div>

              <div className="p-5 bg-[#E8F5ED]/50 rounded-2xl border border-[#16865B]/20 space-y-2">
                <h4 className="font-heading font-bold text-[#123C2D] text-sm">
                  2. Banquet & Wedding Multi-Drop Delivery
                </h4>
                <p>
                  Santhekatte Convention Hall listings occur around 10:30 PM and 3:00 PM with batches exceeding 80+ meals. Split deliveries to two adjacent shelters are recommended to prevent single-shelter over-capacity.
                </p>
              </div>

              <div className="p-5 bg-[#E8F5ED]/50 rounded-2xl border border-[#16865B]/20 space-y-2">
                <h4 className="font-heading font-bold text-[#123C2D] text-sm">
                  3. Traditional Temple Kitchen Integration
                </h4>
                <p>
                  Car Street restaurants produce traditional vegetarian grains with high nutritional value. Daily evening routing to Bannanje care shelters ensures zero loss and zero landfill decay.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
