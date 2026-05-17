import { pdf } from '@react-pdf/renderer';
import React from 'react';

import { InvoicePdfDocument } from '../components/InvoicePdfDocument';
import { invoiceService } from '../services/invoiceService';

export const downloadInvoicePdf = async (invoiceId: number): Promise<void> => {
  try {
    const { invoice, items } = await invoiceService.getInvoiceWithItems(invoiceId);

    // Map thumbnail URLs for PDF rendering
    const itemsWithThumbs = await Promise.all(
      items.map(async (item) => {
        const design = await invoiceService.getDesign(item.designNo);
        let thumbnailUrl = undefined;
        if (design?.image) {
          thumbnailUrl =
            design.image instanceof Blob ? URL.createObjectURL(design.image) : design.image;
        }
        return { ...item, thumbnailUrl };
      })
    );

    // Generate the PDF blob
    const blob = await pdf(
      <InvoicePdfDocument invoice={invoice} items={itemsWithThumbs} />
    ).toBlob();

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate or download PDF', error);
    throw error;
  }
};
