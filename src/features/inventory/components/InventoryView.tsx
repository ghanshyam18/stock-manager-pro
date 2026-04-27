'use client';

import { Button, Drawer, Group, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

import { useOverlayHistory } from '@/shared/hooks/useOverlayHistory';

import { useInventory } from '../hooks/useInventory';
import { type InventoryItem } from '../services/db';
import { inventoryService } from '../services/inventoryService';
import { InventoryHistoryList } from './InventoryHistoryList';
import { InventorySearch } from './InventorySearch';
import { InventoryListingSkeleton } from './InventorySkeleton';
import { InventoryStats } from './InventoryStats';
import { ItemDetailModal } from './ItemDetailModal';

/**
 * InventoryView is the main container for the Inventory feature.
 * It coordinates data hooks, search, stats, and the virtualized listing.
 */
export function InventoryView() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Modular Disclosures
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);

  // Centralized Logic Hook
  const {
    allItems,
    filteredItems,
    designSuggestions,
    stats,
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    isFilterActive,
    loadMore,
    hasMore,
  } = useInventory();

  // Back button handling
  useOverlayHistory(modalOpened, closeModal, 'inventory-item-details');
  useOverlayHistory(filterOpened, closeFilter, 'inventory-filters');

  // Event Handlers
  const handleDelete = async (id?: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await inventoryService.deleteItem(id);
    }
  };

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    openModal();
  };

  return (
    <Stack gap="md" data-testid="inventory-view-container">
      {/* Search & Filter Component - Always visible */}
      <InventorySearch
        search={search}
        onSearchChange={setSearch}
        designSuggestions={designSuggestions || []}
        isFilterActive={isFilterActive}
        onFilterClick={openFilter}
      />

      {/* Dynamic Stats Component - Always visible */}
      <InventoryStats stats={stats} />

      {/* Main Listing Area - Data or Skeleton */}
      {!allItems ? (
        <InventoryListingSkeleton />
      ) : (
        <InventoryHistoryList
          items={filteredItems}
          isMobile={isMobile || false}
          onDelete={handleDelete}
          onSelect={handleSelectItem}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      )}

      {/* Date Filter Drawer */}
      <Drawer
        opened={filterOpened}
        onClose={closeFilter}
        title={<Text fw={800}>Filter History</Text>}
        position="bottom"
        size="auto"
        radius="24px 24px 0 0"
        padding="xl"
        data-testid="filter-drawer"
      >
        <Stack gap="md">
          <TextInput
            label="From Date"
            type="date"
            size="md"
            radius="md"
            value={dateFilter.start}
            onChange={(e) => setDateFilter({ ...dateFilter, start: e.currentTarget.value })}
            data-testid="filter-start-date"
          />
          <TextInput
            label="To Date"
            type="date"
            size="md"
            radius="md"
            value={dateFilter.end}
            onChange={(e) => setDateFilter({ ...dateFilter, end: e.currentTarget.value })}
            data-testid="filter-end-date"
          />
          <Group grow mt="xl">
            <Button
              variant="subtle"
              radius="xl"
              onClick={() => {
                setDateFilter({ start: '', end: '' });
                closeFilter();
              }}
              data-testid="reset-filters-button"
            >
              Reset
            </Button>
            <Button
              radius="xl"
              onClick={closeFilter}
              color="blue"
              data-testid="apply-filters-button"
            >
              Apply
            </Button>
          </Group>
        </Stack>
      </Drawer>

      {/* Shared Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        opened={modalOpened}
        onClose={closeModal}
        isMobile={isMobile || false}
      />
    </Stack>
  );
}
