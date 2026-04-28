'use client';

import {
  Button,
  Divider,
  Drawer,
  FileButton,
  Group,
  LoadingOverlay,
  Progress,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Download, Upload } from 'lucide-react';
import { useState } from 'react';

import { useOverlayHistory } from '@/shared/hooks/useOverlayHistory';
import { DataManagement } from '@/shared/utils/dataManagement';

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
 */
export function InventoryView() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Data Management Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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
    isLoadingMore,
    isStale,
  } = useInventory();

  // Back button handling
  useOverlayHistory(modalOpened, closeModal, 'inventory-item-details');
  useOverlayHistory(filterOpened, closeFilter, 'inventory-filters');

  // Event Handlers
  const handleDelete = async (id?: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await inventoryService.deleteItem(id);
    }
  };

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    openModal();
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
  };

  return (
    <Stack
      gap="md"
      style={{ flexGrow: 1, height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {/* Global Processing Overlay */}
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

      {/* Static Header Section */}
      <Stack gap="md">
        <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 200ms ease' }}>
          <InventorySearch
            search={search}
            onSearchChange={setSearch}
            designSuggestions={designSuggestions || []}
            isFilterActive={isFilterActive}
            onFilterClick={openFilter}
          />
        </div>
        <InventoryStats stats={stats} />
      </Stack>

      {/* Scrollable List Section */}
      <div style={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
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
            totalCount={stats.totalCount}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>

      {/* Date Filter & Settings Drawer */}
      <Drawer
        opened={filterOpened}
        onClose={closeFilter}
        title={<Text fw={800}>Settings & Filters</Text>}
        position="bottom"
        size="auto"
        radius="24px 24px 0 0"
        padding="xl"
        data-testid="filter-drawer"
      >
        <Stack gap="md">
          <Text size="sm" fw={700} c="dimmed" mb={-5}>
            DATE RANGE
          </Text>
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

          <Group grow mt="xs">
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

          <Divider my="sm" label="DATA MANAGEMENT" labelPosition="center" />

          <Group grow>
            <Button
              variant="light"
              color="blue"
              leftSection={<Download size={18} />}
              radius="xl"
              onClick={handleExport}
            >
              Export JSON
            </Button>
            <FileButton onChange={handleImport} accept="application/json">
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  color="teal"
                  leftSection={<Upload size={18} />}
                  radius="xl"
                >
                  Import JSON
                </Button>
              )}
            </FileButton>
          </Group>
          <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
            Large datasets are processed in chunks for stability.
          </Text>
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
