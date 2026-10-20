import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { invoiceSchema, InvoiceFormValues } from '../validation/invoiceSchema';
import { InvoiceState } from '../types/invoice';

/**
 * Wraps react-hook-form around the invoice meta + party fields.
 * All returned callbacks are stable (useCallback) so they are safe
 * to include in useEffect dependency arrays without causing re-render loops.
 */
export function useInvoiceForm(
  invoice: InvoiceState,
  callbacks: {
    setMeta: (patch: Partial<Pick<InvoiceState, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes'>>) => void;
    setBusinessDetails: (patch: Partial<InvoiceState['businessDetails']>) => void;
    setCustomerDetails: (patch: Partial<InvoiceState['customerDetails']>) => void;
  },
) {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    reset,
  } = useForm<InvoiceFormValues>({
    resolver: yupResolver(invoiceSchema),
    mode: 'onChange',
    defaultValues: {
      invoiceNumber:   invoice.invoiceNumber,
      issueDate:       invoice.issueDate,
      dueDate:         invoice.dueDate,
      notes:           invoice.notes,
      businessDetails: invoice.businessDetails,
      customerDetails: invoice.customerDetails,
    },
  });

  /**
   * Re-sync RHF defaults when an invoice is loaded from the API.
   * Stable reference — safe to use in useEffect deps.
   */
  const resetForm = useCallback(
    (data: InvoiceState) => {
      reset({
        invoiceNumber:   data.invoiceNumber,
        issueDate:       data.issueDate,
        dueDate:         data.dueDate,
        notes:           data.notes,
        businessDetails: data.businessDetails,
        customerDetails: data.customerDetails,
      });
    },
    [reset],
  );

  /**
   * Validates all fields and returns true/false.
   * Stable reference — safe to use in useEffect deps.
   */
  const validateForm = useCallback(
    (): Promise<boolean> => trigger(),
    [trigger],
  );

  // ── Stable onChange handlers that push values into useInvoiceState ──────────

  const onMetaChange = useCallback(
    (patch: Partial<Pick<InvoiceFormValues, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes'>>) => {
      callbacks.setMeta(patch as Parameters<typeof callbacks.setMeta>[0]);
      // Re-validate dueDate whenever issueDate changes (cross-field rule)
      if ('issueDate' in patch) trigger('dueDate');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callbacks.setMeta, trigger],
  );

  const onBusinessChange = useCallback(
    (patch: Partial<InvoiceState['businessDetails']>) => {
      callbacks.setBusinessDetails(patch);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callbacks.setBusinessDetails],
  );

  const onCustomerChange = useCallback(
    (patch: Partial<InvoiceState['customerDetails']>) => {
      callbacks.setCustomerDetails(patch);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callbacks.setCustomerDetails],
  );

  return {
    register,
    errors,
    trigger,
    getValues,
    setValue,
    resetForm,
    validateForm,
    onMetaChange,
    onBusinessChange,
    onCustomerChange,
  };
}
