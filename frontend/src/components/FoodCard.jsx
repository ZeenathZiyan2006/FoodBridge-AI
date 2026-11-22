import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const FoodCard = ({ donation, onRequest, matchScore, receiverView = false }) => {
  const isExpired = donation.status === 'Expired' || donation.hours_left <= 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Image & Overlays */}
        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
          <img
            src={donation.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
            alt={donation.food_name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            <StatusBadge status={donation.status} urgencyLevel={donation.urgency_level} />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-xs text-gray-800 shadow-xs">
              {donation.category}
            </span>
          </div>

          {/* Dietary Tag */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs ${
                donation.dietary_type === 'Vegetarian'
                  ? 'bg-[#16A34A] text-white'
                  : donation.dietary_type === 'Vegan'
                  ? 'bg-[#14532D] text-white'
                  : 'bg-[#F59E0B] text-white'
              }`}
            >
              {donation.dietary_type}
            </span>
          </div>

          {/* Quantity Overlay */}
          <div className="absolute bottom-2.5 left-3 text-white">
            <span className="font-heading text-lg font-black tracking-tight drop-shadow-xs">
              {donation.quantity} {donation.quantity_unit}
            </span>
          </div>

          {/* AI Match Score Badge (if available) */}
          {matchScore !== undefined && matchScore !== null && (
            <div className="absolute bottom-2.5 right-3 bg-[#14532D]/90 backdrop-blur-xs text-[#ECFDF5] px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm border border-[#16A34A]/30">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-heading text-sm font-bold text-gray-900 group-hover:text-[#14532D] transition line-clamp-1 mb-1">
              {donation.food_name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {donation.description || "Fresh surplus food prepared with quality ingredients and strict hygiene standards."}
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
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
      <div className="p-4 pt-0 border-t border-gray-50 mt-1 flex items-center gap-2">
        <Link
          to={`/donation/${donation.id}`}
          className="flex-1 py-2 px-3 text-center rounded-xl bg-gray-50 hover:bg-[#ECFDF5] text-[#14532D] text-xs font-bold border border-gray-200/80 hover:border-[#16A34A]/30 transition flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {receiverView && (
          <button
            onClick={() => onRequest && onRequest(donation)}
            disabled={isExpired || donation.status !== 'Available'}
            className="py-2 px-3.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExpired ? 'Expired' : donation.status === 'Available' ? 'Request' : donation.status}
          </button>
        )}

        <Link
          to={`/matching?donationId=${donation.id}`}
          className="p-2 rounded-xl text-emerald-800 hover:bg-[#ECFDF5] border border-transparent hover:border-[#16A34A]/20 transition"
          title="Run AI Matching"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        </Link>
      </div>
    </div>
  );
};
