'use client';

import { LoadingOverlay, Progress, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useState } from 'react';

import { DataManagement } from '@/shared/utils/dataManagement';

import { useInventory } from '../hooks/useInventory';
import { type InventoryItem } from '../services/db';
import { inventoryService } from '../services/inventoryService';
import { InventoryHistoryList } from './InventoryHistoryList';
import { InventorySearch } from './InventorySearch';
import { InventoryListingSkeleton } from './InventorySkeleton';
import { InventoryStats } from './InventoryStats';

/**
 * InventoryView is the main container for the Inventory feature.
 */
export function InventoryView() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Data Management Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Centralized Logic Hook
  const {
    isLoading,
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
    isLoadingMore,
    isStale,
  } = useInventory();

  // Event Handlers
  const handleDelete = (id?: number) => {
    modals.openConfirmModal({
      title: <Text fw={800}>Delete Record</Text>,
      children: (
        <Text size="sm" fw={500}>
          Are you sure you want to delete this inventory record? This action is permanent and cannot
          be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Keep it' },
      confirmProps: { color: 'red', radius: 'xl' },
      cancelProps: { variant: 'subtle', radius: 'xl' },
      centered: true,
      radius: 'lg',
      onConfirm: async () => {
        await inventoryService.deleteItem(id);
      },
    });
  };

  const handleSelectItem = (item: InventoryItem) => {
    modals.openContextModal({
      modal: 'item-details',
      innerProps: { item, isMobile },
      size: 'lg',
      padding: 0,
      fullScreen: isMobile,
      withCloseButton: false,
    });
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setProgress(0);
    await DataManagement.exportToJSON((p) => setProgress(p));
    setIsProcessing(false);
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    await DataManagement.importFromJSON(file, (p) => setProgress(p));
    setIsProcessing(false);
  };

  const handleOpenFilters = () => {
    modals.openContextModal({
      modal: 'inventory-filters',
      title: <Text fw={800}>Settings & Filters</Text>,
      innerProps: {
        dateFilter,
        setDateFilter,
        onExport: handleExport,
        onImport: handleImport,
      },
      radius: '24px 24px 0 0',
      transitionProps: { transition: 'slide-up', duration: 300 },
      styles: {
        content: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '24px 24px 0 0',
        },
      },
    });
  };

  return (
    <Stack
      gap="md"
      style={{ flexGrow: 1, height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <LoadingOverlay
        visible={isProcessing}
        overlayProps={{ blur: 2 }}
        loaderProps={{
          children: (
            <Stack align="center" gap="xs">
              <Text fw={700}>Processing Data...</Text>
              <Progress value={progress} w={200} size="xl" radius="xl" animated />
              <Text size="sm" c="dimmed">
                {progress}% complete
              </Text>
            </Stack>
          ),
        }}
      />

      <Stack gap="md">
        <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 200ms ease' }}>
          <InventorySearch
            search={search}
            onSearchChange={setSearch}
            designSuggestions={designSuggestions || []}
            isFilterActive={isFilterActive}
            onFilterClick={handleOpenFilters}
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
            onDelete={handleDelete}
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
