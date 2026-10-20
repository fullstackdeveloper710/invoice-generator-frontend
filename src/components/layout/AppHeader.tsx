import React from 'react';
import { InvoiceState } from '../../types/invoice';

// ─── Icon helpers (inline SVG) ───────────────────────────────────────────────
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);

const LogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const SpinnerIcon = () => (
  <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-current inline-block" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────
interface AppHeaderProps {
  invoice: InvoiceState;
  isSaving: boolean;
  isLoading: boolean;
  isSendingEmail: boolean;
  onSave: () => void;
  onOpenEmailModal: () => void;
  onPrint: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const AppHeader: React.FC<AppHeaderProps> = ({
  invoice,
  isSaving,
  isLoading,
  isSendingEmail,
  onSave,
  onOpenEmailModal,
  onPrint,
}) => {
  return (
    <header
      id="app-header"
      className="flex-shrink-0 flex items-center justify-between
                 px-3 sm:px-5 h-14 bg-white border-b border-slate-200 shadow-header z-20 no-print"
    >
      {/* Logo + Title + Status Badges */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 text-white shrink-0">
          <LogoIcon />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Invoice Generator</p>
            {invoice._id && (
              <span
                className="text-[9px] sm:text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded"
                title={`Database ID: ${invoice._id}`}
              >
                Saved ✓
              </span>
            )}
            {isLoading && (
              <span className="text-[10px] sm:text-[11px] font-medium text-brand-600 flex items-center gap-1">
                <SpinnerIcon /> Loading...
              </span>
            )}
          </div>
          <p className="hidden xs:block text-[10px] text-slate-500 leading-tight">
            Professional invoicing made simple
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Save Button */}
        <button
          id="btn-save"
          className="btn-secondary text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2"
          title="Save invoice to database"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? <SpinnerIcon /> : <SaveIcon />}
          <span className="hidden xs:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Send Email Button */}
        <button
          id="btn-send-email"
          className="btn-secondary text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2"
          title={invoice._id ? 'Send invoice via email' : 'Save and send invoice via email'}
          onClick={onOpenEmailModal}
          disabled={isSaving || isSendingEmail}
        >
          {isSendingEmail ? <SpinnerIcon /> : <MailIcon />}
          <span className="hidden xs:inline">{isSendingEmail ? 'Sending...' : 'Send Email'}</span>
        </button>

        {/* Print Button */}
        <button
          id="btn-print"
          className="btn-primary shadow-sm hover:shadow text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2"
          title="Print or Save as PDF"
          onClick={onPrint}
        >
          <PrintIcon />
          <span>Print / PDF</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
