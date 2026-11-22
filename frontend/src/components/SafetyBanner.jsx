import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const SafetyBanner = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#FFFBEB] border border-[#F59E0B]/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#92400E]">
        <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span>
          <strong>Food Safety Verification:</strong> Donors & receivers must inspect aroma, temperature, and packaging hygiene prior to handover.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#ECFDF5] border border-[#16A34A]/20 rounded-2xl p-4.5 mb-6 text-[#14532D] flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-2xs">
      <div className="w-9 h-9 rounded-xl bg-white border border-[#16A34A]/20 flex items-center justify-center shrink-0 text-[#16A34A] shadow-2xs">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm leading-relaxed flex-1">
        <p className="font-heading font-bold text-[#14532D] mb-0.5">
          FSSAI & Public Health Safety Protocol
        </p>
        <p className="text-[#14532D]/80 text-xs">
          Food listings are evaluated based on donor self-reporting. All participating donors and receiving organizations are required to follow statutory food safety standards. Verify food condition, thermal holding integrity, and allergen warnings immediately upon collection.
        </p>
      </div>
    </div>
  );
};
