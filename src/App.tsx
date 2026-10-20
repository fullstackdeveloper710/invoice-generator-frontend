import React, { useState, useEffect, useCallback } from 'react';
import { useInvoiceState } from './hooks/useInvoiceState';
import { useInvoiceForm } from './hooks/useInvoiceForm';
import PartyDetailsSection from './components/editor/PartyDetailsSection';
import InvoiceMetaSection from './components/editor/InvoiceMetaSection';
import LineItemsSection from './components/editor/LineItemsSection';
import TotalsSection from './components/editor/TotalsSection';
import CustomFieldsSection from './components/editor/CustomFieldsSection';
import InvoicePreview from './components/preview/InvoicePreview';
import { saveInvoice as saveInvoiceApi, getInvoiceById, sendInvoiceEmail } from './api/invoiceApi';
import SendEmailModal from './components/modals/SendEmailModal';
import AppHeader from './components/layout/AppHeader';
import ToastNotification, { ToastData } from './components/layout/ToastNotification';

// ─── App Shell ───────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const {
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
  } = useInvoiceState();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 4500);
  }, []);

  // ── React Hook Form + Yup ──────────────────────────────────────────────────
  const {
    register,
    errors,
    validateForm,
    resetForm,
    onMetaChange,
    onBusinessChange,
    onCustomerChange,
  } = useInvoiceForm(invoice, {
    setMeta,
    setBusinessDetails,
    setCustomerDetails,
  });

  // ── Load Invoice on Page Load if ?id= is in URL ────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    getInvoiceById(id)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          restoreInvoice(res.data);
          resetForm(res.data);
          showToast(`Invoice loaded from database!`, 'success');
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          const msg = err.userMessage || err.response?.data?.message || 'Invoice not found';
          showToast(`Could not load invoice: ${msg}`, 'error');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [restoreInvoice, resetForm, showToast]);

  // ── Save Invoice ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      showToast('Please fix the form errors before saving', 'error');
      return null;
    }

    try {
      setIsSaving(true);
      const res = await saveInvoiceApi(invoice);
      if (res.success && res.data) {
        restoreInvoice(res.data);
        resetForm(res.data);
        const newUrl = `${window.location.pathname}?id=${res.data._id}`;
        window.history.pushState({}, '', newUrl);
        showToast(`Invoice saved! (ID: ${res.data._id.slice(-6)})`, 'success');
        return res.data._id;
      }
    } catch (err: any) {
      const msg = err.userMessage || err.response?.data?.message || err.message || 'Failed to save invoice';
      showToast(msg, 'error');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // ── Print Invoice ──────────────────────────────────────────────────────────
  const handlePrint = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      showToast('Please fix the form errors before printing', 'error');
      return;
    }
    window.print();
  };

  // ── Open Email Modal ───────────────────────────────────────────────────────
  const handleOpenEmailModal = async () => {
    if (!invoice._id) {
      showToast('Saving invoice before preparing email...', 'success');
      const savedId = await handleSave();
      if (savedId) {
        setIsEmailModalOpen(true);
      }
    } else {
      setIsEmailModalOpen(true);
    }
  };

  // ── Send Email ─────────────────────────────────────────────────────────────
  const handleSendEmail = async (to?: string) => {
    if (!invoice._id) {
      showToast('Please save the invoice first.', 'error');
      return;
    }

    try {
      setIsSendingEmail(true);
      const res = await sendInvoiceEmail(invoice._id, to);
      if (res.success && res.data) {
        setIsEmailModalOpen(false);
        showToast(`Email sent successfully to ${res.data.recipient}!`, 'success');
      }
    } catch (err: any) {
      const msg = err.userMessage || err.response?.data?.message || err.message || 'Failed to send email';
      showToast(msg, 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-slate-100 font-sans relative">

      {/* ── Toast Notification ── */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* ── Header Bar ── */}
      <AppHeader
        invoice={invoice}
        isSaving={isSaving}
        isLoading={isLoading}
        isSendingEmail={isSendingEmail}
        onSave={handleSave}
        onOpenEmailModal={handleOpenEmailModal}
        onPrint={handlePrint}
      />

      {/* ── Two-Column Body (Responsive: stacked on mobile, side-by-side on lg+) ── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">

        {/* ── Left: Editor Panel ── */}
        <aside
          id="editor-panel"
          className="w-full lg:w-[480px] flex-shrink-0 overflow-y-visible lg:overflow-y-auto bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-3 sm:p-5 space-y-4"
          aria-label="Invoice editor"
        >
          {/* Invoice Meta */}
          <InvoiceMetaSection
            values={{
              invoiceNumber: invoice.invoiceNumber,
              issueDate:     invoice.issueDate,
              dueDate:       invoice.dueDate,
              notes:         invoice.notes,
            }}
            register={register}
            errors={errors}
            onChange={onMetaChange}
          />

          {/* Business Details */}
          <PartyDetailsSection
            role="business"
            values={invoice.businessDetails}
            register={register}
            errors={errors}
            onChange={onBusinessChange}
          />

          {/* Customer Details */}
          <PartyDetailsSection
            role="customer"
            values={invoice.customerDetails}
            register={register}
            errors={errors}
            onChange={onCustomerChange}
          />

          {/* Line Items */}
          <LineItemsSection
            items={invoice.lineItems}
            onAdd={addLineItem}
            onUpdate={updateLineItem}
            onRemove={removeLineItem}
          />

          {/* Totals & Financials */}
          <TotalsSection
            discount={invoice.discount}
            taxRate={invoice.taxRate}
            subtotal={invoice.subtotal}
            taxAmount={invoice.taxAmount}
            grandTotal={invoice.grandTotal}
            onDiscountChange={setDiscount}
            onTaxRateChange={setTaxRate}
          />

          {/* Custom Fields */}
          <CustomFieldsSection
            fields={invoice.customFields}
            onAdd={addCustomField}
            onUpdate={updateCustomField}
            onRemove={removeCustomField}
          />
        </aside>

        {/* ── Right: Live Preview Panel ── */}
        <main
          id="preview-panel"
          className="flex-1 overflow-y-visible lg:overflow-y-auto bg-slate-100 p-3 sm:p-6"
          aria-label="Invoice live preview"
        >
          <div className="animate-fade-in max-w-[760px] mx-auto w-full">
            <InvoicePreview invoice={invoice} />
          </div>
        </main>

      </div>

      {/* ── Send Email Modal ── */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        invoice={invoice}
        onSend={handleSendEmail}
        isSending={isSendingEmail}
      />
    </div>
  );
};

export default App;
