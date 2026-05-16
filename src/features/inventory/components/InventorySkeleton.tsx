import { Card, Group, Skeleton, Stack } from '@mantine/core';

/**
 * InventorySkeleton mimics the layout of InventoryItemCard for a smooth loading state.
 */
export function InventorySkeleton() {
  return (
    <Card
      padding="sm"
      radius="lg"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-white)',
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: 'var(--mantine-shadow-xs)',
      }}
    >
      <Group wrap="nowrap" gap="md" align="center" style={{ height: '100%' }}>
        {/* Image Skeleton */}
        <Skeleton w={80} h={80} radius="md" animate />

        {/* Content Section Skeleton */}
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          {/* Title Skeleton */}
          <Skeleton h={20} w="55%" radius="sm" animate />

          {/* Minimalist parameters representation */}
          <Group gap="md" wrap="nowrap" align="center" mt={4}>
            {/* Quantity representation placeholder */}
            <Skeleton h={16} w={35} radius="sm" animate />

            {/* Value representation placeholder */}
            <Skeleton h={16} w={65} radius="sm" animate />
          </Group>
        </Stack>

        {/* Chevron Action Indicator Skeleton */}
        <Skeleton h={24} w={24} radius="xl" animate style={{ flexShrink: 0 }} />
      </Group>
    </Card>
  );
}

/**
 * Renders a list of skeletons to fill the screen
 */
export function InventoryListingSkeleton() {
  return (
    <Stack gap="md" px="xs">
      {[...Array(6)].map((_, i) => (
        <InventorySkeleton key={i} />
      ))}
    </Stack>
  );
}
