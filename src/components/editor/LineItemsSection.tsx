import React from 'react';
import type { LineItem } from '../../types/invoice';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const LayersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
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
interface LineItemsSectionProps {
  items: LineItem[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Omit<LineItem, 'id' | 'lineTotal'>>) => void;
  onRemove: (id: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const LineItemsSection: React.FC<LineItemsSectionProps> = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  // Validation errors tracked per line item id
  const [rowErrors, setRowErrors] = React.useState<Record<string, { qty?: string; price?: string }>>({});

  const handleQtyChange = (id: string, val: string) => {
    if (val.startsWith('-') || Number(val) < 0) {
      setRowErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], qty: 'Qty cannot be negative' },
      }));
      return; // Block negative value
    }

    // Clear error
    setRowErrors((prev) => {
      if (!prev[id]?.qty) return prev;
      const copy = { ...prev, [id]: { ...prev[id] } };
      delete copy[id].qty;
      return copy;
    });

    const num = val === '' ? 0 : parseFloat(val);
    onUpdate(id, { quantity: isNaN(num) ? 0 : num });
  };

  const handlePriceChange = (id: string, val: string) => {
    if (val.startsWith('-') || Number(val) < 0) {
      setRowErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], price: 'Price cannot be negative' },
      }));
      return; // Block negative value
    }

    // Clear error
    setRowErrors((prev) => {
      if (!prev[id]?.price) return prev;
      const copy = { ...prev, [id]: { ...prev[id] } };
      delete copy[id].price;
      return copy;
    });

    const num = val === '' ? 0 : parseFloat(val);
    onUpdate(id, { unitPrice: isNaN(num) ? 0 : num });
  };

  return (
    <div className="section-card animate-slide-up">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="section-title mb-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500 text-white">
            <LayersIcon />
          </span>
          <span>Line Items</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Table or Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-xs text-slate-400 mb-2">No line items added yet</p>
          <button
            id="btn-add-line-item-empty"
            type="button"
            onClick={onAdd}
            className="btn-secondary text-xs inline-flex items-center gap-1.5"
          >
            <PlusIcon /> Add First Item
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium w-16 text-center">Qty</th>
                <th className="pb-2 font-medium w-24 text-right">Price</th>
                <th className="pb-2 font-medium w-20 text-right">Total</th>
                <th className="pb-2 w-8 text-center" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const itemErr = rowErrors[item.id];
                return (
                  <React.Fragment key={item.id}>
                    <tr className="group hover:bg-slate-50/60 transition-colors">
                      {/* Description */}
                      <td className="py-2 pr-1.5">
                        <input
                          id={`line-item-desc-${idx}`}
                          type="text"
                          className="form-input text-xs py-1.5 px-2 font-normal"
                          placeholder="Item description or service..."
                          value={item.description}
                          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
                        />
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-1">
                        <input
                          id={`line-item-qty-${idx}`}
                          type="number"
                          min="0"
                          step="any"
                          className={`form-input text-xs py-1.5 px-1.5 text-center font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            itemErr?.qty ? 'form-input-error' : ''
                          }`}
                          placeholder="1"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        />
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-1">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
                            $
                          </span>
                          <input
                            id={`line-item-price-${idx}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className={`form-input text-xs py-1.5 pl-5 pr-2 text-right font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              itemErr?.price ? 'form-input-error' : ''
                            }`}
                            placeholder="0.00"
                            value={item.unitPrice === 0 ? '' : item.unitPrice}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          />
                        </div>
                      </td>

                      {/* Line Total (read-only) */}
                      <td className="py-2 px-1 text-right font-medium text-slate-700 tabular-nums text-xs">
                        {formatUSD(item.lineTotal)}
                      </td>

                      {/* Remove Button */}
                      <td className="py-2 pl-1 text-center">
                        <button
                          id={`line-item-remove-${idx}`}
                          type="button"
                          onClick={() => {
                            // clean up any error for this row
                            setRowErrors((prev) => {
                              const copy = { ...prev };
                              delete copy[item.id];
                              return copy;
                            });
                            onRemove(item.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Remove row"
                          aria-label={`Remove row ${idx + 1}`}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>

                    {/* Inline error feedback row if negative input was attempted */}
                    {(itemErr?.qty || itemErr?.price) && (
                      <tr>
                        <td colSpan={5} className="pb-1 pt-0 px-1">
                          <p className="text-[11px] text-rose-500 font-medium">
                            ⚠️ {itemErr.qty || itemErr.price}
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Line Item Button */}
      {items.length > 0 && (
        <div className="mt-3 pt-2">
          <button
            id="btn-add-line-item"
            type="button"
            onClick={onAdd}
            className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all group"
          >
            <span className="p-0.5 rounded bg-slate-100 group-hover:bg-brand-100 text-slate-500 group-hover:text-brand-600 transition-colors">
              <PlusIcon />
            </span>
            <span>Add Line Item</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LineItemsSection;
