import React from 'react';
import { Clock, CheckCircle2, Package, Truck, Sparkles, XCircle, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ status, urgencyLevel }) => {
  // If urgency is critical/urgent and status is Available, highlight urgency
  if (status === 'Available' && (urgencyLevel === 'Critical' || urgencyLevel === 'Urgent')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-[#FEF7EC] text-[#9A6217] border border-[#E9A23B]/40 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-[#E9A23B]" />
        <span>Urgent ({urgencyLevel})</span>
      </span>
    );
  }

  const configs = {
    Available: {
      bg: 'bg-[#E8F5ED] text-[#123C2D] border-[#16865B]/25',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B]" />,
      label: 'Available',
    },
    Requested: {
      bg: 'bg-blue-50 text-blue-900 border-blue-200',
      icon: <Package className="w-3.5 h-3.5 text-blue-600" />,
      label: 'Requested',
    },
    Accepted: {
      bg: 'bg-[#E8F5ED] text-[#123C2D] border-[#16865B]/30',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#16865B]" />,
      label: 'Accepted',
    },
    'Ready for Pickup': {
      bg: 'bg-teal-50 text-teal-900 border-teal-200',
      icon: <Package className="w-3.5 h-3.5 text-teal-600" />,
      label: 'Ready for Pickup',
    },
    Collected: {
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
      label: 'Collected',
    },
    Completed: {
      bg: 'bg-purple-50 text-purple-900 border-purple-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />,
      label: 'Completed',
    },
    Expired: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Expired',
    },
    Cancelled: {
      bg: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
      label: 'Cancelled',
    },
  };

  const current = configs[status] || configs.Available;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-heading font-semibold border ${current.bg} shadow-2xs`}>
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};
