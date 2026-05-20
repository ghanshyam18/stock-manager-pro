import { db, DesignItem, Invoice, InvoiceItem, Party } from '@/features/inventory/services/db';

export const invoiceService = {
  /**
   * Search for parties by name
   */
  async searchParties(query: string): Promise<Party[]> {
    if (!query.trim()) {
      return db.parties.orderBy('updatedAt').reverse().limit(10).toArray();
    }
    return db.parties.where('name').startsWithIgnoreCase(query).limit(10).toArray();
  },

  /**
   * Generates the next invoice number (e.g., INV-001)
   */
  async generateNextInvoiceNo(): Promise<string> {
    const lastInvoice = await db.invoices.orderBy('id').last();
    if (!lastInvoice || !lastInvoice.id) {
      return 'INV-001';
    }
    const nextId = lastInvoice.id + 1;
    return `INV-${nextId.toString().padStart(3, '0')}`;
  },

  /**
   * Get design details by design number
   */
  async getDesign(designNo: string): Promise<DesignItem | undefined> {
    return db.designs.get(designNo);
  },

  /**
   * Saves an invoice and its items atomically.
   * If the party doesn't exist (no id provided), it will create the party.
   */
  async saveInvoice(
    invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNo'>,
    itemsData: Omit<InvoiceItem, 'id' | 'invoiceId'>[],
    partyDetails?: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Invoice> {
    return db.transaction('rw', [db.parties, db.invoices, db.invoiceItems], async () => {
      const now = Date.now();
      let partyId = invoiceData.partyId;

      // Handle inline Party creation
      if (!partyId && partyDetails) {
        const existingParty = await db.parties.where('name').equals(partyDetails.name).first();
        if (existingParty && existingParty.id) {
          partyId = existingParty.id;
        } else {
          partyId = await db.parties.add({
            ...partyDetails,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      const invoiceNo = await this.generateNextInvoiceNo();

      const newInvoice: Invoice = {
        ...invoiceData,
        invoiceNo,
        partyId,
        createdAt: now,
        updatedAt: now,
      };

      const invoiceId = await db.invoices.add(newInvoice);
      newInvoice.id = invoiceId;

      const itemsToSave: InvoiceItem[] = itemsData.map((item) => ({
        ...item,
        invoiceId,
      }));

      await db.invoiceItems.bulkAdd(itemsToSave);

      // Note: We are NOT deducting inventory as per the user's explicit request.

      return newInvoice;
    });
  },

  /**
   * Retrieves an invoice by ID along with its items
   */
  async getInvoiceWithItems(
    invoiceId: number
  ): Promise<{ invoice: Invoice; items: InvoiceItem[] }> {
    const invoice = await db.invoices.get(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const items = await db.invoiceItems.where('invoiceId').equals(invoiceId).toArray();
    return { invoice, items };
  },

  /**
   * Gets recent invoices
   */
  async getRecentInvoices(limit = 20): Promise<Invoice[]> {
    return db.invoices.orderBy('createdAt').reverse().limit(limit).toArray();
  },
};
