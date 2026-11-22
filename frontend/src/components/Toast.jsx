import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white border-emerald-700',
    error: 'bg-rose-600 text-white border-rose-700',
    info: 'bg-slate-800 text-white border-slate-900',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-200 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md shadow-2xl rounded-xl overflow-hidden border">
      <div className={`px-4 py-3.5 flex items-center gap-3 ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium pr-2 leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
