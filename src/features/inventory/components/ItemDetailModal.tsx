'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Calendar, X } from 'lucide-react';

import { SafeImage } from '@/shared/components/SafeImage';
import { formatDate, formatTime } from '@/shared/utils/date';

import { useItemDetails } from '../hooks/useItemDetails';
import { type InventoryItem } from '../services/db';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  opened: boolean;
  onClose: () => void;
  isMobile: boolean;
}

/**
 * ItemDetailModal shows the complete history and details for a specific design.
 * Follows the high-standard by using custom hooks and modular internal components.
 */
export function ItemDetailModal({ item, opened, onClose, isMobile }: ItemDetailModalProps) {
  const { history, totalStock, entriesCount } = useItemDetails(item);

  if (!item) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={isMobile}
      size="lg"
      padding={0}
      radius="lg"
      withCloseButton={false}
      zIndex={1000}
      styles={{
        body: { height: '100%', backgroundColor: 'var(--mantine-color-gray-0)' },
      }}
      data-testid="item-detail-modal"
    >
      <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ModalHeader onClose={onClose} />

        <Box style={{ flex: 1, overflowY: 'auto' }} data-testid="modal-scroll-area">
          <SafeImage
            src={item.image}
            alt={item.designNo}
            w="100%"
            h={isMobile ? 320 : 450}
            style={{ objectFit: 'cover' }}
            data-testid="modal-hero-image"
          />

          <Stack p="md" pb="xl" gap="xl" mt="-32px" style={{ position: 'relative', zIndex: 10 }}>
            <ItemHeroSection item={item} entriesCount={entriesCount} totalStock={totalStock} />
            <TransactionHistorySection history={history} />
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

/**
 * Internal pure sub-components for better maintainability
 */

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
    <Paper p="lg" radius="24px" shadow="md" withBorder data-testid="item-hero-section">
      <Stack gap="xl">
        <Box>
          <Badge variant="dot" size="sm" mb={4}>
            Active Design
          </Badge>
          <Title order={2} fw={900}>
            {item.designNo}
          </Title>
        </Box>

        <Group grow gap="md">
          <StatBox label="Entries" value={entriesCount} color="gray" />
          <StatBox label="Total Stock" value={totalStock} color="blue" />
        </Group>
      </Stack>
    </Paper>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box
      p="md"
      style={{
        backgroundColor: `var(--mantine-color-${color}-0)`,
        borderRadius: '16px',
        border: `1px solid var(--mantine-color-${color}-1)`,
      }}
      data-testid={`stat-box-${label.toLowerCase().replace(' ', '-')}`}
    >
      <Text
        size="xs"
        color={color === 'gray' ? 'dimmed' : `${color}.7`}
        tt="uppercase"
        fw={800}
        lts={1}
      >
        {label}
      </Text>
      <Text fw={900} size="xl" color={color === 'gray' ? undefined : `${color}.9`}>
        {value}
      </Text>
    </Box>
  );
}

function TransactionHistorySection({ history }: { history: InventoryItem[] }) {
  return (
    <Stack gap="md" data-testid="transaction-history-section">
      <Group justify="space-between" px="xs">
        <Title order={4} fw={800}>
          Transaction History
        </Title>
        <Badge variant="light" color="gray">
          {history.length} Records
        </Badge>
      </Group>

      <Stack gap="xs">
        {history.map((entry) => (
          <HistoryRecordCard key={entry.id} entry={entry} />
        ))}
      </Stack>
    </Stack>
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
