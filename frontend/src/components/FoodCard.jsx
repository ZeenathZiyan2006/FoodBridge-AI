import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Sparkles, ChefHat, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const CATEGORY_FALLBACK_IMAGES = {
  'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Rice and Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
  'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'Bakery Items': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'Packaged Food': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
  'Other': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
};

export const FoodCard = ({ donation, onRequest, matchScore, receiverView = false }) => {
  const isExpired = donation.status === 'Expired' || donation.hours_left <= 0;
  const fallbackImg = CATEGORY_FALLBACK_IMAGES[donation.category] || CATEGORY_FALLBACK_IMAGES['Other'];

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#123C2D]/8 shadow-[0_4px_20px_-4px_rgba(18,60,45,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(18,60,45,0.12)] hover:border-[#16865B]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Image & Overlays */}
        <div className="relative h-48 w-full bg-[#E8F5ED]/40 overflow-hidden">
          <img
            src={donation.image_url || fallbackImg}
            alt={donation.food_name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <StatusBadge status={donation.status} urgencyLevel={donation.urgency_level} />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-white/95 backdrop-blur-md text-[#202B25] shadow-2xs border border-white/40">
              {donation.category}
            </span>
          </div>

          {/* Dietary Tag */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider shadow-2xs backdrop-blur-md ${
                donation.dietary_type === 'Vegetarian'
                  ? 'bg-[#16865B]/90 text-white'
                  : donation.dietary_type === 'Vegan'
                  ? 'bg-[#123C2D]/90 text-white'
                  : 'bg-[#E9A23B]/90 text-white'
              }`}
            >
              {donation.dietary_type}
            </span>
          </div>

          {/* Quantity Overlay */}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-extrabold tracking-tight drop-shadow-sm text-white">
                {donation.remaining_quantity !== null && donation.remaining_quantity !== undefined ? donation.remaining_quantity : donation.quantity} {donation.quantity_unit}
              </span>
              <span className="text-[10px] font-medium bg-[#16865B]/80 px-2 py-0.5 rounded-md backdrop-blur-xs text-[#E8F5ED]">
                Available
              </span>
            </div>
          </div>

          {/* AI Match Score Badge (if available) */}
          {matchScore !== undefined && matchScore !== null && (
            <div className="absolute bottom-3 right-3 bg-[#123C2D]/95 backdrop-blur-md text-[#E8F5ED] px-2.5 py-0.5 rounded-full text-xs font-heading font-bold flex items-center gap-1 shadow-md border border-[#16865B]/30">
              <Sparkles className="w-3 h-3 text-[#E9A23B]" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-heading text-base font-bold text-[#202B25] group-hover:text-[#123C2D] transition-colors line-clamp-1">
                {donation.food_name}
              </h3>
            </div>
            <p className="text-xs text-[#718078] line-clamp-2 leading-relaxed">
              {donation.description || "Prepared with fresh ingredients following safety guidelines for community consumption."}
            </p>
          </div>

          {/* Key Meta Specs */}
          <div className="space-y-1.5 text-xs text-[#718078] border-t border-[#123C2D]/6 pt-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-3.5 h-3.5 text-[#16865B] shrink-0" />
              <span className="truncate">Donor: <strong className="text-[#202B25]">{donation.donor?.full_name || "Community Partner"}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#16865B] shrink-0" />
              <span className="truncate">{donation.pickup_location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#16865B] shrink-0" />
              <span>
                {isExpired ? (
                  <span className="text-rose-600 font-bold">Expired</span>
                ) : (
                  <span>
                    Deadline: <strong className={donation.hours_left <= 3 ? 'text-[#9A6217] font-bold' : 'text-[#202B25]'}>
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
      <div className="p-5 pt-0 border-t border-[#123C2D]/6 mt-1 flex items-center gap-2">
        <Link
          to={`/donation/${donation.id}`}
          className="flex-1 py-2.5 px-3 text-center rounded-full bg-[#F8FAF7] hover:bg-[#E8F5ED] text-[#123C2D] text-xs font-heading font-bold border border-[#123C2D]/10 hover:border-[#16865B]/30 transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 text-[#16865B]" />
        </Link>

        {receiverView && (
          <button
            onClick={() => onRequest && onRequest(donation)}
            disabled={isExpired || donation.status !== 'Available'}
            className="py-2.5 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isExpired ? 'Expired' : donation.status === 'Available' ? 'Request' : donation.status}
          </button>
        )}

        <Link
          to={`/matching?donationId=${donation.id}`}
          className="p-2.5 rounded-full text-[#16865B] hover:bg-[#E8F5ED] border border-transparent hover:border-[#16865B]/20 transition-all"
          title="Run AI Matching"
        >
          <Sparkles className="w-4 h-4 text-[#E9A23B]" />
        </Link>
      </div>
    </div>
  );
};
