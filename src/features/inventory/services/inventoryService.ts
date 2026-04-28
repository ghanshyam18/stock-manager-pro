import { notifications } from '@mantine/notifications';

import { db, type InventoryItem } from './db';

export const inventoryService = {
  async deleteItem(id?: number) {
    if (!id) return false;

    try {
      await db.inventory.delete(id);
      notifications.show({
        title: 'Deleted',
        message: 'Item removed from history',
        color: 'red',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete item:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete item from database',
        color: 'red',
      });
      return false;
    }
  },

  async addStock(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = Date.now();
      await db.inventory.add({
        ...item,
        createdAt: now,
        updatedAt: now,
      } as InventoryItem);
      notifications.show({
        title: 'Success',
        message: 'Stock item added successfully',
        color: 'blue',
      });
      return true;
    } catch (error) {
      console.error('Failed to add stock:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save item to database',
        color: 'red',
      });
      return false;
    }
  },
};
