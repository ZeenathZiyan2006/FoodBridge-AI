import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  const typeConfig = {
    success: {
      border: 'border-[#16865B]/25',
      bg: 'bg-white/95 text-[#202B25] shadow-[0_10px_30px_-5px_rgba(18,60,45,0.15)]',
      iconBg: 'bg-[#E8F5ED] text-[#16865B]',
      icon: CheckCircle2,
      tag: 'Success',
      tagColor: 'text-[#16865B]',
    },
    error: {
      border: 'border-rose-500/20',
      bg: 'bg-white/95 text-[#202B25] shadow-[0_10px_30px_-5px_rgba(225,29,72,0.15)]',
      iconBg: 'bg-rose-100 text-rose-600',
      icon: AlertCircle,
      tag: 'Notice',
      tagColor: 'text-rose-600',
    },
    info: {
      border: 'border-blue-500/20',
      bg: 'bg-white/95 text-[#202B25] shadow-[0_10px_30px_-5px_rgba(37,99,235,0.15)]',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: Info,
      tag: 'Info',
      tagColor: 'text-blue-600',
    },
  };

  const current = typeConfig[toast.type] || typeConfig.info;
  const IconComponent = current.icon;

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in max-w-sm w-full pointer-events-none font-sans">
      <div className={`p-4 rounded-2xl border backdrop-blur-md ${current.bg} ${current.border} pointer-events-auto flex items-start gap-3.5`}>
        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${current.iconBg}`}>
          <IconComponent className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className={`text-[10px] font-mono font-bold uppercase tracking-wider ${current.tagColor}`}>
            {current.tag}
          </p>
          <p className="text-xs font-semibold text-[#202B25] mt-0.5 leading-snug">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
