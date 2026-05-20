import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';

import { db } from '../../inventory/services/db';

const PAGE_SIZE = 20;

export function useInvoices() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. Count Query
  const totalCount = useLiveQuery(async () => {
    let collection = db.invoices.toCollection();
    if (deferredSearch) {
      const lowerSearch = deferredSearch.toLowerCase();
      collection = collection.filter(
        (i) =>
          i.partyName.toLowerCase().includes(lowerSearch) ||
          i.invoiceNo.toLowerCase().includes(lowerSearch)
      );
    }
    return collection.count();
  }, [deferredSearch]);

  // 2. Paginated List Query
  const invoices = useLiveQuery(async () => {
    let collection = db.invoices.orderBy('createdAt').reverse();

    if (deferredSearch) {
      const lowerSearch = deferredSearch.toLowerCase();
      collection = collection.filter(
        (i) =>
          i.partyName.toLowerCase().includes(lowerSearch) ||
          i.invoiceNo.toLowerCase().includes(lowerSearch)
      );
    }

    const result = await collection.limit(limit).toArray();
    setIsLoadingMore(false);
    return result;
  }, [deferredSearch, limit]);

  // Reset pagination when search changes
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [deferredSearch]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && totalCount !== undefined && invoices && invoices.length < totalCount) {
      setIsLoadingMore(true);
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [isLoadingMore, totalCount, invoices]);

  return {
    isLoading: invoices === undefined,
    invoices: invoices || [],
    totalCount: totalCount || 0,
    search,
    setSearch,
    loadMore,
    hasMore: (invoices?.length || 0) < (totalCount || 0),
    isLoadingMore,
    isStale: search !== deferredSearch,
  };
}
