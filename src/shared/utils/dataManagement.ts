import { notifications } from '@mantine/notifications';

import { db } from '@/features/inventory/services/db';

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
