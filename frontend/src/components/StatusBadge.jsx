import React from 'react';
import { Clock, CheckCircle, Package, Truck, Sparkles, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, urgencyLevel }) => {
  // If urgency is critical/urgent and status is Available, highlight urgency
  if (status === 'Available' && (urgencyLevel === 'Critical' || urgencyLevel === 'Urgent')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#F59E0B]/30 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
        Urgent ({urgencyLevel})
      </span>
    );
  }

  const configs = {
    Available: {
      bg: 'bg-[#ECFDF5] text-[#14532D] border-[#16A34A]/25',
      icon: <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />,
      label: 'Available',
    },
    Requested: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <Package className="w-3.5 h-3.5 text-blue-600" />,
      label: 'Requested',
    },
    Accepted: {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Accepted',
    },
    'Ready for Pickup': {
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: <Package className="w-3.5 h-3.5 text-teal-600" />,
      label: 'Ready for Pickup',
    },
    Collected: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
      label: 'Collected',
    },
    Completed: {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: <CheckCircle className="w-3.5 h-3.5 text-purple-600" />,
      label: 'Completed',
    },
    Expired: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Expired',
    },
    Cancelled: {
      bg: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
      label: 'Cancelled',
    },
  };

  const current = configs[status] || configs.Available;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} shadow-2xs`}>
      {current.icon}
      {current.label}
    </span>
  );
};
