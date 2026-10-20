import React from 'react';
import type { CustomField } from '../../types/invoice';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
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

// ─── Props ───────────────────────────────────────────────────────────────────
interface CustomFieldsSectionProps {
  fields: CustomField[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Omit<CustomField, 'id'>>) => void;
  onRemove: (id: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  fields,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="section-card animate-slide-up">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="section-title mb-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-purple-600 text-white">
            <TagIcon />
          </span>
          <span>Custom Fields</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {fields.length} {fields.length === 1 ? 'field' : 'fields'}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-3 -mt-1">
        Add custom metadata such as PO #, Project Name, Payment Terms, or Tax ID.
      </p>

      {/* Fields List or Empty State */}
      {fields.length === 0 ? (
        <div className="text-center py-5 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-xs text-slate-400 mb-2">No custom fields added yet</p>
          <button
            id="btn-add-custom-field-empty"
            type="button"
            onClick={onAdd}
            className="btn-secondary text-xs inline-flex items-center gap-1.5"
          >
            <PlusIcon /> Add Custom Field
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className={`p-2.5 rounded-lg border transition-all ${
                field.isVisible
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Field Label Input */}
                <div className="flex-1 min-w-0">
                  <input
                    id={`custom-field-label-${idx}`}
                    type="text"
                    className="form-input text-xs py-1.5 px-2 font-medium"
                    placeholder="Label (e.g. PO Number)"
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                  />
                </div>

                {/* Field Value Input */}
                <div className="flex-1 min-w-0">
                  <input
                    id={`custom-field-value-${idx}`}
                    type="text"
                    className="form-input text-xs py-1.5 px-2 font-normal"
                    placeholder="Value (e.g. PO-98124)"
                    value={field.value}
                    onChange={(e) => onUpdate(field.id, { value: e.target.value })}
                  />
                </div>

                {/* Visibility Toggle Button */}
                <button
                  id={`custom-field-toggle-${idx}`}
                  type="button"
                  onClick={() => onUpdate(field.id, { isVisible: !field.isVisible })}
                  className={`p-1.5 rounded transition-colors ${
                    field.isVisible
                      ? 'text-brand-600 hover:bg-brand-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
                  }`}
                  title={field.isVisible ? 'Visible on invoice (click to hide)' : 'Hidden from invoice (click to show)'}
                  aria-label={field.isVisible ? `Hide field ${idx + 1}` : `Show field ${idx + 1}`}
                >
                  {field.isVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>

                {/* Remove Button */}
                <button
                  id={`custom-field-remove-${idx}`}
                  type="button"
                  onClick={() => onRemove(field.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Remove field"
                  aria-label={`Remove field ${idx + 1}`}
                >
                  <TrashIcon />
                </button>
              </div>

              {/* Status indicator note if hidden */}
              {!field.isVisible && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  <span>Hidden from invoice preview and print</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Field Button */}
      {fields.length > 0 && (
        <div className="mt-3 pt-1">
          <button
            id="btn-add-custom-field"
            type="button"
            onClick={onAdd}
            className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all group"
          >
            <span className="p-0.5 rounded bg-slate-100 group-hover:bg-purple-100 text-slate-500 group-hover:text-purple-600 transition-colors">
              <PlusIcon />
            </span>
            <span>Add Custom Field</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomFieldsSection;
