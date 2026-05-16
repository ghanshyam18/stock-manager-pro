import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';

import { db, type DesignItem } from '../services/db';

const PAGE_SIZE = 50;

export function useItemDetails(
  item: DesignItem | { designNo: string; image?: Blob | string | null } | null
) {
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
  }, [item?.designNo, limit]);

  // 2. Fetch Total Stats (Independent of pagination)
  const stats = useLiveQuery(async () => {
    if (!item) return { totalStock: 0, totalValue: 0, entriesCount: 0 };

    const [design, entriesCount] = await Promise.all([
      db.designs.get(item.designNo),
      db.inventory.where('designNo').equals(item.designNo).count(),
    ]);

    return {
      totalStock: design?.totalQuantity || 0,
      totalValue: design?.totalValue || 0,
      entriesCount: entriesCount || 0,
    };
  }, [item?.designNo]);

  const loadMore = useCallback(() => {
    if (history && stats && history.length < stats.entriesCount && !isLoadingMore) {
      setIsLoadingMore(true);
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [history, stats, isLoadingMore]);

  return {
    history: history || [],
    totalStock: stats?.totalStock || 0,
    totalValue: stats?.totalValue || 0,
    entriesCount: stats?.entriesCount || 0,
    loadMore,
    hasMore: (history?.length || 0) < (stats?.entriesCount || 0),
    isLoadingMore,
  };
}
