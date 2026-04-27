import { Card, Group, Skeleton, Stack } from '@mantine/core';

/**
 * InventorySkeleton mimics the layout of InventoryItemCard for a smooth loading state.
 */
export function InventorySkeleton() {
  return (
    <Card
      padding="xs"
      radius="lg"
      withBorder
      shadow="xs"
      style={{ backgroundColor: 'var(--mantine-color-white)', height: 130 }}
    >
      <Group wrap="nowrap" gap="sm" align="center" style={{ height: '100%' }}>
        {/* Image Skeleton */}
        <Skeleton w={100} h={100} radius="md" animate />

        <Stack gap={6} style={{ flex: 1 }}>
          <Group justify="space-between" wrap="nowrap">
            {/* Title Skeleton */}
            <Skeleton h={20} w="60%" radius="sm" animate />
            {/* Action Icon Skeleton */}
            <Skeleton h={24} w={24} radius="md" animate />
          </Group>

          {/* Date Skeleton */}
          <Group gap={4}>
            <Skeleton h={12} w="30%" radius="xs" animate />
          </Group>

          {/* Badge Skeletons */}
          <Group gap="xs" mt={8}>
            <Skeleton h={22} w={60} radius="sm" animate />
            <Skeleton h={22} w={80} radius="sm" animate />
          </Group>
        </Stack>
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
