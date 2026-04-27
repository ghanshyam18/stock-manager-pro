import { Box, Center, Group, Loader, Stack, Text } from '@mantine/core';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { type InventoryItem } from '../services/db';
import { InventoryItemCard } from './InventoryItemCard';

interface InventoryHistoryListProps {
  items: InventoryItem[];
  isMobile: boolean;
  onDelete: (id?: string) => void;
  onSelect: (item: InventoryItem) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function InventoryHistoryList({
  items,
  isMobile,
  onDelete,
  onSelect,
  loadMore,
  hasMore,
}: InventoryHistoryListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setScrollMargin(parentRef.current.offsetTop);
    }
  }, [items]);

  const rowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => (isMobile ? 130 : 140),
    overscan: 10,
    scrollMargin,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Load more when the last item is visible
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= items.length - 1 && hasMore) {
      loadMore();
    }
  }, [virtualItems, items.length, hasMore, loadMore]);

  if (items.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Search size={48} strokeWidth={1} style={{ opacity: 0.5 }} />
          <Text color="dimmed" fw={500}>
            No history found
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box px="xs">
      <Box
        ref={parentRef}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
          paddingBottom: '40px',
        }}
        data-testid="inventory-virtual-list"
      >
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          if (!item) return null;
          return (
            <Box
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                padding: '6px 0',
              }}
            >
              <InventoryItemCard item={item} onDelete={onDelete} onSelect={onSelect} />
            </Box>
          );
        })}
      </Box>

      {hasMore && (
        <Center py="xl">
          <Group gap="sm">
            <Loader size="sm" color="blue" />
            <Text size="sm" color="dimmed" fw={600}>
              Loading more entries...
            </Text>
          </Group>
        </Center>
      )}
    </Box>
  );
}
