import { axiosClient } from './axiosClient';
import type { InvoiceState } from '../types/invoice';

// Re-export for convenience
export { axiosClient };

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Saves an invoice to MongoDB via POST /api/invoices.
 * Strips client-only keys like lineItem.id before sending.
 */
export async function saveInvoice(
  invoice: InvoiceState,
): Promise<ApiResponse<InvoiceState & { _id: string }>> {
  const payload = {
    issueDate: invoice.issueDate ? new Date(invoice.issueDate) : undefined,
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    businessDetails: invoice.businessDetails,
    customerDetails: invoice.customerDetails,
    notes: invoice.notes,
    lineItems: invoice.lineItems.map(({ description, quantity, unitPrice, lineTotal }) => ({
      description,
      quantity,
      unitPrice,
      lineTotal,
    })),
    discount: invoice.discount,
    taxRate: invoice.taxRate,
    customFields: invoice.customFields.map(({ label, value, isVisible }) => ({
      label,
      value,
      isVisible,
    })),
  };

  const response = await axiosClient.post<ApiResponse<InvoiceState & { _id: string }>>(
    '/invoices',
    payload,
  );
  return response.data;
}

/**
 * Retrieves an invoice by MongoDB ObjectId via GET /api/invoices/:id.
 */
export async function getInvoiceById(
  id: string,
): Promise<ApiResponse<InvoiceState & { _id: string }>> {
  const response = await axiosClient.get<ApiResponse<InvoiceState & { _id: string }>>(
    `/invoices/${id}`,
  );
  return response.data;
}

/**
 * Sends an invoice via email via POST /api/invoices/:id/send.
 */
export async function sendInvoiceEmail(
  id: string,
  to?: string,
): Promise<
  ApiResponse<{
    messageId: string;
    recipient: string;
    previewUrl?: string;
  }>
> {
  const payload = to ? { to } : {};
  const response = await axiosClient.post<
    ApiResponse<{
      messageId: string;
      recipient: string;
      previewUrl?: string;
    }>
  >(`/invoices/${id}/send`, payload);
  return response.data;
}
