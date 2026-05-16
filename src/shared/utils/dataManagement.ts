import { notifications } from '@mantine/notifications';

import { db, type DesignItem, type InventoryItem } from '@/features/inventory/services/db';

/**
 * DataManagement - SaaS-Grade Data Portability.
 * High-Efficiency Export/Import using the dexie-export-import standard.
 */
export const DataManagement = {
  /**
   * Exports the entire database including images (Blobs) as a binary-safe JSON.
   */
  async exportToJSON(onProgress?: (percent: number) => void) {
    try {
      // Dynamic import to ensure compatibility with Next.js static export
      const { exportDB } = await import('dexie-export-import');

      const blob = await exportDB(db, {
        progressCallback: ({ totalRows, completedRows }) => {
          if (onProgress && totalRows) {
            onProgress(Math.round((completedRows / totalRows) * 100));
          }
          return true;
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stockly-backup-${new Date().toISOString().split('T')[0]}.json`;

      link.click();

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100);

      notifications.show({
        title: 'Export Success',
        message: 'Your backup file has been generated.',
        color: 'blue',
      });
    } catch (error) {
      console.error('Export failed:', error);
      notifications.show({
        title: 'Export Failed',
        message: 'There was an error generating your backup',
        color: 'red',
      });
    }
  },

  /**
   * Restores the database from a professional backup file.
   * This uses the official importInto strategy for existing database instances.
   */
  async importFromJSON(file: File, onProgress?: (percent: number) => void) {
    try {
      const { importInto } = await import('dexie-export-import');

      // Use a full-overwrite strategy for a clean restore
      await importInto(db, file, {
        clearTablesBeforeImport: true,
        overwriteValues: true,
        progressCallback: ({ totalRows, completedRows }) => {
          if (onProgress && totalRows) {
            onProgress(Math.round((completedRows / totalRows) * 100));
          }
          return true;
        },
      });

      // Post-import verification for Legacy Backups (V1/V2/V3) which don't have the 'designs' table populated
      const inventoryCount = await db.inventory.count();
      const designsCount = await db.designs.count();

      if (inventoryCount > 0 && designsCount === 0) {
        console.warn('Legacy backup detected. Reconstructing designs table aggregates...');

        await db.transaction('rw', db.inventory, db.designs, async () => {
          const allInventory = await db.inventory.toArray();
          const designMap = new Map<string, DesignItem & { imageUpdatedAt: number }>();

          for (const item of allInventory) {
            const designNo = item.designNo;
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            let itemImage = item.image;

            // Support base64 image migration if any exist from older schemas
            if (typeof itemImage === 'string' && itemImage.startsWith('data:')) {
              try {
                const response = await fetch(itemImage);
                itemImage = await response.blob();
              } catch (err) {
                console.error('Failed to convert base64 image to Blob during legacy restore:', err);
              }
            }

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
            return designData;
          });

          if (designsToInsert.length > 0) {
            await db.designs.bulkPut(designsToInsert);
          }

          // Strip legacy image properties from transaction items to avoid duplication
          await db.inventory.toCollection().modify((item: InventoryItem) => {
            delete item.image;
          });
        });
        console.warn('Successfully reconstructed designs table aggregates.');
      }

      notifications.show({
        title: 'Restore Successful',
        message: 'Database has been fully restored!',
        color: 'teal',
      });

      // Reload to ensure all UI components and hooks reflect the new state
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Import failed:', error);
      notifications.show({
        title: 'Restore Failed',
        message: 'The file provided is not a valid Stockly backup.',
        color: 'red',
      });
    }
  },
};
