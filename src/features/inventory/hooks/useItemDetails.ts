import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { db, type InventoryItem } from '../services/db';

export function useItemDetails(item: InventoryItem | null) {
  const history = useLiveQuery(
    () => (item ? db.inventory.where('designNo').equals(item.designNo).sortBy('date') : []),
    [item]
  );

  const totalStock = useMemo(() => {
    return history?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  }, [history]);

  return {
    history: history || [],
    totalStock,
    entriesCount: history?.length || 0,
  };
}
