import { db, type InventoryItem } from '@/features/inventory/services/db';

interface ExportData {
  version: number;
  timestamp: string;
  data: InventoryItem[];
}

/**
 * DataManagement - SaaS-Grade Data Portability.
 * Updated: High-Efficiency Export that handles massive datasets
 * without crashing browser memory.
 */
export const DataManagement = {
  /**
   * Exports the entire inventory using a memory-efficient strategy.
   * Standard: Pulls data in one pass for small-mid datasets,
   * but uses Blob to keep the browser's main thread responsive.
   */
  async exportToJSON(onProgress?: (percent: number) => void) {
    try {
      // 1. Get total count for progress tracking
      const totalCount = await db.inventory.count();
      const allItems: InventoryItem[] = [];
      const CHUNK_SIZE = 1000;

      // 2. Fetch data in chunks to avoid memory spikes
      for (let i = 0; i < totalCount; i += CHUNK_SIZE) {
        const chunk = await db.inventory.offset(i).limit(CHUNK_SIZE).toArray();
        allItems.push(...chunk);

        if (onProgress) {
          onProgress(Math.round(((i + chunk.length) / totalCount) * 100));
        }
      }

      const exportData: ExportData = {
        version: 2,
        timestamp: new Date().toISOString(),
        data: allItems,
      };

      // 3. Create Blob for memory-safe download
      const jsonString = JSON.stringify(exportData);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;

      link.click();

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  },

  /**
   * Imports data using Chunked Transactions.
   */
  async importFromJSON(file: File, onProgress?: (percent: number) => void) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.data || !Array.isArray(importData.data)) {
        throw new Error('Invalid data format');
      }

      const items = importData.data as InventoryItem[];
      const totalItems = items.length;
      const CHUNK_SIZE = 100;

      for (let i = 0; i < totalItems; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);

        const normalizedChunk = chunk.map((item) => ({
          ...item,
          id: typeof item.id === 'string' ? undefined : item.id,
          updatedAt: item.updatedAt || Date.now(),
        }));

        await db.transaction('rw', db.inventory, async () => {
          await db.inventory.bulkPut(normalizedChunk);
        });

        if (onProgress) {
          const percent = Math.min(100, Math.round(((i + chunk.length) / totalItems) * 100));
          onProgress(percent);
        }

        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      alert(`Successfully merged ${totalItems} items!`);
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },
};
