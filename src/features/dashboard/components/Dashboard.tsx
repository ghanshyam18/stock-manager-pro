'use client';

import {
  Autocomplete,
  Badge,
  Box,
  Center,
  Divider,
  Group,
  Indicator,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, IndianRupee, Package, Search, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ItemDetailModal } from '@/features/inventory/components/ItemDetailModal';
import { db, type InventoryItem } from '@/features/inventory/services/db';
import { useOverlayHistory } from '@/shared/hooks/useOverlayHistory';
import { formatDate } from '@/shared/utils/date';

export function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Back button handling for modal
  useOverlayHistory(opened, close, 'dashboard-item-details');

  const items = useLiveQuery(() => {
    return db.inventory.orderBy('date').reverse().toArray();
  });

  const designSuggestions = useLiveQuery(async () => {
    const keys = await db.inventory.orderBy('designNo').uniqueKeys();
    return keys.map((k) => String(k));
  }, []);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!search) return items;
    return items.filter((item) => item.designNo.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const stats = useMemo(() => {
    if (!filteredItems) return { totalQty: 0, totalValue: 0, uniqueDesigns: 0 };
    return {
      totalQty: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: filteredItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
      uniqueDesigns: new Set(filteredItems.map((i) => i.designNo)).size,
    };
  }, [filteredItems]);

  const groupedItems = useMemo(() => {
    if (!filteredItems) return {};
    return filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.designNo]) {
          acc[item.designNo] = {
            qty: 0,
            value: 0,
            entries: 0,
            latestDate: item.date,
            representativeItem: item,
          };
        }
        acc[item.designNo].qty += item.quantity;
        acc[item.designNo].value += item.quantity * item.price;
        acc[item.designNo].entries += 1;
        return acc;
      },
      {} as Record<
        string,
        {
          qty: number;
          value: number;
          entries: number;
          latestDate: string;
          representativeItem: InventoryItem;
        }
      >
    );
  }, [filteredItems]);

  return (
    <Stack p="xs" gap="xl">
      {/* Search Header - Sticky and Premium */}
      <Paper
        p="sm"
        radius="xl"
        withBorder
        shadow="md"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Autocomplete
          placeholder="Quick search designs..."
          leftSection={<Search size={18} strokeWidth={2.5} color="var(--mantine-color-blue-6)" />}
          value={search}
          onChange={setSearch}
          data={designSuggestions || []}
          size="md"
          radius="xl"
          variant="filled"
          maxDropdownHeight={250}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-gray-0)',
              border: 'none',
              '&:focus': {
                backgroundColor: 'var(--mantine-color-white)',
              },
            },
          }}
        />
      </Paper>

      {/* Stats Section - More Compact & Elegant */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          {
            label: 'Total Stock',
            value: stats.totalQty.toLocaleString(),
            icon: Package,
            color: 'blue',
            suffix: ' Pcs',
          },
          {
            label: 'Total Value',
            value: `₹${stats.totalValue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'green',
            suffix: '',
          },
          {
            label: 'Unique Designs',
            value: stats.uniqueDesigns,
            icon: TrendingUp,
            color: 'violet',
            suffix: '',
          },
        ].map(
          (stat) =>
            stat.label && (
              <Paper
                key={stat.label}
                p="md"
                radius="20px"
                withBorder
                shadow="sm"
                bg="white"
                style={{
                  transition: 'transform 0.2s ease',
                  cursor: 'default',
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="xs" color="dimmed" fw={800} tt="uppercase" lts={1}>
                      {stat.label}
                    </Text>
                    <Group gap={4} align="baseline">
                      <Text size="24px" fw={900}>
                        {stat.value}
                      </Text>
                      <Text size="xs" fw={700} color="dimmed">
                        {stat.suffix}
                      </Text>
                    </Group>
                  </Stack>
                  <Box
                    p="sm"
                    style={{
                      backgroundColor: `var(--mantine-color-${stat.color}-0)`,
                      borderRadius: '14px',
                    }}
                  >
                    <stat.icon
                      size={22}
                      color={`var(--mantine-color-${stat.color}-6)`}
                      strokeWidth={2.5}
                    />
                  </Box>
                </Group>
              </Paper>
            )
        )}
      </SimpleGrid>

      {/* Design Summary - Grid with Clickable Cards */}
      <Stack gap="md">
        <Group justify="space-between" px="xs">
          <Title order={3} fw={900} size="h4">
            Design Summary
          </Title>
          <Indicator disabled={!search} color="blue" offset={2} size={8} processing>
            <Badge variant="light" size="lg" radius="md">
              {Object.keys(groupedItems).length} Designs
            </Badge>
          </Indicator>
        </Group>

        {Object.entries(groupedItems).length === 0 ? (
          <Paper
            p="xl"
            radius="24px"
            withBorder
            style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}
          >
            <Center>
              <Stack align="center" gap="xs">
                <Search size={40} strokeWidth={1} style={{ opacity: 0.3 }} />
                <Text color="dimmed" fw={600}>
                  No matching designs found
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {Object.entries(groupedItems).map(([designNo, data]) => (
              <Paper
                key={designNo}
                p="md"
                radius="24px"
                withBorder
                shadow="xs"
                onClick={() => {
                  setSelectedItem(data.representativeItem);
                  open();
                }}
                style={{
                  backgroundColor: 'var(--mantine-color-white)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: '1px solid var(--mantine-color-gray-2)',
                }}
                className="hover-card"
              >
                <Group justify="space-between" mb="sm" wrap="nowrap">
                  <Stack gap={0}>
                    <Text fw={900} size="lg" color="blue.9">
                      {designNo}
                    </Text>
                    <Group gap={4}>
                      <Calendar size={12} color="var(--mantine-color-gray-5)" />
                      <Text size="xs" color="dimmed" fw={600}>
                        Updated: {formatDate(data.latestDate)}
                      </Text>
                    </Group>
                  </Stack>
                  <Badge variant="filled" color="dark" size="md" radius="sm" fw={800}>
                    {data.entries} Entries
                  </Badge>
                </Group>

                <Divider my="md" variant="dotted" />

                <Group grow gap="md">
                  <Box
                    p="sm"
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <Text size="xs" color="dimmed" fw={800} tt="uppercase" lts={1}>
                      Qty
                    </Text>
                    <Text fw={900} size="md">
                      {data.qty}
                    </Text>
                  </Box>
                  <Box
                    p="sm"
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-0)',
                      borderRadius: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <Text size="xs" color="blue.7" fw={800} tt="uppercase" lts={1}>
                      Value
                    </Text>
                    <Text fw={900} size="md" color="blue.9">
                      ₹{data.value.toLocaleString()}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <ItemDetailModal item={selectedItem} opened={opened} onClose={close} isMobile={isMobile} />
    </Stack>
  );
}
