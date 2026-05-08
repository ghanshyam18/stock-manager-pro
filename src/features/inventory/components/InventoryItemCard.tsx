import { ActionIcon, Card, Group, Stack, Text, Title } from '@mantine/core';
import { ChevronRight, Package } from 'lucide-react';
import { memo } from 'react';

import { SafeImage } from '@/shared/components/SafeImage';

import { type DesignItem } from '../services/db';

interface InventoryItemCardProps {
  item: DesignItem;
  onSelect: (item: DesignItem) => void;
}

export const InventoryItemCard = memo(({ item, onSelect }: InventoryItemCardProps) => {
  return (
    <Card
      padding="sm"
      radius="lg"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-white)',
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: 'var(--mantine-shadow-xs)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(item)}
      data-testid={`inventory-item-${item.designNo}`}
    >
      <Group wrap="nowrap" gap="md" align="center" style={{ height: '100%' }}>
        {/* Aspect Ratio Safe Image Frame */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <SafeImage
            src={item.image}
            w={80}
            h={80}
            radius="md"
            alt={item.designNo}
            style={{
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            data-testid="item-image"
          />
        </div>

        {/* Content Section */}
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          <Title
            order={3}
            size="h5"
            fw={900}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.3px',
              color: 'var(--mantine-color-gray-9)',
            }}
            data-testid="item-title"
          >
            {item.designNo}
          </Title>

          {/* Minimalist parameters without any text labels */}
          <Group gap="md" wrap="nowrap" align="center">
            {/* Quantity representation: Icon + Value */}
            <Group gap={4} wrap="nowrap" style={{ color: 'var(--mantine-color-blue-6)' }}>
              <Package size={14} strokeWidth={2.5} />
              <Text size="sm" fw={800}>
                {item.totalQuantity}
              </Text>
            </Group>

            {/* Total Value representation: Currency + Value */}
            <Text size="sm" fw={800} c="teal.7">
              ₹{item.totalValue.toLocaleString()}
            </Text>
          </Group>
        </Stack>

        {/* Click indicator arrow */}
        <ActionIcon variant="subtle" color="gray" radius="xl" size="md" style={{ flexShrink: 0 }}>
          <ChevronRight size={16} strokeWidth={3} />
        </ActionIcon>
      </Group>
    </Card>
  );
});

InventoryItemCard.displayName = 'InventoryItemCard';
