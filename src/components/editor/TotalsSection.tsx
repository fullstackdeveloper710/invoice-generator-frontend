import React from 'react';

// ─── SVG Icon ────────────────────────────────────────────────────────────────
const CalculatorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatUSD = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface TotalsSectionProps {
  discount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  onDiscountChange: (discount: number) => void;
  onTaxRateChange: (taxRate: number) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const TotalsSection: React.FC<TotalsSectionProps> = ({
  discount,
  taxRate,
  subtotal,
  taxAmount,
  grandTotal,
  onDiscountChange,
  onTaxRateChange,
}) => {
  const [discountError, setDiscountError] = React.useState<string | null>(null);
  const [taxError, setTaxError] = React.useState<string | null>(null);

  const handleDiscountChange = (val: string) => {
    if (val.startsWith('-') || Number(val) < 0) {
      setDiscountError('Discount cannot be negative');
      return;
    }

    const num = val === '' ? 0 : parseFloat(val);
    if (isNaN(num)) {
      setDiscountError(null);
      onDiscountChange(0);
      return;
    }

    if (num > subtotal && subtotal > 0) {
      setDiscountError(`Discount cannot exceed subtotal (${formatUSD(subtotal)})`);
      onDiscountChange(subtotal); // Cap the value at subtotal
      return;
    }

    setDiscountError(null);
    onDiscountChange(num);
  };

  const handleTaxRateChange = (val: string) => {
    if (val.startsWith('-') || Number(val) < 0) {
      setTaxError('Tax rate cannot be negative');
      return;
    }

    const num = val === '' ? 0 : parseFloat(val);
    if (isNaN(num)) {
      setTaxError(null);
      onTaxRateChange(0);
      return;
    }

    if (num > 100) {
      setTaxError('Tax rate cannot exceed 100%');
      onTaxRateChange(100);
      return;
    }

    setTaxError(null);
    onTaxRateChange(num);
  };

  return (
    <div className="section-card animate-slide-up">
      {/* Section Header */}
      <div className="section-title">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-600 text-white">
          <CalculatorIcon />
        </span>
        <span>Totals & Financials</span>
      </div>

      {/* Inputs: Discount ($) & Tax Rate (%) */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Discount */}
        <div>
          <label htmlFor="invoice-discount" className="form-label">
            Discount ($)
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none font-medium">
              $
            </span>
            <input
              id="invoice-discount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className={`form-input text-xs py-1.5 pl-6 pr-2.5 font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                discountError ? 'form-input-error' : ''
              }`}
              value={discount === 0 ? '' : discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
            />
          </div>
          {discountError && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight">
              {discountError}
            </p>
          )}
        </div>

        {/* Tax Rate */}
        <div>
          <label htmlFor="invoice-tax-rate" className="form-label">
            Tax Rate (%)
          </label>
          <div className="relative">
            <input
              id="invoice-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="0"
              className={`form-input text-xs py-1.5 pl-2.5 pr-6 font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                taxError ? 'form-input-error' : ''
              }`}
              value={taxRate === 0 ? '' : taxRate}
              onChange={(e) => handleTaxRateChange(e.target.value)}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none font-medium">
              %
            </span>
          </div>
          {taxError && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight">
              {taxError}
            </p>
          )}
        </div>
      </div>

      {/* Calculated Breakdown Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {formatUSD(subtotal)}
          </span>
        </div>

        {/* Discount Row (shown if applied) */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span>Discount</span>
            <span className="font-medium tabular-nums">
              −{formatUSD(discount)}
            </span>
          </div>
        )}

        {/* Tax Row (shown if applied) */}
        {taxRate > 0 && (
          <div className="flex justify-between items-center text-slate-600">
            <span>Tax ({taxRate}%)</span>
            <span className="font-medium text-slate-800 tabular-nums">
              +{formatUSD(taxAmount)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-200/80 pt-2 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900">Grand Total</span>
          <span className="text-base font-extrabold text-brand-600 tabular-nums">
            {formatUSD(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
