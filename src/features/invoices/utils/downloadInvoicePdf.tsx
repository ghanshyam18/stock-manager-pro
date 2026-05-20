import React from 'react';

import { InvoicePdfDocument } from '../components/InvoicePdfDocument';
import { invoiceService } from '../services/invoiceService';

export const downloadInvoicePdf = async (invoiceId: number): Promise<void> => {
  const objectUrlsToRevoke: string[] = [];
  try {
    const { invoice, items } = await invoiceService.getInvoiceWithItems(invoiceId);

    // Map thumbnail URLs for PDF rendering
    const itemsWithThumbs = await Promise.all(
      items.map(async (item) => {
        const design = await invoiceService.getDesign(item.designNo);
        let thumbnailUrl = undefined;
        if (design?.image) {
          if (design.image instanceof Blob) {
            thumbnailUrl = URL.createObjectURL(design.image);
            objectUrlsToRevoke.push(thumbnailUrl);
          } else {
            thumbnailUrl = design.image;
          }
        }
        return { ...item, thumbnailUrl };
      })
    );

    // Dynamically import @react-pdf/renderer to reduce initial bundle size significantly
    const { pdf } = await import('@react-pdf/renderer');

    // Safely load business profile from localStorage
    let businessProfile = undefined;
    try {
      const stored = localStorage.getItem('stockly_business_profile');
      if (stored) {
        businessProfile = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse business profile for PDF:', e);
    }

    // Generate the PDF blob
    const blob = await pdf(
      <InvoicePdfDocument
        invoice={invoice}
        items={itemsWithThumbs}
        businessProfile={businessProfile}
      />
    ).toBlob();

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the PDF blob URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate or download PDF', error);
    throw error;
  } finally {
    // Clean up all dynamically created design thumbnail Object URLs to prevent memory leaks
    objectUrlsToRevoke.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Failed to revoke object URL:', e);
      }
    });
  }
};
