import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const SafetyBanner = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#FFFBEB] border border-[#E9A23B]/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#92400E] font-sans">
        <ShieldCheck className="w-4 h-4 text-[#E9A23B] shrink-0" />
        <span>
          <strong>Food Safety Verification:</strong> Donors & receivers must inspect aroma, temperature, and packaging hygiene prior to handover.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#E8F5ED] border border-[#16865B]/20 rounded-2xl p-4.5 mb-6 text-[#123C2D] flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-2xs font-sans">
      <div className="w-9 h-9 rounded-xl bg-white border border-[#16865B]/20 flex items-center justify-center shrink-0 text-[#16865B] shadow-2xs">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm leading-relaxed flex-1">
        <p className="font-heading font-extrabold text-[#123C2D] mb-0.5">
          FSSAI & Public Health Safety Protocol
        </p>
        <p className="text-[#123C2D]/80 text-xs">
          Food listings are evaluated based on donor self-reporting. All participating donors and receiving organizations are required to follow statutory food safety standards. Verify food condition, thermal holding integrity, and allergen warnings immediately upon collection.
        </p>
      </div>
    </div>
  );
};
