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

    // ==========================================
    // DEXIE LIFECYCLE HOOKS
    // Used to automatically keep aggregates and images synchronized
    // ==========================================

    this.inventory.hook('creating', (primKey, obj, transaction) => {
      if (!this.isOpen()) return;
      const designsTable = transaction.table('designs');
      const qty = Number(obj.quantity || 0);
      const price = Number(obj.price || 0);
      const val = qty * price;
      const imageToSave = obj.image;

      // Strip image from transaction record to prevent storage duplication
      if (obj.hasOwnProperty('image')) {
        delete obj.image;
      }

      designsTable
        .get(obj.designNo)
        .then((design) => {
          if (design) {
            const updateData: DesignItem = {
              ...design,
              totalQuantity: design.totalQuantity + qty,
              totalValue: design.totalValue + val,
              updatedAt: Date.now(),
            };
            if (imageToSave) {
              updateData.image = imageToSave;
            }
            designsTable.put(updateData);
          } else {
            designsTable.add({
              designNo: obj.designNo,
              image: imageToSave || null,
              totalQuantity: qty,
              totalValue: val,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        })
        .catch((err) => console.error('Aggregation error in creating hook:', err));
    });

    this.inventory.hook(
      'updating',
      (modifications: Partial<InventoryItem>, primKey, obj, transaction) => {
        if (!this.isOpen()) return;
        const designsTable = transaction.table('designs');

        const oldQty = Number(obj.quantity || 0);
        const oldPrice = Number(obj.price || 0);
        const oldVal = oldQty * oldPrice;

        const newQty = Number(
          modifications.hasOwnProperty('quantity') ? modifications.quantity : obj.quantity
        );
        const newPrice = Number(
          modifications.hasOwnProperty('price') ? modifications.price : obj.price
        );
        const newVal = newQty * newPrice;

        const qtyDelta = newQty - oldQty;
        const valDelta = newVal - oldVal;

        const designNo = modifications.hasOwnProperty('designNo')
          ? modifications.designNo
          : obj.designNo;

        if (designNo !== obj.designNo) {
          // Handle design number changes (transfer totals between designs)
          designsTable
            .get(obj.designNo)
            .then((oldDesign) => {
              if (oldDesign) {
                const nextQty = Math.max(0, oldDesign.totalQuantity - oldQty);
                const nextVal = Math.max(0, oldDesign.totalValue - oldVal);
                if (nextQty === 0) {
                  designsTable.delete(obj.designNo);
                } else {
                  designsTable.put({
                    ...oldDesign,
                    totalQuantity: nextQty,
                    totalValue: nextVal,
                    updatedAt: Date.now(),
                  });
                }
              }
            })
            .catch((err) => console.error('Aggregation error transferring from old design:', err));

          designsTable
            .get(designNo)
            .then((newDesign) => {
              if (newDesign) {
                designsTable.put({
                  ...newDesign,
                  totalQuantity: newDesign.totalQuantity + newQty,
                  totalValue: newDesign.totalValue + newVal,
                  updatedAt: Date.now(),
                });
              } else {
                designsTable.add({
                  designNo,
                  image: null,
                  totalQuantity: newQty,
                  totalValue: newVal,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
              }
            })
            .catch((err) => console.error('Aggregation error transferring to new design:', err));
        } else {
          // Normal update to the same design
          designsTable
            .get(designNo)
            .then((design) => {
              if (design) {
                designsTable.put({
                  ...design,
                  totalQuantity: design.totalQuantity + qtyDelta,
                  totalValue: design.totalValue + valDelta,
                  updatedAt: Date.now(),
                });
              }
            })
            .catch((err) => console.error('Aggregation error in updating hook:', err));
        }
      }
    );

    this.inventory.hook('deleting', (primKey, obj, transaction) => {
      if (!this.isOpen()) return;
      const designsTable = transaction.table('designs');
      const qty = Number(obj.quantity || 0);
      const price = Number(obj.price || 0);
      const val = qty * price;

      designsTable
        .get(obj.designNo)
        .then((design) => {
          if (design) {
            const nextQty = Math.max(0, design.totalQuantity - qty);
            const nextVal = Math.max(0, design.totalValue - val);
            if (nextQty === 0) {
              designsTable.delete(obj.designNo);
            } else {
              designsTable.put({
                ...design,
                totalQuantity: nextQty,
                totalValue: nextVal,
                updatedAt: Date.now(),
              });
            }
          }
        })
        .catch((err) => console.error('Aggregation error in deleting hook:', err));
    });
  }
}

export const db = new StockDatabase();
