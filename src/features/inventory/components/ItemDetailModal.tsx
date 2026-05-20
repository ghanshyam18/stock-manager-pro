'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { SafeImage } from '@/shared/components/SafeImage';
import { useNativeBack } from '@/shared/hooks/useNativeBack';
import { formatDate, formatTime } from '@/shared/utils/date';

import { useItemDetails } from '../hooks/useItemDetails';
import { type DesignItem, type InventoryItem } from '../services/db';
import { inventoryService } from '../services/inventoryService';

/**
 * ItemDetailModal shows the complete history and details for a specific design.
 * Now refactored as a Mantine Context Modal for better state management.
 */
export function ItemDetailModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ item: DesignItem; isMobile: boolean }>) {
  const { item, isMobile } = innerProps;
  const { history, totalStock, totalValue, entriesCount, loadMore, hasMore, isLoadingMore } =
    useItemDetails(item);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleDelete = (recordId?: number) => {
    if (!recordId) return;
    setDeleteTargetId(recordId);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Unified Virtualizer: Index 0 is the Hero section, 1+ are history entries
  const virtualizer = useVirtualizer({
    count: history.length + 1,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (index === 0 ? (isMobile ? 520 : 620) : 74),
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Handle mobile back button
  useNativeBack(true, () => context.closeModal(id), 'item-details');

  // Infinite loader trigger
  useEffect(() => {
    if (virtualItems.length > 0) {
      const lastItem = virtualItems[virtualItems.length - 1];
      // Subtract 1 because index 0 is the hero
      if (lastItem.index >= history.length - 5 && hasMore && !isLoadingMore) {
        loadMore();
      }
    }
  }, [virtualItems, history.length, hasMore, loadMore, isLoadingMore]);

  // Automatically close modal if the design is deleted (history empty and no entries)
  useEffect(() => {
    if (history !== undefined && history.length === 0 && !isLoadingMore) {
      const timer = setTimeout(() => {
        context.closeModal(id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [history, isLoadingMore, context, id]);

  if (!item) return null;

  return (
    <Box
      style={{
        height: isMobile ? '100dvh' : '85vh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--mantine-color-body)',
        overflow: 'hidden', // Force scroll to internal div
      }}
    >
      <ModalHeader onClose={() => context.closeModal(id)} />

      {/* Main Scroll Viewport - This MUST be the only scrollable area */}
      <Box
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          height: '100%', // Required for virtualization to detect height
        }}
        data-testid="modal-scroll-area"
      >
        {/* Virtualized Inner Container */}
        <Box
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isHero = virtualRow.index === 0;
            const historyIndex = virtualRow.index - 1;
            const entry = history[historyIndex];

            return (
              <Box
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  willChange: 'transform',
                  zIndex: isHero ? 10 : 1,
                }}
              >
                {isHero ? (
                  <Box>
                    <Box
                      style={{ position: 'relative', width: '100%', height: isMobile ? 280 : 400 }}
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.designNo}
                        w="100%"
                        h="100%"
                        style={{ objectFit: 'cover' }}
                      />
                      <Badge
                        variant="filled"
                        color={totalStock > 0 ? 'teal' : 'red'}
                        size="md"
                        radius="md"
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          zIndex: 11,
                          boxShadow: 'var(--mantine-shadow-md)',
                          fontWeight: 800,
                        }}
                      >
                        {totalStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </Badge>
                    </Box>
                    <Stack p="md" gap="md">
                      <ItemHeroSection
                        item={item}
                        totalStock={totalStock}
                        totalValue={totalValue}
                      />
                      <Group justify="space-between" px="xs" mt="xs">
                        <Title order={4} fw={800}>
                          Transaction History
                        </Title>
                        <Badge variant="light" color="gray" radius="sm">
                          {entriesCount} Records
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                ) : entry ? (
                  <Box px="md" py={3}>
                    <HistoryRecordCard entry={entry} onDelete={handleDelete} />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>

        {/* Loading Footer */}
        {hasMore && (
          <Center py="md" pb="xl">
            {isLoadingMore && (
              <Group gap="xs">
                <Loader size="xs" color="blue" />
                <Text size="xs" c="dimmed" fw={700}>
                  Loading more history...
                </Text>
              </Group>
            )}
          </Center>
        )}
      </Box>

      {/* Local Delete Confirmation Modal */}
      <Modal
        opened={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title={<Text fw={800}>Delete Record</Text>}
        centered
        radius="lg"
        zIndex={2000}
      >
        <Stack gap="md">
          <Text size="sm" fw={700}>
            Are you sure you want to delete this inventory record? This action is permanent and
            cannot be undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              color="gray"
              radius="md"
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              radius="md"
              onClick={async () => {
                if (deleteTargetId) {
                  await inventoryService.deleteItem(deleteTargetId);
                  setDeleteTargetId(null);
                }
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

function HistoryRecordCard({
  entry,
  onDelete,
}: {
  entry: InventoryItem;
  onDelete?: (id?: number) => void;
}) {
  const totalValue = entry.quantity * entry.price;

  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      shadow="xs"
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-default-border)',
      }}
      data-testid="history-record-card"
    >
      <Group justify="space-between" wrap="nowrap">
        {/* Left Side: Direct Date & Time Stamps */}
        <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
          <Text
            size="sm"
            fw={800}
            style={{
              color: 'var(--mantine-color-text)',
            }}
            truncate
          >
            {formatDate(entry.date)}
          </Text>
          <Text size="xs" c="dimmed" fw={600}>
            {formatTime(entry.createdAt)}
          </Text>
        </Stack>

        {/* Right Side: Quantity and Price details */}
        <Group gap="sm" align="center" style={{ flexShrink: 0 }} wrap="nowrap">
          <Stack align="flex-end" gap={2}>
            {/* Quantity in theme blue badge */}
            <Badge size="md" radius="sm" color="blue" variant="light" fw={900}>
              +{entry.quantity} Pcs
            </Badge>

            {/* Total financial value of this entry */}
            <Text size="sm" fw={800} c="var(--mantine-color-text)">
              ₹{totalValue.toLocaleString()}
            </Text>

            {/* Unit rate subscript */}
            <Text size="xs" c="dimmed" fw={700}>
              rate: ₹{entry.price} / Pc
            </Text>
          </Stack>

          {onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              radius="md"
              size="md"
              aria-label="Delete history entry"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
              data-testid="delete-history-item-button"
              style={{ flexShrink: 0 }}
            >
              <Trash2 size={16} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Paper>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <Group
      p="md"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--mantine-color-body)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
      }}
      justify="space-between"
      wrap="nowrap"
      data-testid="modal-header"
    >
      <ActionIcon
        variant="subtle"
        size="lg"
        onClick={onClose}
        radius="xl"
        color="gray"
        data-testid="close-modal-button"
        aria-label="Close modal"
      >
        <X size={22} />
      </ActionIcon>
      <Title order={4} fw={900}>
        Item Details
      </Title>
      <Box w={32} />
    </Group>
  );
}

function ItemHeroSection({
  item,
  totalStock,
  totalValue,
}: {
  item: DesignItem;
  totalStock: number;
  totalValue: number;
}) {
  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      shadow="xs"
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-default-border)',
      }}
      data-testid="item-hero-section"
    >
      <Stack gap="md">
        {/* Design Name Block */}
        <Box style={{ minWidth: 0 }}>
          <Text size="xs" fw={800} c="dimmed" lts={1} tt="uppercase" mb={2}>
            DESIGN NUMBER
          </Text>
          <Text
            component="h3"
            size="lg"
            fw={900}
            truncate
            style={{ letterSpacing: '-0.3px', margin: 0 }}
          >
            {item.designNo}
          </Text>
        </Box>

        {/* Consolidated Metrics Group */}
        <Group justify="space-between" align="flex-end" wrap="nowrap">
          {/* Main Financial Metric */}
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
            <Text size="xs" c="dimmed" fw={800} lts={0.5} tt="uppercase">
              VALUATION
            </Text>
            <Text
              component="h2"
              size="xl"
              fw={900}
              c="teal.7"
              truncate
              style={{
                letterSpacing: '-0.3px',
                margin: 0,
              }}
            >
              ₹{totalValue.toLocaleString()}
            </Text>
          </Stack>

          {/* Current Stock Metric */}
          <Stack gap={2} align="flex-end" style={{ flexShrink: 0 }}>
            <Text size="xs" c="dimmed" fw={800} lts={0.5} tt="uppercase">
              TOTAL STOCK
            </Text>
            <Text size="xl" fw={900}>
              {totalStock}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
}
