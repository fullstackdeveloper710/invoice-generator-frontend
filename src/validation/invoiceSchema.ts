import * as yup from 'yup';

// ─── Phone: digits, spaces, +, -, (, ) only ──────────────────────────────────
const phoneRegex = /^[0-9+\-\s().]*$/;

// ─── Party sub-schema ────────────────────────────────────────────────────────
const partySchema = yup.object({
  name:    yup.string(),
  address: yup.string(),
  email:   yup
    .string()
    .email('Enter a valid email address')
    .nullable()
    .transform((v) => v === '' ? null : v),
  phone: yup
    .string()
    .matches(phoneRegex, 'Phone number can only contain digits, +, -, spaces and ( )')
    .nullable()
    .transform((v) => v === '' ? null : v),
});

// ─── Full invoice schema ──────────────────────────────────────────────────────
export const invoiceSchema = yup.object({
  invoiceNumber: yup
    .string()
    .required('Invoice number is required')
    .min(1, 'Invoice number is required'),

  issueDate: yup
    .string()
    .required('Issue date is required')
    .min(1, 'Issue date is required'),

  dueDate: yup
    .string()
    .required('Due date is required')
    .min(1, 'Due date is required')
    .test(
      'due-after-issue',
      'Due date must be on or after the issue date',
      function (dueDate) {
        const { issueDate } = this.parent;
        if (!issueDate || !dueDate) return true; // let required handle missing
        return dueDate >= issueDate;
      },
    ),

  notes: yup.string(),

  businessDetails: partySchema,
  customerDetails: partySchema,
});

export type InvoiceFormValues = yup.InferType<typeof invoiceSchema>;
