import { type Collection } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';

import { db, type InventoryItem } from '../services/db';

export interface DateFilter {
  start: string;
  end: string;
}

const PAGE_SIZE = 50;

/**
 * useInventory hook manages paginated data fetching and filtering.
 * High-Performance: Uses DB-level limit() and a loading gate to ensure
 * smooth, scalable data handling.
 */
export function useInventory() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    start: '',
    end: '',
  });
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Helper to apply filters to a collection
  const applyFilters = useCallback(
    (collection: Collection<InventoryItem, number>) => {
      let filtered = collection;

      if (deferredSearch) {
        const lowerSearch = deferredSearch.toLowerCase();
        filtered = filtered.filter((item: InventoryItem) =>
          item.designNo.toLowerCase().includes(lowerSearch)
        );
      }

      if (dateFilter.start || dateFilter.end) {
        filtered = filtered.filter((item: InventoryItem) => {
          const matchesStart = !dateFilter.start || item.date >= dateFilter.start;
          const matchesEnd = !dateFilter.end || item.date <= dateFilter.end;
          return matchesStart && matchesEnd;
        });
      }

      return filtered;
    },
    [deferredSearch, dateFilter]
  );

  // 1. Stats Query
  const stats = useLiveQuery(async () => {
    const collection = db.inventory.orderBy('date').reverse();
    const filteredCollection = applyFilters(collection);

    const totalCount = await filteredCollection.count();

    let totalQty = 0;
    let totalValue = 0;
    const designs = new Set<string>();

    await filteredCollection.each((item) => {
      totalQty += item.quantity;
      totalValue += item.quantity * item.price;
      designs.add(item.designNo);
    });

    return {
      totalQty,
      totalValue,
      uniqueDesigns: designs.size,
      totalCount,
    };
  }, [deferredSearch, dateFilter]);

  // 2. Paginated List Query
  const filteredItems = useLiveQuery(async () => {
    const collection = db.inventory.orderBy('date').reverse();
    const filteredCollection = applyFilters(collection);

    const result = await filteredCollection.limit(limit).toArray();

    // Reset loading state once data is retrieved
    setIsLoadingMore(false);
    return result;
  }, [deferredSearch, dateFilter, limit]);

  const designSuggestions = useLiveQuery(async () => {
    const keys = await db.inventory.orderBy('designNo').uniqueKeys();
    return keys.map((k) => String(k));
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [deferredSearch, dateFilter]);

  // Handlers
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
  }, []);

  const handleDateFilterChange = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && stats && filteredItems && filteredItems.length < stats.totalCount) {
      setIsLoadingMore(true);
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [isLoadingMore, stats, filteredItems]);

  return {
    isLoading: filteredItems === undefined,
    filteredItems: filteredItems || [],
    designSuggestions,
    stats: stats || { totalQty: 0, totalValue: 0, uniqueDesigns: 0, totalCount: 0 },
    search,
    setSearch: handleSearchChange,
    dateFilter,
    setDateFilter: handleDateFilterChange,
    isFilterActive: !!(dateFilter.start || dateFilter.end),
    loadMore,
    hasMore: (filteredItems?.length || 0) < (stats?.totalCount || 0),
    isLoadingMore,
    isStale: search !== deferredSearch,
  };
}
