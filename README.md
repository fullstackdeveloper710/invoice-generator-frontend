# Invoice Generator - Frontend

Frontend web application for the Invoice Generator. Built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form & Yup (form validation)
- Axios

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running on `http://localhost:5000`

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Ensure `VITE_API_URL` points to your backend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Features

- Split-screen layout with real-time preview
- Line item editor with automatic calculation of line totals, subtotal, discount, tax, and grand total
- Custom fields support (with show/hide toggle on invoice)
- Form validation for required fields, dates, emails, and phone numbers
- Browser-native Print / Save to PDF support with print stylesheet
- Save and reload invoices via URL ID parameter (`?id=...`)
- Email invoice modal to send directly from the app
