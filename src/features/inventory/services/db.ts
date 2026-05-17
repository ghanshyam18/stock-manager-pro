import Dexie, { type Table } from 'dexie';

export interface DesignItem {
  designNo: string;
  image: Blob | string | null;
  totalQuantity: number;
  totalValue: number;
  createdAt: number;
  updatedAt: number;
}

export interface InventoryItem {
  id?: number;
  designNo: string;
  image?: Blob | string; // Kept optional for backward compatibility and during migrations
  quantity: number;
  price: number;
  date: string; // ISO date
  createdAt: number;
  updatedAt: number;
}

export interface Party {
  id?: number;
  name: string;
  address?: string;
  contact?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Invoice {
  id?: number;
  invoiceNo: string;
  partyId?: number;
  partyName: string;
  partyAddress?: string;
  partyContact?: string;
  dispatchedThrough?: string;
  date: string;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  createdAt: number;
  updatedAt: number;
}

export interface InvoiceItem {
  id?: number;
  invoiceId: number;
  designNo: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Helper to convert legacy Base64 data URLs to binary Blobs.
 * Used during database migration to optimize storage and performance.
 */
async function dataURLToBlob(dataURL: string): Promise<Blob> {
  const response = await fetch(dataURL);
  return await response.blob();
}

export class StockDatabase extends Dexie {
  inventory!: Table<InventoryItem, number>;
  designs!: Table<DesignItem, string>;
  parties!: Table<Party, number>;
  invoices!: Table<Invoice, number>;
  invoiceItems!: Table<InvoiceItem, number>;

  constructor() {
    super('StockManagementDB');

    // Version 1: Initial Schema
    this.version(1).stores({
      inventory: '++id, designNo, date, createdAt',
    });

    // Version 2: Added updatedAt and compound index
    this.version(2)
      .stores({
        inventory: '++id, designNo, date, createdAt, updatedAt, [designNo+date]',
      })
      .upgrade((tx) => {
        return tx
          .table('inventory')
          .toCollection()
          .modify((item: InventoryItem) => {
            if (!item.updatedAt) {
              item.updatedAt = item.createdAt || Date.now();
            }
            if (!item.createdAt) {
              item.createdAt = item.updatedAt;
            }
            item.quantity = Number(item.quantity || 0);
            item.price = Number(item.price || 0);
          });
      });

    // Version 3: Binary Migration (Base64 -> Blob)
    // Ensures all legacy images are converted to binary for maximum performance and portability.
    this.version(3).upgrade(async (tx) => {
      await tx
        .table('inventory')
        .toCollection()
        .modify(async (item: InventoryItem) => {
          if (typeof item.image === 'string' && item.image.startsWith('data:')) {
            try {
              item.image = await dataURLToBlob(item.image);
            } catch (error) {
              console.error('Failed to migrate image to Blob:', error);
              // Fallback: keep as string if conversion fails to prevent data loss
            }
          }
        });
    });

    // Version 4: Database Normalization & Materialized Aggregates
    // Introduces designs master table and migrates all existing images to it.
    // Removes images from inventory entries to prevent duplication.
    this.version(4)
      .stores({
        designs: 'designNo, createdAt, updatedAt',
        inventory: '++id, designNo, date',
      })
      .upgrade(async (tx) => {
        const inventoryTable = tx.table('inventory');
        const designsTable = tx.table('designs');

        const allInventory = await inventoryTable.toArray();
        const designMap = new Map<string, DesignItem & { imageUpdatedAt: number }>();

        for (const item of allInventory) {
          const designNo = item.designNo;
          const qty = Number(item.quantity || 0);
          const price = Number(item.price || 0);
          const itemImage = item.image;
          const itemUpdatedAt = item.updatedAt || item.createdAt || Date.now();
          const itemCreatedAt = item.createdAt || item.updatedAt || Date.now();

          const existing = designMap.get(designNo);
          if (!existing) {
            designMap.set(designNo, {
              designNo,
              image: itemImage || null,
              imageUpdatedAt: itemImage ? itemUpdatedAt : 0,
              totalQuantity: qty,
              totalValue: qty * price,
              createdAt: itemCreatedAt,
              updatedAt: itemUpdatedAt,
            });
          } else {
            existing.totalQuantity += qty;
            existing.totalValue += qty * price;
            if (itemCreatedAt < existing.createdAt) {
              existing.createdAt = itemCreatedAt;
            }
            if (itemUpdatedAt > existing.updatedAt) {
              existing.updatedAt = itemUpdatedAt;
            }

            if (itemImage) {
              if (!existing.image || itemUpdatedAt > existing.imageUpdatedAt) {
                existing.image = itemImage;
                existing.imageUpdatedAt = itemUpdatedAt;
              }
            }
          }
        }

        const designsToInsert = Array.from(designMap.values()).map((d) => {
          const { imageUpdatedAt: _imageUpdatedAt, ...designData } = d;
          return designData as DesignItem;
        });

        if (designsToInsert.length > 0) {
          await designsTable.bulkPut(designsToInsert);
        }

        // Clean up individual transaction items to remove the image property
        await inventoryTable.toCollection().modify((item: Record<string, unknown>) => {
          delete item.image;
        });
      });

    // Version 5: Introduces invoices, invoiceItems and parties tables for Quick Invoicing module
    this.version(5).stores({
      designs: 'designNo, createdAt, updatedAt',
      inventory: '++id, designNo, date',
      parties: '++id, name, updatedAt',
      invoices: '++id, invoiceNo, partyId, date, createdAt',
      invoiceItems: '++id, invoiceId, designNo',
    });
  }
}

export const db = new StockDatabase();
