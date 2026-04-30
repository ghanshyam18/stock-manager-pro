import Dexie, { type Table } from 'dexie';

export interface InventoryItem {
  id?: number;
  designNo: string;
  image: Blob | string;
  quantity: number;
  price: number;
  date: string; // ISO date
  createdAt: number;
  updatedAt: number;
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
  }
}

export const db = new StockDatabase();
