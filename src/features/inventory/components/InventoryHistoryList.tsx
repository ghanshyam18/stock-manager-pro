import { Box, Center, Group, Loader, Stack, Text } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { type DesignItem } from '../services/db';
import { InventoryItemCard } from './InventoryItemCard';

interface InventoryHistoryListProps {
  items: DesignItem[];
  isMobile: boolean;
  onSelect: (item: DesignItem) => void;
  loadMore: () => void;
  hasMore: boolean;
  totalCount: number;
  isLoadingMore: boolean;
}

/**
 * InventoryHistoryList - SaaS-Grade Virtualization.
 * Renders a list of unique Design Items instead of individual transactions.
 */
export function InventoryHistoryList({
  items,
  isMobile,
  onSelect,
  loadMore,
  hasMore,
  totalCount,
  isLoadingMore,
}: InventoryHistoryListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? 116 : 106),
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Infinite loader trigger
  useEffect(() => {
    if (virtualItems.length > 0) {
      const lastItem = virtualItems[virtualItems.length - 1];
      if (lastItem.index >= items.length - 10 && hasMore && !isLoadingMore) {
        loadMore();
      }
    }
  }, [virtualItems, items.length, hasMore, loadMore, isLoadingMore]);

  if (items.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Search size={48} strokeWidth={1.5} color="var(--mantine-color-gray-4)" />
          <Text c="dimmed" fw={700} size="sm">
            No items match your filters
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      ref={scrollRef}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
      }}
    >
      <Box
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          if (!item) return null;

          return (
            <Box
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                padding: '6px 0',
                willChange: 'transform',
              }}
            >
              <InventoryItemCard item={item} onSelect={onSelect} />
            </Box>
          );
        })}
      </Box>

      {/* Enhanced Loader Footer */}
      <Center py="xl" pb={100}>
        {isLoadingMore ? (
          <Group gap="sm">
            <Loader size="sm" color="blue" />
            <Text size="sm" c="dimmed" fw={700}>
              Fetching next batch... ({items.length} loaded)
            </Text>
          </Group>
        ) : hasMore ? (
          <Text size="xs" c="dimmed" fw={600}>
            Scroll for more (Total Unique: {totalCount})
          </Text>
        ) : (
          <Text size="sm" c="dimmed" fw={700}>
            All {totalCount} designs loaded
          </Text>
        )}
      </Center>
    </Box>
  );
}
