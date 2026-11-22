import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const FoodCard = ({ donation, onRequest, matchScore, receiverView = false }) => {
  const isExpired = donation.status === 'Expired' || donation.hours_left <= 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(20,83,45,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Image & Overlays */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <img
            src={donation.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
            alt={donation.food_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <StatusBadge status={donation.status} urgencyLevel={donation.urgency_level} />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-gray-800 shadow-2xs border border-white/40">
              {donation.category}
            </span>
          </div>

          {/* Dietary Tag */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs backdrop-blur-md ${
                donation.dietary_type === 'Vegetarian'
                  ? 'bg-[#16A34A]/90 text-white'
                  : donation.dietary_type === 'Vegan'
                  ? 'bg-[#14532D]/90 text-white'
                  : 'bg-[#F59E0B]/90 text-white'
              }`}
            >
              {donation.dietary_type}
            </span>
          </div>

          {/* Quantity Overlay */}
          <div className="absolute bottom-3 left-3 text-white">
            <span className="font-heading text-lg font-black tracking-tight drop-shadow-sm">
              {donation.quantity} {donation.quantity_unit}
            </span>
          </div>

          {/* AI Match Score Badge (if available) */}
          {matchScore !== undefined && matchScore !== null && (
            <div className="absolute bottom-3 right-3 bg-[#14532D]/95 backdrop-blur-md text-[#ECFDF5] px-2.5 py-0.5 rounded-xl text-xs font-bold font-heading flex items-center gap-1 shadow-md border border-[#16A34A]/30">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#14532D] transition-colors line-clamp-1 mb-1">
              {donation.food_name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {donation.description || "Fresh surplus food prepared with quality ingredients and strict hygiene standards."}
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">Donor: <strong className="text-gray-800">{donation.donor?.full_name || "Community Partner"}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{donation.pickup_location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                {isExpired ? (
                  <span className="text-rose-600 font-bold">Expired</span>
                ) : (
                  <span>
                    Deadline: <strong className={donation.hours_left <= 3 ? 'text-amber-700' : 'text-gray-800'}>
                      {donation.hours_left ? `${donation.hours_left} hrs remaining` : new Date(donation.consumption_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </strong>
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 border-t border-gray-50 mt-1 flex items-center gap-2">
        <Link
          to={`/donation/${donation.id}`}
          className="flex-1 py-2.5 px-3 text-center rounded-xl bg-gray-50 hover:bg-[#ECFDF5] text-[#14532D] text-xs font-bold font-heading border border-gray-200/80 hover:border-[#16A34A]/30 transition flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {receiverView && (
          <button
            onClick={() => onRequest && onRequest(donation)}
            disabled={isExpired || donation.status !== 'Available'}
            className="py-2.5 px-3.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold font-heading shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isExpired ? 'Expired' : donation.status === 'Available' ? 'Request' : donation.status}
          </button>
        )}

        <Link
          to={`/matching?donationId=${donation.id}`}
          className="p-2.5 rounded-xl text-emerald-800 hover:bg-[#ECFDF5] border border-transparent hover:border-[#16A34A]/20 transition"
          title="Run AI Matching"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
        </Link>
      </div>
    </div>
  );
};
