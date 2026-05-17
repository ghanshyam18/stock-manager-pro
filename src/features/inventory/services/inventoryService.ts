import { notifications } from '@mantine/notifications';

import { db, type DesignItem, type InventoryItem } from './db';

export const inventoryService = {
  async deleteItem(id?: number) {
    if (!id) return false;

    try {
      await db.transaction('rw', [db.inventory, db.designs], async () => {
        // 1. Fetch original log item first to determine amount to deduct
        const item = await db.inventory.get(id);
        if (!item) return;

        // 2. Delete raw log from db.inventory
        await db.inventory.delete(id);

        // 3. Deduct counts from db.designs aggregates
        const qty = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        const val = qty * price;

        const design = await db.designs.get(item.designNo);
        if (design) {
          const nextQty = Math.max(0, design.totalQuantity - qty);
          const nextVal = Math.max(0, design.totalValue - val);

          if (nextQty === 0) {
            await db.designs.delete(item.designNo);
          } else {
            await db.designs.put({
              ...design,
              totalQuantity: nextQty,
              totalValue: nextVal,
              updatedAt: Date.now(),
            });
          }
        }
      });

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
      await db.transaction('rw', [db.inventory, db.designs], async () => {
        // 1. Extract image if present and strip it from the stock entry to prevent duplicate binary storage
        const { image, ...cleanItem } = item;

        // 2. Add raw log to db.inventory
        await db.inventory.add({
          ...cleanItem,
          createdAt: now,
          updatedAt: now,
        } as InventoryItem);

        // 3. Increment aggregated calculations in db.designs
        const qty = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        const val = qty * price;

        const design = await db.designs.get(item.designNo);
        if (design) {
          const updateData: DesignItem = {
            ...design,
            totalQuantity: design.totalQuantity + qty,
            totalValue: design.totalValue + val,
            updatedAt: now,
          };
          if (image) {
            updateData.image = image;
          }
          await db.designs.put(updateData);
        } else {
          await db.designs.add({
            designNo: item.designNo,
            image: image || null,
            totalQuantity: qty,
            totalValue: val,
            createdAt: now,
            updatedAt: now,
          });
        }
      });

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

  async updateDesignImage(designNo: string, image: Blob | string) {
    try {
      await db.designs.update(designNo, {
        image,
        updatedAt: Date.now(),
      });
      notifications.show({
        title: 'Success',
        message: 'Design image updated successfully',
        color: 'teal',
      });
      return true;
    } catch (error) {
      console.error('Failed to update design image:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update design image',
        color: 'red',
      });
      return false;
    }
  },
};
