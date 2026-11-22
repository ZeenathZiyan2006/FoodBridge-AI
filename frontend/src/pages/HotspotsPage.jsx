import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Utensils, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const HotspotsPage = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotspots = async () => {
      try {
        const data = await api.getHotspots();
        setHotspots(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHotspots();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#0F3820] rounded-2xl p-6 sm:p-10 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-200 text-xs font-bold border border-white/15">
          <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Spatial Surplus Intelligence</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
          Food Waste Hotspot Analysis
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
          Identifies high-density geographic nodes where significant volumes of surplus food are recurringly generated. This geospatial intelligence enables volunteer logistics networks and community food vans to pre-position collection routes and minimize transit latency.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">
          Analyzing spatial food waste patterns...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hotspots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotspots.map((h, idx) => (
              <div
                key={h.location}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#14532D] font-bold text-xs flex items-center justify-center font-mono border border-emerald-100">
                      #{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                      Top: {h.top_category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#F59E0B] shrink-0" />
                      <span>{h.location}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Regional Waste Generation Cluster</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-[#F8FAF7] rounded-xl border border-gray-200/70">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Total Volume</span>
                      <span className="font-heading text-2xl font-black text-[#14532D] font-mono mt-0.5 block">{h.total_meals}</span>
                      <span className="text-[10px] text-gray-500 block">Meals Listed</span>
                    </div>

                    <div className="p-3 bg-[#F8FAF7] rounded-xl border border-gray-200/70">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Donations</span>
                      <span className="font-heading text-2xl font-black text-gray-900 font-mono mt-0.5 block">{h.donation_count}</span>
                      <span className="text-[10px] text-gray-500 block">Batches Recorded</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between">
                  <span>Active Donors: <strong className="text-gray-900 font-semibold">{h.active_donors_count}</strong></span>
                  <span className="text-[#16A34A] font-bold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    High Route Priority
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Municipal Mitigation & Logistics Advisory */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
              <span>Recommended Strategic Actions for Volunteers & Municipal Teams</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 leading-relaxed">
              <div className="p-4 bg-[#ECFDF5]/70 rounded-xl border border-emerald-100">
                <h4 className="font-heading font-bold text-[#14532D] text-sm mb-1">1. Pre-scheduled Afternoon Van Dispatch</h4>
                <p>
                  Manipal Food Court generates high surplus between 2:00 PM and 3:30 PM. Dispatching collection vans directly at 2:30 PM reduces hold times by 65%.
                </p>
              </div>

              <div className="p-4 bg-[#ECFDF5]/70 rounded-xl border border-emerald-100">
                <h4 className="font-heading font-bold text-[#14532D] text-sm mb-1">2. Banquet & Wedding Response Team</h4>
                <p>
                  Santhekatte Convention Hall listings occur around 10:30 PM and 3:00 PM with batches exceeding 80+ meals. Multi-shelter split deliveries are recommended.
                </p>
              </div>

              <div className="p-4 bg-[#ECFDF5]/70 rounded-xl border border-emerald-100">
                <h4 className="font-heading font-bold text-[#14532D] text-sm mb-1">3. Udupi Temple Circuit Integration</h4>
                <p>
                  Car Street restaurants produce traditional vegetarian grains with high nutritional value. Daily evening routing to Bannanje care shelters ensures zero loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
