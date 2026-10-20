import React from 'react';
import type { InvoiceState } from '../../types/invoice';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatUSD = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  try {
    const parts = iso.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
  } catch {
    // fallback to raw
  }
  return iso;
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface InvoicePreviewProps {
  invoice: InvoiceState;
}

// ─── Component ───────────────────────────────────────────────────────────────
const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const {
    businessDetails,
    customerDetails,
    invoiceNumber,
    issueDate,
    dueDate,
    lineItems,
    discount,
    taxRate,
    subtotal,
    taxAmount,
    grandTotal,
    notes,
    customFields,
  } = invoice;

  // Only render custom fields that are marked visible and have either label or value
  const visibleCustomFields = customFields.filter(
    (cf) => cf.isVisible && (cf.label.trim() !== '' || cf.value.trim() !== ''),
  );

  return (
    <div
      id="invoice-preview-document"
      className="bg-white rounded-2xl shadow-panel-lg border border-slate-200/90 p-5 sm:p-8 md:p-10 min-h-[960px] flex flex-col justify-between max-w-[760px] mx-auto transition-all"
    >
      <div>
        {/* ── 9.1 Header Section ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 sm:pb-8 border-b border-slate-100">
          {/* Business Details */}
          <div className="max-w-full sm:max-w-[55%]">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              {businessDetails.name || (
                <span className="text-slate-400 italic font-normal">Business Name</span>
              )}
            </h1>

            <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
              {businessDetails.address && (
                <p className="whitespace-pre-line">{businessDetails.address}</p>
              )}
              {businessDetails.email && (
                <p>
                  <span className="text-slate-500">Email:</span> {businessDetails.email}
                </p>
              )}
              {businessDetails.phone && (
                <p>
                  <span className="text-slate-500">Phone:</span> {businessDetails.phone}
                </p>
              )}
              {!businessDetails.address && !businessDetails.email && !businessDetails.phone && (
                <p className="text-slate-400 italic">No business address provided</p>
              )}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md mb-2">
              Invoice
            </span>
            <p className="text-base sm:text-lg font-mono font-bold text-slate-900 tracking-tight">
              {invoiceNumber || '—'}
            </p>

            <div className="mt-3 space-y-1 text-xs">
              <div className="flex sm:justify-end gap-2 text-slate-600">
                <span className="text-slate-500">Issue Date:</span>
                <span className="font-medium text-slate-900">{formatDate(issueDate)}</span>
              </div>
              <div className="flex sm:justify-end gap-2 text-slate-600">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-medium text-slate-900">{formatDate(dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 9.2 Customer Section ("Bill To") & 9.5 Custom Fields ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 py-6 sm:py-7 border-b border-slate-100">
          {/* Bill To */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Bill To
            </p>
            <p className="text-base font-bold text-slate-900 mb-1">
              {customerDetails.name || (
                <span className="text-slate-400 italic font-normal">Customer Name</span>
              )}
            </p>
            <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
              {customerDetails.address && (
                <p className="whitespace-pre-line">{customerDetails.address}</p>
              )}
              {customerDetails.email && (
                <p>
                  <span className="text-slate-500">Email:</span> {customerDetails.email}
                </p>
              )}
              {customerDetails.phone && (
                <p>
                  <span className="text-slate-500">Phone:</span> {customerDetails.phone}
                </p>
              )}
              {!customerDetails.address && !customerDetails.email && !customerDetails.phone && (
                <p className="text-slate-400 italic">No customer details provided</p>
              )}
            </div>
          </div>

          {/* 9.5 Custom Fields Section */}
          <div>
            {visibleCustomFields.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Invoice Details
                </p>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                  {visibleCustomFields.map((field) => (
                    <div key={field.id} className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">{field.label || 'Field'}:</span>
                      <span className="text-slate-900 font-semibold">{field.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 9.3 Line Items Table ── */}
        <div className="pt-6 mb-6 overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-xs min-w-[320px]">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="pb-3 text-left">Description</th>
                <th className="pb-3 text-center w-16">Qty</th>
                <th className="pb-3 text-right w-24">Unit Price</th>
                <th className="pb-3 text-right w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                    No line items added
                  </td>
                </tr>
              ) : (
                lineItems.map((item, idx) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-2 text-slate-800 font-medium">
                      {item.description || (
                        <span className="text-slate-400 italic">Line Item #{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3 text-center text-slate-600 font-medium tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-slate-600 tabular-nums">
                      {formatUSD(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right text-slate-900 font-semibold tabular-nums">
                      {formatUSD(item.lineTotal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 9.4 Totals Section ── */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {formatUSD(subtotal)}
              </span>
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 font-medium">
                <span>Discount</span>
                <span className="tabular-nums">−{formatUSD(discount)}</span>
              </div>
            )}

            {/* Tax */}
            {taxRate > 0 && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Tax ({taxRate}%)</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  +{formatUSD(taxAmount)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="border-t-2 border-slate-900/10 pt-2.5 mt-2 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Due</span>
              <span className="text-xl font-extrabold text-brand-600 tabular-nums">
                {formatUSD(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 9.6 Notes Section & Document Footer ── */}
      <div className="pt-10 mt-8 border-t border-slate-100">
        {notes && notes.trim() !== '' && (
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Notes & Terms
            </p>
            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {notes}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-3">
          <p>Thank you for your business!</p>
          <p className="font-medium text-slate-400">
            Invoice #{invoiceNumber || '—'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
