import React, { useState, useEffect } from 'react';
import {
  Navigation,
  X,
  Truck,
  MapPin,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Phone,
  Package,
  Leaf,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

export const PickupRouteOptimizerModal = ({ isOpen, onClose }) => {
  const [startLocation, setStartLocation] = useState('Manipal');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOptimizedRoute = async (loc = startLocation) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getOptimizedRoute(loc);
      setRouteData(data);
    } catch (err) {
      setError(err.message || 'Failed to compute optimized pickup route.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOptimizedRoute();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build Google Maps multi-stop URL
  const generateGoogleMapsUrl = () => {
    if (!routeData || !routeData.stops || routeData.stops.length === 0) return '#';
    const waypoints = routeData.stops.map((s) => `${s.latitude},${s.longitude}`);
    const origin = `${routeData.stops[0].latitude},${routeData.stops[0].longitude}`;
    const destination = waypoints[waypoints.length - 1];
    const via = waypoints.slice(1, -1).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${via ? `&waypoints=${via}` : ''}&travelmode=driving`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202B25]/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-[#123C2D]/12 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#123C2D] via-[#16865B] to-[#0B261D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <Truck className="w-5 h-5 text-[#42B883]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg">
                  AI Pickup Route Optimizer
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider text-white">
                  Multi-Stop TSP
                </span>
              </div>
              <p className="text-xs text-[#E8F5ED]/80">
                Optimized transit sequence for volunteers & delivery partners prioritizing urgent pickups.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hub Location Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAF7] p-3.5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-heading font-bold text-[#202B25] uppercase tracking-wider">Starting Depot:</span>
              <select
                value={startLocation}
                onChange={(e) => {
                  setStartLocation(e.target.value);
                  loadOptimizedRoute(e.target.value);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#123C2D]/15 text-xs bg-white text-[#123C2D] font-bold cursor-pointer"
              >
                <option value="Manipal">Manipal (Tiger Circle Hub)</option>
                <option value="Udupi">Udupi (City Center Hub)</option>
                <option value="Santhekatte">Santhekatte (Market Depot)</option>
                <option value="Malpe">Malpe (Coastal Harbor Hub)</option>
              </select>
            </div>

            <button
              onClick={() => loadOptimizedRoute(startLocation)}
              disabled={loading}
              className="text-xs font-heading font-bold text-[#16865B] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Recalculate Route</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-xs text-[#718078] space-y-2">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#16865B]" />
              <p>Computing optimal multi-stop transit path...</p>
            </div>
          ) : routeData ? (
            <div className="space-y-6 animate-fade-in">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Total Stops</span>
                  <p className="font-heading font-black text-xl text-[#123C2D] mt-0.5">
                    {routeData.total_stops}
                  </p>
                  <span className="text-[10px] text-[#718078]">Pickups & Drop</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Total Distance</span>
                  <p className="font-heading font-black text-xl text-[#16865B] mt-0.5">
                    {routeData.total_distance_km} km
                  </p>
                  <span className="text-[10px] text-[#718078]">Shortest Path</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Est. Travel Time</span>
                  <p className="font-heading font-black text-xl text-[#9A6217] mt-0.5">
                    ~{routeData.estimated_travel_time_minutes} min
                  </p>
                  <span className="text-[10px] text-[#718078]">With Loading</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Carbon Saved</span>
                  <p className="font-heading font-black text-xl text-[#123C2D] mt-0.5">
                    {routeData.carbon_saved_kg} kg
                  </p>
                  <span className="text-[10px] text-[#718078]">CO₂e Avoided</span>
                </div>
              </div>

              {/* Route Summary Text */}
              <div className="p-3.5 bg-[#E8F5ED] border border-[#16865B]/20 rounded-2xl text-xs text-[#123C2D] flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-[#16865B] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {routeData.route_summary}
                </p>
              </div>

              {/* Route Stops Step-by-Step Timeline */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                  Recommended Sequential Itinerary:
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#16865B]/30">
                  {routeData.stops?.map((stop) => (
                    <div
                      key={stop.stop_number}
                      className={`relative p-3.5 rounded-2xl border transition ${
                        stop.stop_type === 'delivery'
                          ? 'bg-[#E8F5ED]/60 border-[#16865B]/30'
                          : 'bg-white border-gray-200 shadow-2xs'
                      }`}
                    >
                      {/* Node Bullet */}
                      <span className={`absolute -left-6 top-4 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs ${
                        stop.stop_type === 'delivery' ? 'bg-[#123C2D]' : 'bg-[#16865B]'
                      }`}>
                        {stop.stop_number}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                              stop.stop_type === 'delivery'
                                ? 'bg-[#123C2D] text-white'
                                : 'bg-[#E8F5ED] text-[#123C2D]'
                            }`}>
                              {stop.stop_type === 'delivery' ? 'Final Drop-off' : `Pickup #${stop.stop_number}`}
                            </span>
                            <span className="font-heading font-extrabold text-xs text-[#202B25]">
                              {stop.location_name}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#718078] mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#16865B] shrink-0" />
                            <span>{stop.address}</span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-[#718078] block">Estimated ETA:</span>
                          <span className="font-heading font-bold text-xs text-[#123C2D]">
                            +{stop.estimated_arrival_minutes} mins
                          </span>
                          {stop.quantity && (
                            <span className="block text-[10px] font-bold text-[#16865B]">
                              {stop.quantity} Meals
                            </span>
                          )}
                        </div>
                      </div>

                      {stop.contact_phone && (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#718078]">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#16865B]" />
                            <span>Contact: {stop.contact_phone}</span>
                          </span>
                          {stop.urgency_tier && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              {stop.urgency_tier} ({stop.hours_left ? `${stop.hours_left}h left` : 'Safe'})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Open in Google Maps */}
              <a
                href={generateGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#E8F5ED]" />
                <span>Launch Turn-by-Turn Route in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
