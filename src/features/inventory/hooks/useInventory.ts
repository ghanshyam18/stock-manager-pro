import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';

import { db, type DesignItem } from '../services/db';

export interface DateFilter {
  start: string;
  end: string;
}

const PAGE_SIZE = 50;

/**
 * useInventory hook manages paginated data fetching and filtering of unique designs.
 * High-Performance: Uses DB-level indexing and smart aggregates to ensure
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

  const isDateFilterActive = !!(dateFilter.start || dateFilter.end);

  // 1. Stats Query
  const stats = useLiveQuery(async () => {
    if (!isDateFilterActive) {
      // Direct fast path: query designs table
      let collection = db.designs.toCollection();

      if (deferredSearch) {
        const lowerSearch = deferredSearch.toLowerCase();
        collection = collection.filter((d) => d.designNo.toLowerCase().includes(lowerSearch));
      }

      let totalQty = 0;
      let totalValue = 0;
      let count = 0;

      await collection.each((d) => {
        totalQty += d.totalQuantity;
        totalValue += d.totalValue;
        count++;
      });

      return {
        totalQty,
        totalValue,
        uniqueDesigns: count,
        totalCount: count,
      };
    } else {
      // Date filter path: aggregate from inventory transactions
      let collection = db.inventory.toCollection();

      // Filter by date
      collection = collection.filter((item) => {
        const matchesStart = !dateFilter.start || item.date >= dateFilter.start;
        const matchesEnd = !dateFilter.end || item.date <= dateFilter.end;
        return matchesStart && matchesEnd;
      });

      // Filter by search
      if (deferredSearch) {
        const lowerSearch = deferredSearch.toLowerCase();
        collection = collection.filter((item) => item.designNo.toLowerCase().includes(lowerSearch));
      }

      let totalQty = 0;
      let totalValue = 0;
      const designs = new Set<string>();

      await collection.each((item) => {
        totalQty += item.quantity;
        totalValue += item.quantity * item.price;
        designs.add(item.designNo);
      });

      return {
        totalQty,
        totalValue,
        uniqueDesigns: designs.size,
        totalCount: designs.size,
      };
    }
  }, [deferredSearch, dateFilter]);

  // 2. Paginated List Query of Designs
  const filteredItems = useLiveQuery(async () => {
    if (!isDateFilterActive) {
      // Query designs directly from designs table ordered by updatedAt in reverse
      let collection = db.designs.orderBy('updatedAt').reverse();

      if (deferredSearch) {
        const lowerSearch = deferredSearch.toLowerCase();
        collection = collection.filter((d) => d.designNo.toLowerCase().includes(lowerSearch));
      }

      const result = await collection.limit(limit).toArray();
      setIsLoadingMore(false);
      return result;
    } else {
      // Date filter path: must query inventory, filter, and group
      let collection = db.inventory.toCollection();

      // Filter by date
      collection = collection.filter((item) => {
        const matchesStart = !dateFilter.start || item.date >= dateFilter.start;
        const matchesEnd = !dateFilter.end || item.date <= dateFilter.end;
        return matchesStart && matchesEnd;
      });

      // Filter by search
      if (deferredSearch) {
        const lowerSearch = deferredSearch.toLowerCase();
        collection = collection.filter((item) => item.designNo.toLowerCase().includes(lowerSearch));
      }

      // Aggregate in-memory
      const groups = new Map<
        string,
        { designNo: string; totalQuantity: number; totalValue: number; updatedAt: number }
      >();
      await collection.each((item) => {
        const existing = groups.get(item.designNo);
        const qty = Number(item.quantity || 0);
        const val = qty * Number(item.price || 0);
        const itemTime = item.updatedAt || item.createdAt || 0;

        if (existing) {
          existing.totalQuantity += qty;
          existing.totalValue += val;
          if (itemTime > existing.updatedAt) {
            existing.updatedAt = itemTime;
          }
        } else {
          groups.set(item.designNo, {
            designNo: item.designNo,
            totalQuantity: qty,
            totalValue: val,
            updatedAt: itemTime,
          });
        }
      });

      // Sort and paginate
      const sorted = Array.from(groups.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      const paginated = sorted.slice(0, limit);

      // Resolve design details (image, createdAt)
      const resolvedItems = await Promise.all(
        paginated.map(async (p) => {
          const design = await db.designs.get(p.designNo);
          return {
            designNo: p.designNo,
            image: design?.image || null,
            totalQuantity: p.totalQuantity,
            totalValue: p.totalValue,
            createdAt: design?.createdAt || p.updatedAt,
            updatedAt: design?.updatedAt || p.updatedAt,
          } as DesignItem;
        })
      );

      setIsLoadingMore(false);
      return resolvedItems;
    }
  }, [deferredSearch, dateFilter, limit]);

  // Suggestions for auto-complete: fast query directly from unique designs table
  const designSuggestions = useLiveQuery(async () => {
    const keys = await db.designs.orderBy('designNo').keys();
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
    isFilterActive: isDateFilterActive,
    loadMore,
    hasMore: (filteredItems?.length || 0) < (stats?.totalCount || 0),
    isLoadingMore,
    isStale: search !== deferredSearch,
  };
}
