'use client';

import { Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { useInventory } from '../hooks/useInventory';
import { type DesignItem } from '../services/db';
import { InventoryHistoryList } from './InventoryHistoryList';
import { InventorySearch } from './InventorySearch';
import { InventoryListingSkeleton } from './InventorySkeleton';
import { InventoryStats } from './InventoryStats';

/**
 * InventoryView is the main container for the Inventory feature.
 */
export function InventoryView() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Centralized Logic Hook
  const {
    isLoading,
    filteredItems,
    designSuggestions,
    stats,
    search,
    setSearch,
    loadMore,
    hasMore,
    isLoadingMore,
    isStale,
  } = useInventory();

  // Event Handlers
  const handleSelectItem = (item: DesignItem) => {
    modals.openContextModal({
      modal: 'item-details',
      innerProps: { item, isMobile },
      size: 'lg',
      padding: 0,
      fullScreen: isMobile,
      withCloseButton: false,
    });
  };

  return (
    <Stack
      gap="md"
      style={{ flexGrow: 1, height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Stack gap="md">
        <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 200ms ease' }}>
          <InventorySearch
            search={search}
            onSearchChange={setSearch}
            designSuggestions={designSuggestions || []}
          />
        </div>
        <InventoryStats stats={stats} />
      </Stack>
      <div style={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
        {isLoading ? (
          <InventoryListingSkeleton />
        ) : (
          <InventoryHistoryList
            items={filteredItems}
            isMobile={isMobile}
            onSelect={handleSelectItem}
            loadMore={loadMore}
            hasMore={hasMore}
            totalCount={stats.totalCount}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
    </Stack>
  );
}
