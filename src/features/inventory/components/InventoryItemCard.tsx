import { ActionIcon, Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Calendar, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { SafeImage } from '@/shared/components/SafeImage';
import { formatDate } from '@/shared/utils/date';

import { type InventoryItem } from '../services/db';

interface InventoryItemCardProps {
  item: InventoryItem;
  onDelete: (id?: number) => void;
  onSelect: (item: InventoryItem) => void;
}

export const InventoryItemCard = memo(({ item, onDelete, onSelect }: InventoryItemCardProps) => {
  return (
    <Card
      padding="xs"
      radius="xl"
      withBorder
      shadow="sm"
      style={{
        backgroundColor: 'var(--mantine-color-white)',
        height: '100%',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(item)}
      data-testid={`inventory-item-${item.designNo}`}
    >
      <Group wrap="nowrap" gap="sm" align="center" style={{ height: '100%' }}>
        <SafeImage
          src={item.image}
          w={100}
          h={100}
          radius="lg"
          alt={item.designNo}
          style={{ objectFit: 'cover' }}
          data-testid="item-image"
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap">
            <Title
              order={3}
              size="h5"
              fw={900}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.3px',
              }}
              data-testid="item-title"
            >
              {item.designNo}
            </Title>
            <ActionIcon
              variant="subtle"
              color="red"
              radius="xl"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              data-testid="delete-item-button"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
          <Group gap={4}>
            <Calendar size={12} color="var(--mantine-color-gray-5)" />
            <Text size="xs" c="dimmed" fw={600}>
              {formatDate(item.date)}
            </Text>
          </Group>
          <Group gap="xs" mt={6}>
            <Badge size="sm" variant="light" color="blue" radius="md" fw={800}>
              {item.quantity} Pcs
            </Badge>
            <Badge size="sm" variant="light" color="teal" radius="md" fw={800}>
              ₹{item.price}
            </Badge>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
});

InventoryItemCard.displayName = 'InventoryItemCard';
