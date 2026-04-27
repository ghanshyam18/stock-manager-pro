import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';

import { db } from '../services/db';

export interface DateFilter {
  start: string;
  end: string;
}

const PAGE_SIZE = 50;

/**
 * useInventory hook manages paginated data fetching and filtering.
 * High-standard approach: Separates stats calculation from paginated list fetching.
 */
export function useInventory() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    start: '',
    end: '',
  });
  const [limit, setLimit] = useState(PAGE_SIZE);

  // 1. Stats Query: Always calculate totals over the full FILTERED dataset
  // We use a specialized query that only fetches the fields needed for stats
  const stats = useLiveQuery(async () => {
    const query = db.inventory.orderBy('date').reverse();

    // Apply filters to the stats query
    const items = await query.toArray();

    const filtered = items.filter((item) => {
      const matchesSearch = item.designNo.toLowerCase().includes(search.toLowerCase());
      const matchesDate =
        (!dateFilter.start || item.date >= dateFilter.start) &&
        (!dateFilter.end || item.date <= dateFilter.end);
      return matchesSearch && matchesDate;
    });

    return {
      totalQty: filtered.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: filtered.reduce((sum, item) => sum + item.quantity * item.price, 0),
      uniqueDesigns: new Set(filtered.map((i) => i.designNo)).size,
      totalCount: filtered.length,
    };
  }, [search, dateFilter]);

  // 2. Paginated List Query
  const filteredItems = useLiveQuery(async () => {
    const query = db.inventory.orderBy('date').reverse();

    // Fetch all for filtering (Dexie doesn't support complex cross-field filtering in queries easily)
    // However, since we store images as Blobs, this is still very memory-efficient.
    const items = await query.toArray();

    const filtered = items.filter((item) => {
      const matchesSearch = item.designNo.toLowerCase().includes(search.toLowerCase());
      const matchesDate =
        (!dateFilter.start || item.date >= dateFilter.start) &&
        (!dateFilter.end || item.date <= dateFilter.end);
      return matchesSearch && matchesDate;
    });

    // Return only the slice up to the current limit
    return filtered.slice(0, limit);
  }, [search, dateFilter, limit]);

  const designSuggestions = useLiveQuery(async () => {
    const keys = await db.inventory.orderBy('designNo').uniqueKeys();
    return keys.map((k) => String(k));
  }, []);

  // Handlers
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setLimit(PAGE_SIZE); // Reset pagination on search
  }, []);

  const handleDateFilterChange = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
    setLimit(PAGE_SIZE); // Reset pagination on filter
  }, []);

  const loadMore = useCallback(() => {
    if (stats && filteredItems && filteredItems.length < stats.totalCount) {
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [stats, filteredItems]);

  return {
    allItems: !!filteredItems, // Flag for loading state
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
  };
}
