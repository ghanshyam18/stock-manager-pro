import { ActionIcon, Box, Card, Group, Stack, Text } from '@mantine/core';
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
      component="button"
      padding="sm"
      radius="lg"
      withBorder
      shadow="xs"
      className="hover-card"
      style={{
        textAlign: 'left',
        display: 'block',
        width: '100%',
        cursor: 'pointer',
        backgroundColor: 'var(--mantine-color-body)',
      }}
      onClick={() => onSelect(item)}
      data-testid={`inventory-item-${item.designNo}`}
    >
      <Group wrap="nowrap" gap="md" align="center" style={{ height: '100%' }}>
        {/* Aspect Ratio Safe Image Frame */}
        <Box style={{ position: 'relative', flexShrink: 0 }}>
          <SafeImage
            src={item.image}
            w={80}
            h={80}
            radius="md"
            alt={item.designNo}
            fit="cover"
            style={{
              boxShadow: 'var(--mantine-shadow-xs)',
            }}
            data-testid="item-image"
          />
        </Box>

        {/* Content Section */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Text
            size="md"
            fw={900}
            truncate
            style={{
              letterSpacing: '-0.3px',
              color: 'var(--mantine-color-text)',
            }}
            data-testid="item-title"
          >
            {item.designNo}
          </Text>

          {/* Minimalist parameters */}
          <Group gap="md" wrap="nowrap" align="center">
            {/* Quantity representation: Icon + Value */}
            <Group gap={4} wrap="nowrap" style={{ color: 'var(--mantine-color-blue-6)' }}>
              <Package size={14} strokeWidth={2.5} />
              <Text size="sm" fw={800}>
                {item.totalQuantity}
              </Text>
            </Group>

            {/* Total Value representation */}
            <Text size="sm" fw={800} c="teal.7">
              ₹{item.totalValue.toLocaleString()}
            </Text>
          </Group>
        </Stack>

        {/* Click indicator arrow */}
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="xl"
          size="md"
          style={{ flexShrink: 0 }}
          aria-label="View Details"
        >
          <ChevronRight size={16} strokeWidth={3} />
        </ActionIcon>
      </Group>
    </Card>
  );
});

InventoryItemCard.displayName = 'InventoryItemCard';
