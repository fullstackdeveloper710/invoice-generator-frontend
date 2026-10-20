// ─── Party (Business / Customer) ────────────────────────────────────────────
export interface PartyDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
}

// ─── Line Item ───────────────────────────────────────────────────────────────
export interface LineItem {
  id: string; // client-only — used as React key; stripped before API call
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number; // derived: qty × unitPrice, rounded to cents
}

// ─── Custom Field ────────────────────────────────────────────────────────────
export interface CustomField {
  id: string; // client-only key
  label: string;
  value: string;
  isVisible: boolean;
}

// ─── Full Invoice (local state) ──────────────────────────────────────────────
export interface InvoiceState {
  // database ID (present when saved or retrieved)
  _id?: string;

  // meta
  invoiceNumber: string;
  issueDate: string; // ISO date string  (YYYY-MM-DD)
  dueDate: string;   // ISO date string

  // parties
  businessDetails: PartyDetails;
  customerDetails: PartyDetails;

  // line items
  lineItems: LineItem[];

  // financials
  discount: number;
  taxRate: number;

  // derived totals (computed client-side, kept in sync)
  subtotal: number;
  taxAmount: number;
  grandTotal: number;

  // extras
  notes: string;
  customFields: CustomField[];
}

// ─── Defaults ────────────────────────────────────────────────────────────────
export const defaultParty = (): PartyDetails => ({
  name: '',
  address: '',
  email: '',
  phone: '',
});

export const defaultLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  lineTotal: 0,
});

export const defaultCustomField = (): CustomField => ({
  id: crypto.randomUUID(),
  label: '',
  value: '',
  isVisible: true,
});

/** Generates a simple invoice number like INV-20261020-4821 */
export const generateInvoiceNumber = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${rand}`;
};

/** Returns today's date as YYYY-MM-DD */
export const today = (): string => new Date().toISOString().slice(0, 10);

/** Returns a date N days from today as YYYY-MM-DD */
export const daysFromToday = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
