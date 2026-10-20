import React, { useState } from 'react';
import type { InvoiceState } from '../../types/invoice';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const formatUSD = (val: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

// ─── Props ───────────────────────────────────────────────────────────────────
interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceState;
  onSend: (to?: string) => Promise<void>;
  isSending: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onSend,
  isSending,
}) => {
  const [recipient, setRecipient] = useState(invoice.customerDetails.email || '');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSending, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSend(recipient.trim() || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-email-title"
    >
      <div className="bg-white rounded-2xl shadow-panel-lg border border-slate-200 max-w-md w-full p-6 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <MailIcon />
            </div>
            <div>
              <h2 id="send-email-title" className="text-base font-bold text-slate-900">
                Send Invoice via Email
              </h2>
              <p className="text-xs text-slate-400">Deliver invoice directly to client's inbox</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Invoice Summary Card */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Invoice Number:</span>
            <span className="font-mono font-semibold text-slate-800">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Customer:</span>
            <span className="font-medium text-slate-800">
              {invoice.customerDetails.name || 'Unnamed Client'}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60 font-semibold">
            <span>Total Due:</span>
            <span className="text-brand-600 font-bold">{formatUSD(invoice.grandTotal)}</span>
          </div>
        </div>

        {/* Recipient Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipient-email" className="form-label">
              Recipient Email Address
            </label>
            <input
              id="recipient-email"
              type="email"
              className="form-input text-xs"
              placeholder="e.g. client@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isSending}
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
              If left blank, the email will be sent to the business owner inbox or customer email configured on the server.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-email"
              onClick={onClose}
              disabled={isSending}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-send-email"
              disabled={isSending}
              className="btn-primary text-xs"
            >
              {isSending ? (
                <>
                  <SpinnerIcon />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <MailIcon />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;
