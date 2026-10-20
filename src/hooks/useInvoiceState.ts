import { useState, useCallback } from 'react';
import {
  InvoiceState,
  PartyDetails,
  LineItem,
  CustomField,
  defaultParty,
  defaultLineItem,
  defaultCustomField,
  generateInvoiceNumber,
  today,
  daysFromToday,
} from '../types/invoice';

// ─── Totals Calculator ───────────────────────────────────────────────────────
function calcTotals(
  items: LineItem[],
  discount: number,
  taxRate: number,
): Pick<InvoiceState, 'subtotal' | 'taxAmount' | 'grandTotal'> {
  const subtotal = Math.round(items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  const discounted = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(discounted * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((discounted + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, grandTotal };
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initial: InvoiceState = {
  invoiceNumber: generateInvoiceNumber(),
  issueDate: today(),
  dueDate: daysFromToday(30),
  businessDetails: defaultParty(),
  customerDetails: defaultParty(),
  lineItems: [defaultLineItem()],
  discount: 0,
  taxRate: 0,
  subtotal: 0,
  taxAmount: 0,
  grandTotal: 0,
  notes: '',
  customFields: [],
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useInvoiceState() {
  const [invoice, setInvoice] = useState<InvoiceState>(initial);

  // ── Party Details ──
  const setBusinessDetails = useCallback(
    (patch: Partial<PartyDetails>) =>
      setInvoice((prev) => ({
        ...prev,
        businessDetails: { ...prev.businessDetails, ...patch },
      })),
    [],
  );

  const setCustomerDetails = useCallback(
    (patch: Partial<PartyDetails>) =>
      setInvoice((prev) => ({
        ...prev,
        customerDetails: { ...prev.customerDetails, ...patch },
      })),
    [],
  );

  // ── Meta Fields ──
  const setMeta = useCallback(
    (patch: Partial<Pick<InvoiceState, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes'>>) =>
      setInvoice((prev) => ({ ...prev, ...patch })),
    [],
  );

  // ── Line Items ──
  const addLineItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, defaultLineItem()],
    }));
  }, []);

  const updateLineItem = useCallback(
    (id: string, patch: Partial<Omit<LineItem, 'id' | 'lineTotal'>>) => {
      setInvoice((prev) => {
        const lineItems = prev.lineItems.map((item) => {
          if (item.id !== id) return item;
          const merged = { ...item, ...patch };
          merged.lineTotal = Math.round(merged.quantity * merged.unitPrice * 100) / 100;
          return merged;
        });
        const totals = calcTotals(lineItems, prev.discount, prev.taxRate);
        return { ...prev, lineItems, ...totals };
      });
    },
    [],
  );

  const removeLineItem = useCallback((id: string) => {
    setInvoice((prev) => {
      const lineItems = prev.lineItems.filter((i) => i.id !== id);
      const totals = calcTotals(lineItems, prev.discount, prev.taxRate);
      return { ...prev, lineItems, ...totals };
    });
  }, []);

  // ── Financials ──
  const setDiscount = useCallback((discount: number) => {
    setInvoice((prev) => {
      const totals = calcTotals(prev.lineItems, discount, prev.taxRate);
      return { ...prev, discount, ...totals };
    });
  }, []);

  const setTaxRate = useCallback((taxRate: number) => {
    setInvoice((prev) => {
      const totals = calcTotals(prev.lineItems, prev.discount, taxRate);
      return { ...prev, taxRate, ...totals };
    });
  }, []);

  // ── Custom Fields ──
  const addCustomField = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      customFields: [...prev.customFields, defaultCustomField()],
    }));
  }, []);

  const updateCustomField = useCallback(
    (id: string, patch: Partial<Omit<CustomField, 'id'>>) => {
      setInvoice((prev) => ({
        ...prev,
        customFields: prev.customFields.map((cf) =>
          cf.id === id ? { ...cf, ...patch } : cf,
        ),
      }));
    },
    [],
  );

  const removeCustomField = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((cf) => cf.id !== id),
    }));
  }, []);

  // ── Bulk Restore (Phase 11 — load from API) ──
  const restoreInvoice = useCallback((data: any) => {
    setInvoice((prev) => {
      const restoredItems: LineItem[] = (data.lineItems || []).map((item: any) => ({
        id: item.id || crypto.randomUUID(),
        description: item.description || '',
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? 0,
        lineTotal:
          item.lineTotal ??
          Math.round((item.quantity ?? 1) * (item.unitPrice ?? 0) * 100) / 100,
      }));

      const restoredFields: CustomField[] = (data.customFields || []).map((cf: any) => ({
        id: cf.id || crypto.randomUUID(),
        label: cf.label || '',
        value: cf.value || '',
        isVisible: cf.isVisible !== false,
      }));

      const cleanIssueDate = data.issueDate
        ? String(data.issueDate).slice(0, 10)
        : prev.issueDate;
      const cleanDueDate = data.dueDate
        ? String(data.dueDate).slice(0, 10)
        : prev.dueDate;

      const discount = data.discount ?? prev.discount;
      const taxRate = data.taxRate ?? prev.taxRate;
      const totals = calcTotals(restoredItems, discount, taxRate);

      return {
        ...prev,
        ...data,
        _id: data._id,
        invoiceNumber: data.invoiceNumber || prev.invoiceNumber,
        issueDate: cleanIssueDate,
        dueDate: cleanDueDate,
        businessDetails: { ...prev.businessDetails, ...(data.businessDetails || {}) },
        customerDetails: { ...prev.customerDetails, ...(data.customerDetails || {}) },
        notes: data.notes ?? prev.notes,
        lineItems: restoredItems.length > 0 ? restoredItems : prev.lineItems,
        customFields: restoredFields,
        discount,
        taxRate,
        ...totals,
      };
    });
  }, []);

  return {
    invoice,
    setBusinessDetails,
    setCustomerDetails,
    setMeta,
    addLineItem,
    updateLineItem,
    removeLineItem,
    setDiscount,
    setTaxRate,
    addCustomField,
    updateCustomField,
    removeCustomField,
    restoreInvoice,
  };
}
