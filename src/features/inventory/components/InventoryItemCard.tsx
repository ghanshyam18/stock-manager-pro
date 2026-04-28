import { ActionIcon, Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Calendar, Trash2 } from 'lucide-react';

import { SafeImage } from '@/shared/components/SafeImage';
import { formatDate } from '@/shared/utils/date';

import { type InventoryItem } from '../services/db';

interface InventoryItemCardProps {
  item: InventoryItem;
  onDelete: (id?: number) => void;
  onSelect: (item: InventoryItem) => void;
}

export function InventoryItemCard({ item, onDelete, onSelect }: InventoryItemCardProps) {
  return (
    <Card
      padding="xs"
      radius="lg"
      withBorder
      shadow="xs"
      style={{ backgroundColor: 'var(--mantine-color-white)', height: '100%' }}
      data-testid={`inventory-item-${item.designNo}`}
    >
      <Group wrap="nowrap" gap="sm" align="center" style={{ height: '100%' }}>
        <SafeImage
          src={item.image}
          w={100}
          h={100}
          radius="md"
          alt={item.designNo}
          style={{ cursor: 'pointer', objectFit: 'cover' }}
          onClick={() => onSelect(item)}
          data-testid="item-image"
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap">
            <Title
              order={3}
              size="h5"
              fw={800}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onClick={() => onSelect(item)}
              data-testid="item-title"
            >
              {item.designNo}
            </Title>
            <ActionIcon
              variant="subtle"
              color="red"
              radius="md"
              size="sm"
              onClick={() => onDelete(item.id)}
              data-testid="delete-item-button"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
          <Group gap={4}>
            <Calendar size={12} color="var(--mantine-color-gray-5)" />
            <Text size="xs" color="dimmed" fw={500}>
              {formatDate(item.date)}
            </Text>
          </Group>
          <Group gap="xs" mt={4}>
            <Badge size="sm" variant="light" color="blue" radius="sm">
              {item.quantity} Pcs
            </Badge>
            <Badge size="sm" variant="light" color="green" radius="sm">
              ₹{item.price}
            </Badge>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
