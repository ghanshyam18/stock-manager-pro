import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';

import { db, type InventoryItem } from '../services/db';

const PAGE_SIZE = 50;

export function useItemDetails(item: InventoryItem | null) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. Fetch Paginated History
  const history = useLiveQuery(async () => {
    if (!item) return [];
    const results = await db.inventory
      .where('designNo')
      .equals(item.designNo)
      .reverse()
      .offset(0)
      .limit(limit)
      .toArray();

    setIsLoadingMore(false);
    return results;
  }, [item, limit]);

  // 2. Fetch Total Stats (Independent of pagination)
  const stats = useLiveQuery(async () => {
    if (!item) return { totalStock: 0, entriesCount: 0 };
    const allMatching = await db.inventory.where('designNo').equals(item.designNo).toArray();

    const totalStock = allMatching.reduce((sum, i) => sum + i.quantity, 0);
    return {
      totalStock,
      entriesCount: allMatching.length,
    };
  }, [item]);

  const loadMore = useCallback(() => {
    if (history && stats && history.length < stats.entriesCount && !isLoadingMore) {
      setIsLoadingMore(true);
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [history, stats, isLoadingMore]);

  return {
    history: history || [],
    totalStock: stats?.totalStock || 0,
    entriesCount: stats?.entriesCount || 0,
    loadMore,
    hasMore: (history?.length || 0) < (stats?.entriesCount || 0),
    isLoadingMore,
  };
}
