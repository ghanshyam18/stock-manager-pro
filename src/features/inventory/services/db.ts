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

export class StockDatabase extends Dexie {
  inventory!: Table<InventoryItem, number>;

  constructor() {
    super('StockManagementDB');

    // World-class Database Migration Strategy
    this.version(2)
      .stores({
        inventory: '++id, designNo, date, createdAt, updatedAt, [designNo+date]',
      })
      .upgrade(async (tx) => {
        // This runs automatically for users with an existing v1 database
        return tx
          .table('inventory')
          .toCollection()
          .modify((item) => {
            // 1. Ensure timestamps exist
            if (!item.updatedAt) {
              item.updatedAt = item.createdAt || Date.now();
            }
            if (!item.createdAt) {
              item.createdAt = item.updatedAt;
            }

            // 2. Data Cleaning: Ensure numbers are actually numbers
            item.quantity = Number(item.quantity || 0);
            item.price = Number(item.price || 0);

            // 3. ID Normalization
            // If ID was stored as a string in v1, Dexie will handle it,
            // but new items will be numbers. This is fine for IndexedDB.
          });
      });
  }
}

export const db = new StockDatabase();
