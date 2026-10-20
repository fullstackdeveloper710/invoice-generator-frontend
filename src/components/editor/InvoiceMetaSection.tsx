import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { InvoiceFormValues } from '../../validation/invoiceSchema';
import type { InvoiceState } from '../../types/invoice';

// ─── SVG Icon ────────────────────────────────────────────────────────────────
const FileTextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <line x1="10" y1="12" x2="16" y2="12" />
    <line x1="10" y1="16" x2="16" y2="16" />
    <line x1="10" y1="8" x2="12" y2="8" />
  </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────
type MetaFields = Pick<InvoiceState, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes'>;

interface InvoiceMetaSectionProps {
  values: MetaFields;
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  onChange: (patch: Partial<MetaFields>) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const InvoiceMetaSection: React.FC<InvoiceMetaSectionProps> = ({
  register,
  errors,
  onChange,
}) => {
  return (
    <div className="section-card animate-slide-up">
      {/* Section Header */}
      <div className="section-title">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-500 text-white">
          <FileTextIcon />
        </span>
        <span>Invoice Details</span>
      </div>

      <div className="space-y-3">
        {/* Invoice Number */}
        <div>
          <label htmlFor="invoice-number" className="form-label flex justify-between">
            <span>Invoice Number <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="invoice-number"
            type="text"
            className={errors.invoiceNumber ? 'form-input-error font-mono' : 'form-input font-mono'}
            placeholder="INV-20261020-0001"
            {...register('invoiceNumber', {
              onChange: (e) => onChange({ invoiceNumber: e.target.value }),
            })}
          />
          {errors.invoiceNumber && (
            <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.invoiceNumber.message}</p>
          )}
        </div>

        {/* Issue Date + Due Date — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="issue-date" className="form-label flex justify-between">
              <span>Issue Date <span className="text-rose-500">*</span></span>
            </label>
            <input
              id="issue-date"
              type="date"
              className={errors.issueDate ? 'form-input-error' : 'form-input'}
              {...register('issueDate', {
                onChange: (e) => onChange({ issueDate: e.target.value }),
              })}
            />
            {errors.issueDate && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.issueDate.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="due-date" className="form-label flex justify-between">
              <span>Due Date <span className="text-rose-500">*</span></span>
            </label>
            <input
              id="due-date"
              type="date"
              className={errors.dueDate ? 'form-input-error' : 'form-input'}
              {...register('dueDate', {
                onChange: (e) => onChange({ dueDate: e.target.value }),
              })}
            />
            {errors.dueDate && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="invoice-notes" className="form-label">
            Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="invoice-notes"
            rows={3}
            className="form-input resize-none"
            placeholder="Payment terms, bank details, thank-you message…"
            {...register('notes', {
              onChange: (e) => onChange({ notes: e.target.value }),
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceMetaSection;
