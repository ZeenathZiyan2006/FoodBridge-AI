import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'forest', // forest, emerald, rose, amber, blue
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const btnStyles = {
    forest: 'bg-[#123C2D] hover:bg-[#16865B] text-white',
    emerald: 'bg-[#16865B] hover:bg-[#123C2D] text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    amber: 'bg-[#E9A23B] hover:bg-amber-600 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B25]/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 transform transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5ED] flex items-center justify-center text-[#123C2D]">
              <AlertCircle className="w-5 h-5 text-[#16865B]" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#202B25]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#718078] leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition duration-150 cursor-pointer disabled:opacity-50 ${btnStyles[confirmVariant] || btnStyles.forest}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
