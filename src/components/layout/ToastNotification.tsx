import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ToastData {
  message: string;
  type: 'success' | 'error';
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────
const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-panel-lg text-xs font-semibold flex items-center gap-2 animate-slide-up border ${
        toast.type === 'success'
          ? 'bg-slate-900 text-white border-slate-800'
          : 'bg-rose-600 text-white border-rose-700'
      }`}
    >
      {toast.type === 'success' ? (
        <span className="text-emerald-400">
          <CheckIcon />
        </span>
      ) : (
        <span>⚠️</span>
      )}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default ToastNotification;
