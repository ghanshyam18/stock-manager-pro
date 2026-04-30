'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Calendar, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { SafeImage } from '@/shared/components/SafeImage';
import { useNativeBack } from '@/shared/hooks/useNativeBack';
import { formatDate, formatTime } from '@/shared/utils/date';

import { useItemDetails } from '../hooks/useItemDetails';
import { type InventoryItem } from '../services/db';

/**
 * ItemDetailModal shows the complete history and details for a specific design.
 * Now refactored as a Mantine Context Modal for better state management.
 */
export function ItemDetailModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ item: InventoryItem; isMobile: boolean }>) {
  const { item, isMobile } = innerProps;
  const { history, totalStock, entriesCount, loadMore, hasMore, isLoadingMore } =
    useItemDetails(item);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Unified Virtualizer: Index 0 is the Hero section, 1+ are history entries
  const virtualizer = useVirtualizer({
    count: history.length + 1,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (index === 0 ? (isMobile ? 550 : 650) : 74),
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

  if (!item) return null;

  return (
    <Box
      style={{
        height: isMobile ? '100dvh' : '85vh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--mantine-color-gray-0)',
        overflow: 'hidden', // Force scroll to internal div
      }}
    >
      <ModalHeader onClose={() => context.closeModal(id)} />

      {/* Main Scroll Viewport - This MUST be the only scrollable area */}
      <div
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
        <div
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
              <div
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
                    <SafeImage
                      src={item.image}
                      alt={item.designNo}
                      w="100%"
                      h={isMobile ? 320 : 450}
                      style={{ objectFit: 'cover' }}
                    />
                    <Stack p="md" gap="md" mt="-32px" style={{ position: 'relative', zIndex: 10 }}>
                      <ItemHeroSection
                        item={item}
                        entriesCount={entriesCount}
                        totalStock={totalStock}
                      />
                      <Group justify="space-between" px="xs">
                        <Title order={4} fw={800}>
                          Transaction History
                        </Title>
                        <Badge variant="light" color="gray">
                          {entriesCount} Total Records
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                ) : entry ? (
                  <Box px="md" py={2}>
                    <HistoryRecordCard entry={entry} />
                  </Box>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Loading Footer */}
        {hasMore && (
          <Center py="md" pb="xl">
            {isLoadingMore && (
              <Group gap="xs">
                <Loader size="xs" color="blue" />
                <Text size="xs" c="dimmed" fw={600}>
                  Loading more history...
                </Text>
              </Group>
            )}
          </Center>
        )}
      </div>
    </Box>
  );
}

function HistoryRecordCard({ entry }: { entry: InventoryItem }) {
  return (
    <Paper
      p="sm"
      radius="lg"
      withBorder
      shadow="xs"
      style={{ backgroundColor: 'var(--mantine-color-white)' }}
      data-testid="history-record-card"
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm">
          <Center
            w={36}
            h={36}
            style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '10px' }}
          >
            <Calendar size={18} color="var(--mantine-color-gray-6)" />
          </Center>
          <Stack gap={0}>
            <Text size="sm" fw={800}>
              {formatDate(entry.date)}
            </Text>
            <Text size="xs" color="dimmed" fw={500}>
              {formatTime(entry.createdAt)}
            </Text>
          </Stack>
        </Group>
        <Stack align="flex-end" gap={2}>
          <Badge size="md" radius="sm" color="blue" variant="light" fw={900}>
            +{entry.quantity}
          </Badge>
          <Text size="xs" fw={800} color="green.8">
            ₹{entry.price}
          </Text>
        </Stack>
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
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
      >
        <X size={24} />
      </ActionIcon>
      <Title order={4} fw={800}>
        Item Details
      </Title>
      <Box w={32} />
    </Group>
  );
}

function ItemHeroSection({
  item,
  entriesCount,
  totalStock,
}: {
  item: InventoryItem;
  entriesCount: number;
  totalStock: number;
}) {
  return (
    <Paper
      p="xl"
      radius="32px"
      shadow="xl"
      withBorder
      style={{
        borderTop: 'none',
        backgroundColor: 'var(--mantine-color-white)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      }}
      data-testid="item-hero-section"
    >
      <Stack gap="xl">
        <Stack gap={4}>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xs" fw={800} c="blue.6" lts={1} tt="uppercase" mb={4}>
                Design Identity
              </Text>
              <Title order={1} fw={900} style={{ fontSize: '32px', letterSpacing: '-1px' }}>
                {item.designNo}
              </Title>
            </Box>
            <Badge variant="light" color="green" size="lg" radius="md">
              IN STOCK
            </Badge>
          </Group>
        </Stack>

        <Group grow gap="md">
          <StatBox label="Entries" value={entriesCount} color="gray" icon="list" />
          <StatBox label="Balance" value={totalStock} color="blue" icon="stock" />
        </Group>
      </Stack>
    </Paper>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const isGray = color === 'gray';
  return (
    <Box
      p="md"
      style={{
        backgroundColor: isGray ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-blue-0)',
        borderRadius: '20px',
        border: `1px solid ${isGray ? 'var(--mantine-color-gray-1)' : 'var(--mantine-color-blue-1)'}`,
      }}
      data-testid={`stat-box-${label.toLowerCase().replace(' ', '-')}`}
    >
      <Text size="xs" c={isGray ? 'dimmed' : 'blue.7'} tt="uppercase" fw={800} lts={1} mb={4}>
        {label}
      </Text>
      <Text fw={900} size="24px" c={isGray ? 'dark.4' : 'blue.9'}>
        {value}
      </Text>
    </Box>
  );
}
