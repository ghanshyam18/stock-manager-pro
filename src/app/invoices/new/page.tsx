'use client';

import { Container } from '@mantine/core';

import { QuickInvoiceForm } from '@/features/invoices/components/QuickInvoiceForm';

export default function NewInvoicePage() {
  return (
    <Container size="lg" py="xl">
      <QuickInvoiceForm />
    </Container>
  );
}
