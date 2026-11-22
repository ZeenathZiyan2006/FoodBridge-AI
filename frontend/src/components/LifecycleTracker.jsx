import React from 'react';
import { Check, Clock, Package, ThumbsUp, Truck, Award, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const STAGES = [
  { key: 'Available', step: '01', label: 'Available', shortDesc: 'Surplus food listed on platform', icon: Clock },
  { key: 'Requested', step: '02', label: 'Requested', shortDesc: 'Shelter submitted allocation request', icon: Package },
  { key: 'Accepted', step: '03', label: 'Accepted', shortDesc: 'Donor confirmed pickup schedule', icon: ThumbsUp },
  { key: 'Ready for Pickup', step: '04', label: 'Ready for Pickup', shortDesc: 'Packaged & verified at depot', icon: Package },
  { key: 'Collected', step: '05', label: 'In Transit', shortDesc: 'Volunteer van dispatched for delivery', icon: Truck },
  { key: 'Completed', step: '06', label: 'Distributed', shortDesc: 'Safely delivered to beneficiaries', icon: Award },
];

export const LifecycleTracker = ({ currentStatus, statusHistory = [] }) => {
  const getStageIndex = (status) => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = getStageIndex(currentStatus);
  const isCancelledOrExpired = currentStatus === 'Expired' || currentStatus === 'Cancelled';

  // Helper to find recorded timestamp for a stage
  const getStageTimestamp = (stageKey) => {
    const entry = statusHistory.find((h) => h.status === stageKey);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <h4 className="font-heading text-xs font-bold text-gray-500 uppercase tracking-wider">
              Redistribution Lifecycle Pipeline
            </h4>
          </div>
          <p className="font-heading text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">
            Real-Time State Progression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Current Phase:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-heading bg-[#ECFDF5] text-[#14532D] border border-[#16A34A]/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            {currentStatus}
          </span>
        </div>
      </div>

      {isCancelledOrExpired ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">Lifecycle Terminated</p>
            <p className="text-rose-700/80 mt-0.5">This donation has been marked as <strong>{currentStatus}</strong> and is no longer moving through redistribution.</p>
          </div>
        </div>
      ) : (
        <div>
          {/* ======================================================== */}
          {/* DESKTOP TIMELINE (Visible on md screens and wider)       */}
          {/* ======================================================== */}
          <div className="hidden md:block relative pt-2 pb-4">
            {/* Continuous background track */}
            <div className="absolute top-7 left-8 right-8 h-1 bg-gray-100 rounded-full z-0" />
            {/* Animated emerald progress fill */}
            <div
              className="absolute top-7 left-8 h-1 bg-gradient-to-r from-[#14532D] via-[#16A34A] to-emerald-400 rounded-full z-0 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, (currentIndex / (STAGES.length - 1)) * 100))}%` }}
            />

            <div className="grid grid-cols-6 relative z-10">
              {STAGES.map((stage, idx) => {
                const isPast = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isPending = idx > currentIndex;
                const Icon = stage.icon;
                const timestamp = getStageTimestamp(stage.key);

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center px-2">
                    {/* Circle Node */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isPast
                          ? 'bg-[#16A34A] text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#14532D] text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : 'bg-white text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step Number & Label */}
                    <span className="mt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                      Step {stage.step}
                    </span>
                    <h5
                      className={`text-xs font-heading font-bold mt-0.5 leading-tight ${
                        isCurrent
                          ? 'text-[#14532D] text-sm'
                          : isPast
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.label}
                    </h5>

                    {/* Status Pill */}
                    <span
                      className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isCurrent
                          ? 'bg-[#14532D] text-white font-bold'
                          : isPast
                          ? 'bg-emerald-50 text-[#16A34A]'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isPast ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                    </span>

                    {/* Recorded Time */}
                    {timestamp && (
                      <span className="mt-1 text-[10px] text-gray-400 font-mono">
                        {timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOBILE & TABLET VERTICAL TIMELINE (Sequential flow)      */}
          {/* Replaces the broken 2-column layout with clean tracker   */}
          {/* ======================================================== */}
          <div className="block md:hidden space-y-0 relative pl-4">
            {/* Continuous vertical tracking line */}
            <div className="absolute top-4 bottom-4 left-7.5 w-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-4 left-7.5 w-0.5 bg-gradient-to-b from-[#14532D] to-[#16A34A] z-0 transition-all duration-500"
              style={{
                height: `${Math.min(100, Math.max(0, (currentIndex / (STAGES.length - 1)) * 100))}%`
              }}
            />

            {STAGES.map((stage, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isPending = idx > currentIndex;
              const Icon = stage.icon;
              const timestamp = getStageTimestamp(stage.key);

              return (
                <div key={stage.key} className="relative z-10 flex items-start gap-4 pb-6 last:pb-1">
                  {/* Node icon */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#14532D] text-white ring-4 ring-emerald-100 shadow-md scale-105'
                        : 'bg-white text-gray-300 border border-gray-200'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#ECFDF5]/80 border-[#16A34A]/30 shadow-xs'
                      : isPast
                      ? 'bg-gray-50/70 border-gray-100'
                      : 'bg-white/50 border-gray-100 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-gray-400">Step {stage.step}</span>
                        <h5 className={`text-xs font-heading font-bold ${
                          isCurrent ? 'text-[#14532D] text-sm' : isPast ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {stage.label}
                        </h5>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isCurrent
                          ? 'bg-[#14532D] text-white font-bold'
                          : isPast
                          ? 'bg-emerald-100 text-[#14532D]'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isPast ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                      {stage.shortDesc}
                    </p>

                    {timestamp && (
                      <p className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#16A34A]" />
                        <span>Recorded at {timestamp}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timestamped audit history list */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-4 pt-5 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-heading">
              Audit Trail & Verification Log
            </p>
            <span className="text-[10px] text-gray-400 font-mono">
              {statusHistory.length} event{statusHistory.length > 1 ? 's' : ''} recorded
            </span>
          </div>

          <div className="space-y-2">
            {statusHistory.map((item, i) => (
              <div
                key={item.id || i}
                className="flex items-start gap-3 text-xs bg-[#F8FAF7] hover:bg-[#F0FDF4] transition-colors p-3 rounded-2xl border border-gray-200/70"
              >
                <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-heading font-bold text-gray-900">{item.status}:</span>{' '}
                  <span className="text-gray-600">{item.notes}</span>
                </div>
                <div className="text-gray-400 shrink-0 font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-gray-200/80">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
