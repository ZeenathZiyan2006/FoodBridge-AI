import React from 'react';
import { Check, Clock, Package, ThumbsUp, Truck, Award } from 'lucide-react';

const STAGES = [
  { key: 'Available', label: 'Available', icon: Clock },
  { key: 'Requested', label: 'Requested', icon: Package },
  { key: 'Accepted', label: 'Accepted', icon: ThumbsUp },
  { key: 'Ready for Pickup', label: 'Ready for Pickup', icon: Package },
  { key: 'Collected', label: 'Collected', icon: Truck },
  { key: 'Completed', label: 'Completed', icon: Award },
];

export const LifecycleTracker = ({ currentStatus, statusHistory = [] }) => {
  const getStageIndex = (status) => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = getStageIndex(currentStatus);
  const isCancelledOrExpired = currentStatus === 'Expired' || currentStatus === 'Cancelled';

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs">
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-heading text-xs font-bold text-gray-800 uppercase tracking-wider">
          Donation Redistribution Lifecycle
        </h4>
        <span className="text-xs font-medium text-gray-500">
          Current State: <strong className="text-[#14532D]">{currentStatus}</strong>
        </span>
      </div>

      {isCancelledOrExpired ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
          ⚠️ This donation has been marked as <strong>{currentStatus}</strong>. The redistribution workflow is concluded.
        </div>
      ) : (
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden sm:block absolute top-4.5 left-6 right-6 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-[#16A34A] transition-all duration-500 rounded-full"
              style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-0 relative z-10">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isPast
                        ? 'bg-[#16A34A] text-white shadow-2xs'
                        : isCurrent
                        ? 'bg-[#14532D] text-white ring-4 ring-[#ECFDF5] shadow-xs'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCurrent
                        ? 'text-[#14532D] font-bold'
                        : isPast
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timestamped audit history list */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            Audit Trail & State Transitions
          </p>
          <div className="space-y-2">
            {statusHistory.map((item, i) => (
              <div key={item.id || i} className="flex items-start gap-2.5 text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{item.status}:</span> {item.notes}
                </div>
                <div className="text-gray-400 shrink-0 font-mono text-[11px]">
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
