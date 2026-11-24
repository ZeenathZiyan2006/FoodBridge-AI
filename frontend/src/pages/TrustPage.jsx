import React from 'react';
import { TrustAndVerificationSystem } from '../components/TrustAndVerificationSystem';
import { SafetyBanner } from '../components/SafetyBanner';

export const TrustPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in font-sans">
      <SafetyBanner />
      <TrustAndVerificationSystem />
    </div>
  );
};
