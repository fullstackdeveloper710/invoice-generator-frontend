import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyDetails } from '../../types/invoice';
import type { InvoiceFormValues } from '../../validation/invoiceSchema';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────
type PartyKey = 'businessDetails' | 'customerDetails';

interface PartyDetailsSectionProps {
  /** "business" | "customer" — controls label and icon */
  role: 'business' | 'customer';
  values: PartyDetails;
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  onChange: (patch: Partial<PartyDetails>) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const PartyDetailsSection: React.FC<PartyDetailsSectionProps> = ({
  role,
  register,
  errors,
  onChange,
}) => {
  const isBusiness     = role === 'business';
  const partyKey: PartyKey = isBusiness ? 'businessDetails' : 'customerDetails';
  const title          = isBusiness ? 'Your Business' : 'Bill To';
  const Icon           = isBusiness ? BuildingIcon : UserIcon;
  const accentColor    = isBusiness ? 'bg-brand-500' : 'bg-violet-500';
  const namePlaceholder    = isBusiness ? 'Acme Corporation'    : 'John Smith';
  const emailPlaceholder   = isBusiness ? 'billing@acme.com'    : 'john@example.com';
  const phonePlaceholder   = isBusiness ? '+1 (555) 000-1234'   : '+1 (555) 000-5678';
  const addressPlaceholder = isBusiness
    ? '123 Business Ave\nSan Francisco, CA 94102'
    : '456 Customer Rd\nNew York, NY 10001';

  const partyErrors = errors[partyKey];

  /** Strip any non-phone-safe characters before propagating the value */
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9+\-\s().]/g, '');
    // Keep input cursor-friendly by only updating state (RHF will revalidate)
    onChange({ phone: clean });
    // Sync the cleaned value back into the native input
    e.target.value = clean;
  };

  return (
    <div className="section-card animate-slide-up">
      {/* Section Header */}
      <div className="section-title">
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${accentColor} text-white`}>
          <Icon />
        </span>
        <span>{title}</span>
      </div>

      <div className="space-y-3">
        {/* Name */}
        <div>
          <label htmlFor={`${role}-name`} className="form-label">
            {isBusiness ? 'Business Name' : 'Customer Name'}
          </label>
          <input
            id={`${role}-name`}
            type="text"
            className="form-input"
            placeholder={namePlaceholder}
            {...register(`${partyKey}.name`, {
              onChange: (e) => onChange({ name: e.target.value }),
            })}
            autoComplete="organization"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor={`${role}-address`} className="form-label">
            Address
          </label>
          <textarea
            id={`${role}-address`}
            rows={3}
            className="form-input resize-none"
            placeholder={addressPlaceholder}
            {...register(`${partyKey}.address`, {
              onChange: (e) => onChange({ address: e.target.value }),
            })}
          />
        </div>

        {/* Email + Phone — side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Email */}
          <div>
            <label htmlFor={`${role}-email`} className="form-label">
              Email
            </label>
            <input
              id={`${role}-email`}
              type="email"
              className={partyErrors?.email ? 'form-input-error' : 'form-input'}
              placeholder={emailPlaceholder}
              {...register(`${partyKey}.email`, {
                onChange: (e) => onChange({ email: e.target.value }),
              })}
              autoComplete="email"
            />
            {partyErrors?.email && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                {partyErrors.email.message as string}
              </p>
            )}
          </div>

          {/* Phone — numbers, +, -, spaces, () only */}
          <div>
            <label htmlFor={`${role}-phone`} className="form-label">
              Phone
            </label>
            <input
              id={`${role}-phone`}
              type="tel"
              inputMode="tel"
              className={partyErrors?.phone ? 'form-input-error' : 'form-input'}
              placeholder={phonePlaceholder}
              {...register(`${partyKey}.phone`, {
                onChange: handlePhoneInput,
              })}
              autoComplete="tel"
            />
            {partyErrors?.phone && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                {partyErrors.phone.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyDetailsSection;
