import Dexie, { type Table } from 'dexie';

export interface InventoryItem {
  id?: string;
  designNo: string;
  image: Blob | string; // Supports both binary Blob and legacy/seed Base64 strings
  quantity: number;
  price: number;
  date: string; // ISO date
  createdAt: number;
}

export class StockDatabase extends Dexie {
  inventory!: Table<InventoryItem>;

  constructor() {
    super('StockManagementDB');
    this.version(1).stores({
      inventory: '++id, designNo, date, createdAt',
    });
  }
}

export const db = new StockDatabase();
